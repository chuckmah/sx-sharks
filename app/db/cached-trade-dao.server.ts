import dayjs from 'dayjs';
import round from 'lodash/round.js';
import {
    type BettorTradeQuery,
    type EventTradeQuery,
    type OpenTradeQuery,
} from '../utils/trade-model';
import {
    bettorTradeCache,
    eventTradeCache,
    unsettledTradeCache,
} from './cache.server';
import {
    getBettorTrades,
    getEventTrades,
    getOpenTrades,
} from './trade-dao.server';

const getMemoryUsage = () => {
    return (
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
    );
};

export const getCachedOpenTrades = async (): Promise<OpenTradeQuery> => {
    const cacheKey = `getOpenTrades`;

    const cachedData = unsettledTradeCache.get(cacheKey);
    if (cachedData) {
        console.log(
            `Cache hit for getOpenTrades memory: ${getMemoryUsage()} MB size: ${
                unsettledTradeCache.size
            }`
        );
        return cachedData;
    }

    const startTime = performance.now();

    const openTrades = await getOpenTrades(dayjs().subtract(1, 'year').unix());
    const endTime = performance.now();
    const result = {
        trades: openTrades,
        generatedDate: dayjs().unix(),
        duration: round(endTime - startTime, 2),
    };
    console.log(
        `${dayjs().format(
            'YYYY-MM-DDTHH:mm:ssZ[Z]'
        )} - getOpenTrades - duration ${
            endTime - startTime
        } ms number of trades = ${openTrades.length}`
    );

    unsettledTradeCache.set(cacheKey, result);

    return result;
};

export const getCachedEventTrades = async (
    eventId: string,
    all: boolean
): Promise<EventTradeQuery> => {
    const cacheKey = `getEventTrades-${eventId}-${all}`;

    const cachedData = eventTradeCache.get(cacheKey);
    if (cachedData) {
        console.log(
            `Cache hit for getEventTrades memory: ${getMemoryUsage()} MB size: ${
                eventTradeCache.size
            }`
        );
        return cachedData;
    }

    const startTime = performance.now();
    const trades = await getEventTrades(eventId, all);
    const endTime = performance.now();

    const result = {
        trades: trades,
        generatedDate: dayjs().unix(),
        duration: round(endTime - startTime, 2),
    };

    console.log(
        `${dayjs().format(
            'YYYY-MM-DDTHH:mm:ssZ[Z]'
        )} - getEventTrades - duration ${
            endTime - startTime
        } ms number of trades = ${trades.length}`
    );

    eventTradeCache.set(cacheKey, result);

    return result;
};

export const getCachedBettorTrades = async (
    bettor: string,
    all: boolean
): Promise<BettorTradeQuery> => {
    const cacheKey = `getBettorTrades-${bettor}-${all}`;

    const cachedData = bettorTradeCache.get(cacheKey);
    if (cachedData) {
        console.log(
            `Cache hit for getBettorTrades memory: ${getMemoryUsage()} MB size: ${
                bettorTradeCache.size
            }`
        );
        return cachedData;
    }

    const startTime = performance.now();
    const trades = await getBettorTrades(
        bettor,
        all ? undefined : dayjs().subtract(1, 'year').unix(),
        undefined,
        undefined,
        undefined
    );
    const endTime = performance.now();

    const result = {
        trades: trades,
        generatedDate: dayjs().unix(),
        duration: round(endTime - startTime, 2),
    };

    bettorTradeCache.set(cacheKey, result);

    return result;
};
