import type { Pool, QueryConfig } from 'pg';

interface ParamsTable {
    paramname: string;
    paramvalue: string | null;
}

const selectQuery = 'SELECT paramvalue FROM params where paramname=$1';

const insertQuery =
    'INSERT into params(paramname, paramvalue) VALUES($1, $2)' +
    'ON CONFLICT (paramname) DO UPDATE SET paramvalue = EXCLUDED.paramvalue';

export class SportxParamsDao {
    constructor(private db: Pool) {}

    async getParam(paramName: string): Promise<string | undefined> {
        const query: QueryConfig = {
            text: selectQuery,
            values: [paramName],
        };

        const result = await this.db.query<ParamsTable>(query);
        if (result.rows[0]) {
            return result.rows[0].paramvalue !== null
                ? result.rows[0].paramvalue
                : undefined;
        } else {
            throw new Error('Param not found');
        }
    }

    async upsertSportXITrade(
        paramName: string,
        paramValue: string | undefined
    ): Promise<void> {
        const paramsTable: ParamsTable = {
            paramname: paramName,
            paramvalue: paramValue !== undefined ? paramValue : null,
        };

        const query: QueryConfig = {
            text: insertQuery,
            values: [paramsTable.paramname, paramsTable.paramvalue],
        };

        await this.db.query<ParamsTable>(query);
    }
}
