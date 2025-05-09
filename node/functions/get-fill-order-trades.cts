import { chunk } from 'lodash';

import type { SportxMarketDao, SportxTradeDao } from '../db/index.cjs';
import type { SportxHttpService } from '../services/sportx-service.cjs';
import { getTradesFromMarketHashes } from './get-settled-sportx-trades.cjs';

export const getFillOrderTraders = async (
    marketDao: SportxMarketDao,
    tradeDao: SportxTradeDao,
    sportxService: SportxHttpService
): Promise<void> => {
    const result = await tradeDao.getNoOrderFillMarketHashes();
    console.log(`Retrieved ${result.length} trades with no fill order`);

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
            false
        );
    }
};
