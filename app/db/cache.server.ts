import { LRUCache } from 'lru-cache';
import {
    type BettorTradeQuery,
    type EventTradeQuery,
    type OpenTradeQuery,
} from '../utils/trade-model';

export const unsettledTradeCache = new LRUCache<string, OpenTradeQuery>({
    max: 10, // maximum number of items in the cache
    ttl: 1000 * 30, // items expire after 30 seconds
});

export const eventTradeCache = new LRUCache<string, EventTradeQuery>({
    max: 10, // maximum number of items in the cache
    ttl: 1000 * 60, // items expire after 1 minutes
});

export const bettorTradeCache = new LRUCache<string, BettorTradeQuery>({
    max: 10, // maximum number of items in the cache
    ttl: 1000 * 60, // items expire after 1 minutes
});
