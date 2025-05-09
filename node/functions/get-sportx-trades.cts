import { maxBy } from 'lodash';
import type {
    SportxMarketDao,
    SportxParamsDao,
    SportxTradeDao,
} from '../db/index.cjs';
import type {
    SportXIGetTradesRequest,
    SportXIMarket,
    SportXITrade,
} from '../services/sportx-model.cjs';
import type { SportxHttpService } from '../services/sportx-service.cjs';

export const getLastSportxTrades = async (
    marketDao: SportxMarketDao,
    tradeDao: SportxTradeDao,
    paramsDao: SportxParamsDao,
    sportxService: SportxHttpService
): Promise<void> => {
    console.log('starting getLastSportxTrades');
    const lastBetTimeSyncString = await paramsDao.getParam('lastBetTimeSync');

    if (lastBetTimeSyncString) {
        console.log(`retrieved lastBetTimeSync=${lastBetTimeSyncString} `);
        const lastBetTimeSync = Number(lastBetTimeSyncString);

        const mostRecentTradeTime = await getSportxTrades(
            marketDao,
            tradeDao,
            sportxService,
            lastBetTimeSync
        );

        if (mostRecentTradeTime > -1) {
            await paramsDao.upsertSportXITrade(
                'lastBetTimeSync',
                (mostRecentTradeTime + 1).toString()
            );
            console.log(`saving lastBetTimeSync=${mostRecentTradeTime + 1} `);
        }
    }

    console.log('ending getLastSportxTrades v3');
};

export const getSportxTrades = async (
    marketDao: SportxMarketDao,
    tradeDao: SportxTradeDao,
    sportxService: SportxHttpService,
    startDate: number,
    endDate?: number
): Promise<number> => {
    let isPaginationFinished = false;
    let nexPaginationKey = undefined;
    let currentIndex = 0;
    let mostRecentTradeTime = -1;

    while (!isPaginationFinished) {
        const params: SportXIGetTradesRequest = {
            startDate: startDate,
        };

        if (endDate !== undefined) {
            params.endDate = endDate;
        }

        if (nexPaginationKey) {
            params.paginationKey = nexPaginationKey;
        }

        const paginatedTrades = await sportxService.getTrades(params);
        console.log(
            `Processing index ${currentIndex} to ${
                currentIndex + paginatedTrades.data.trades.length
            } of ${paginatedTrades.data.count} trades`
        );
        await processSportxTrades(
            tradeDao,
            marketDao,
            sportxService,
            paginatedTrades.data.trades
        );

        const mostRecentTradeTimeOfBatch = getMostRecentFilledTradeTime(
            paginatedTrades.data.trades
        );
        if (mostRecentTradeTimeOfBatch > mostRecentTradeTime) {
            mostRecentTradeTime = mostRecentTradeTimeOfBatch;
        }

        if (paginatedTrades.data.nextKey) {
            nexPaginationKey = paginatedTrades.data.nextKey;
            currentIndex = currentIndex + paginatedTrades.data.trades.length;
        } else {
            isPaginationFinished = true;
        }
    }

    return mostRecentTradeTime;
};

export const processSportxTrades = async (
    tradeDao: SportxTradeDao,
    marketDao: SportxMarketDao,
    sportxService: SportxHttpService,
    trades: SportXITrade[]
): Promise<void> => {
    for (let index = 0; index < trades.length; index++) {
        const trade = trades[index];
        try {
            await getOrSaveMarket(marketDao, sportxService, trade.marketHash);

            await tradeDao.upsertSportXITrade(trade);
        } catch (e: unknown) {
            console.warn(`Error processing trade =  ${JSON.stringify(trade)}`);
            throw e;
        }
    }
};

export const getOrSaveMarket = async (
    marketDao: SportxMarketDao,
    sportxService: SportxHttpService,
    marketHash: string
): Promise<SportXIMarket> => {
    let result = await marketDao.getSportxMarket(marketHash);

    if (!result) {
        await new Promise((r) => setTimeout(r, 200)); // throttle
        const retrievedMarkets = await sportxService.marketLookup([marketHash]);

        if (retrievedMarkets && retrievedMarkets[0]) {
            result = retrievedMarkets[0];
            await marketDao.upsertSportxMarket(result);
            console.log(`Creating market with id ${marketHash}`);
        } else {
            // console.error(`No market found with id ${marketHash}`);
            throw new Error(`No market found with id ${marketHash}`);
        }
    }

    return result;
};

const getMostRecentFilledTradeTime = (trades: SportXITrade[]): number => {
    const lastTrade = maxBy(
        trades.filter((trades) => trades.fillOrderHash !== undefined),
        (trade) => trade.betTime
    );
    if (lastTrade) {
        return lastTrade.betTime;
    } else {
        return -1;
    }
};
