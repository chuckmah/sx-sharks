import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import type { Database } from './database';

const { Pool } = pg;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});

// You'd create one of these when you start your app.
export const db = new Kysely<Database>({
    // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
    dialect: new PostgresDialect({
        pool,
    }),
});
