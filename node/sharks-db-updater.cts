// import {
//     getLastSportxTrades,
//     getSettledSportxTradesFrom30days,
//     SportxHttpService,
//     SportxMarketDao,
//     SportxParamsDao,
//     SportxTradeDao,
// } from '@chuckmah/predictodds-db';
import 'dotenv/config';
import { Pool } from 'pg';
import { delay, merge, of, repeat, switchMap } from 'rxjs';
import {
    SportxMarketDao,
    SportxParamsDao,
    SportxTradeDao,
} from './db/index.cjs';
import { getSettledSportxTradesFrom30days } from './functions/get-settled-sportx-trades.cjs';
import { getLastSportxTrades } from './functions/get-sportx-trades.cjs';
import { SportxHttpService } from './services/sportx-service.cjs';

const TRADES_INTERVAL_SECONDS = 30;

const SETTLEMENTS_INTERVAL_SECONDS = 1800;

if (
    !process.env.DB_USER ||
    !process.env.DB_HOST ||
    !process.env.DB_DATABASE ||
    !process.env.DB_PASSWORD ||
    !process.env.SX_API_URL ||
    !process.env.SX_API_KEY
) {
    throw new Error('Missing environment variables');
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
//trades update secons

const sportxTradeDao = new SportxTradeDao(pool);
const sportxMarketDao = new SportxMarketDao(pool);
const sportxParamsDao = new SportxParamsDao(pool);

let sportxHttpService: SportxHttpService;

if (
    process.env.HTTP_PROXY_URL &&
    process.env.HTTP_PROXY_USERNAME &&
    process.env.HTTP_PROXY_PASSWORD
) {
    sportxHttpService = new SportxHttpService(
        process.env.SX_API_KEY,
        process.env.SX_API_URL,
        {
            host: process.env.HTTP_PROXY_URL,
            port: 8080,
            protocol: 'http',
            auth: {
                username: process.env.HTTP_PROXY_USERNAME,
                password: process.env.HTTP_PROXY_PASSWORD,
            },
        }
    );
} else {
    sportxHttpService = new SportxHttpService(
        process.env.SX_API_KEY,
        process.env.SX_API_URL
    );
}

function main() {
    const tradesObs = of({}).pipe(
        switchMap(async () => {
            await getLastSportxTrades(
                sportxMarketDao,
                sportxTradeDao,
                sportxParamsDao,
                sportxHttpService
            );
        }),
        delay(TRADES_INTERVAL_SECONDS * 1000),
        repeat()
    );

    const settlementObs = of({}).pipe(
        switchMap(async () => {
            await getSettledSportxTradesFrom30days(
                sportxMarketDao,
                sportxTradeDao,
                sportxHttpService
            );
        }),
        delay(SETTLEMENTS_INTERVAL_SECONDS * 1000),
        repeat()
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mainSubscription = merge(settlementObs, tradesObs).subscribe({
        error: (err) => {
            console.error(err);
            throw err;
        },
    });

    // Here we send the ready signal to PM2
    if (process.send) {
        process.send('ready');
    }
}

void main();
