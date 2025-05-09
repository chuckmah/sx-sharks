import dayjs from 'dayjs';
import { chunk } from 'lodash';

import type { SportxMarketDao, SportxTradeDao } from '../db/index.cjs';
import type { SportXIGetTradesRequest } from '../services/sportx-model.cjs';
import type { SportxHttpService } from '../services/sportx-service.cjs';
import { processSportxTrades } from './get-sportx-trades.cjs';

export const getSettledSportxTradesFrom30days = async (
    marketDao: SportxMarketDao,
    tradeDao: SportxTradeDao,
    sportxService: SportxHttpService
): Promise<void> => {
    const beforeXDayAgo = dayjs().subtract(6, 'hours').unix();

    const result = await tradeDao.getUnsettledMarketHashes(beforeXDayAgo);

    console.log(
        `***getSettledSportxTradesFrom30days ** Retrieved ${result.length} unsettled trades`
    );

    const chunks = chunk(result, 25);

    console.log(`Created ${chunks.length} chunks from unsettled trades`);

    for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chuck=${i + 1} of = ${chunks.length}`);
        const chunk = chunks[i];
        await getTradesFromMarketHashes(
            marketDao,
            tradeDao,
            sportxService,
            chunk,
            true
        );
    }
};

export const getTradesFromMarketHashes = async (
    marketDao: SportxMarketDao,
    tradeDao: SportxTradeDao,
    sportxService: SportxHttpService,
    marketHashes: string[],
    settledOnly = true
): Promise<void> => {
    let isPaginationFinished = false;
    let nexPaginationKey = undefined;
    let currentIndex = 0;

    while (!isPaginationFinished) {
        const params: SportXIGetTradesRequest = {
            marketHashes,
        };

        if (settledOnly) {
            params.settled = true;
        }

        if (nexPaginationKey) {
            params.paginationKey = nexPaginationKey;
        }
        console.log(`params=${JSON.stringify(params)}`);
        const paginatedTrades = await sportxService.getTrades(params);
        console.log(`received=${paginatedTrades.data.trades.length} trades`);
        if (paginatedTrades.data.trades.length > 0) {
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

            if (paginatedTrades.data.nextKey) {
                nexPaginationKey = paginatedTrades.data.nextKey;
                currentIndex =
                    currentIndex + paginatedTrades.data.trades.length;
            } else {
                isPaginationFinished = true;
            }
        } else {
            isPaginationFinished = true;
        }

        await new Promise((r) => setTimeout(r, 500)); // throttle
    }
};
