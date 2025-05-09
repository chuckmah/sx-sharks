import { round } from 'lodash';
import type { Pool, QueryConfig } from 'pg';
import type { SportXITrade } from '../services/sportx-model.cjs';

interface TradeTable {
    _id: string;
    fillhash: string;
    fillorderhash: string | null;
    orderhash: string;
    markethash: string;
    basetoken: string;
    bettor: string;
    stake: string;
    odds: string;
    maker: boolean;
    bettime: string;
    bettimevalue: number;
    settled: boolean;
    bettingoutcomeone: boolean;
    tradestatus: string;
    isvalid: boolean;
    contractsversion: string;
    createdat: string | null;
    updatedat: string | null;
    settlevalue: number | null;
    outcome: number | null;
    settledate: string | null;
    settletxhash: string | null;
}

interface MarketQuery {
    markethash: string;
}

const selectQuery =
    'SELECT _id, fillHash, fillOrderHash,orderHash,marketHash,baseToken, bettor, stake,odds,maker, betTime, betTimeValue, settled, bettingOutcomeOne, tradeStatus, isValid, contractsVersion, createdAt, updatedAt, outcome, settleDate, settleTxHash FROM trades where _id=$1';

const insertQuery =
    'INSERT into trades(_id, fillhash, fillorderhash,orderhash,markethash,basetoken,bettor,stake,odds,maker,bettime,bettimevalue,settled,bettingoutcomeone,tradestatus,isvalid,contractsversion,createdat,updatedat,settlevalue,outcome,settledate,settletxhash) ' +
    'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)' +
    'ON CONFLICT (_id) DO UPDATE SET fillhash = EXCLUDED.fillhash, fillorderhash = EXCLUDED.fillorderhash, orderhash = EXCLUDED.orderhash , markethash = EXCLUDED.markethash , basetoken = EXCLUDED.basetoken , bettor  = EXCLUDED.bettor, stake = EXCLUDED.stake,odds = EXCLUDED.odds,maker = EXCLUDED.maker, bettime = EXCLUDED.bettime,bettimevalue  = EXCLUDED.bettimevalue, settled = EXCLUDED.settled, bettingoutcomeone = EXCLUDED.bettingoutcomeone, tradestatus = EXCLUDED.tradestatus, isvalid = EXCLUDED.isvalid, contractsversion = EXCLUDED.contractsversion, createdat  = EXCLUDED.createdat, updatedat = EXCLUDED.updatedat, settlevalue = EXCLUDED.settlevalue, outcome = EXCLUDED.outcome, settledate = EXCLUDED.settledate, settletxhash = EXCLUDED.settletxhash';

const unsettledMarketsQuery =
    'SELECT DISTINCT trades.markethash' +
    ' FROM trades INNER JOIN markets ON trades.markethash = markets._id' +
    ` WHERE trades.settled = false AND markets.gametime < $1  AND trades.tradestatus='SUCCESS'`;

const nofillMarketsQuery =
    'SELECT DISTINCT trades.markethash' +
    ' FROM trades INNER JOIN markets ON trades.markethash = markets._id' +
    ` WHERE trades.settled = false AND trades.tradestatus='SUCCESS' AND trades.fillorderhash is NULL`;

export class SportxTradeDao {
    constructor(private db: Pool) {}

    async getSportxTrade(
        marketHash: string
    ): Promise<SportXITrade | undefined> {
        const query: QueryConfig = {
            text: selectQuery,
            values: [marketHash],
        };

        const result = await this.db.query<TradeTable>(query);
        if (result.rows[0]) {
            return this.buildSportXTrade(result.rows[0]);
        } else {
            return undefined;
        }
    }

    async getUnsettledMarketHashes(
        beforeTimestamps: number
    ): Promise<string[]> {
        const query: QueryConfig = {
            text: unsettledMarketsQuery,
            values: [beforeTimestamps],
        };

        const result = await this.db.query<MarketQuery>(query);

        return result.rows.map((row) => row.markethash);
    }

    async getNoOrderFillMarketHashes(): Promise<string[]> {
        const query: QueryConfig = {
            text: nofillMarketsQuery,
        };

        const result = await this.db.query<MarketQuery>(query);

        return result.rows.map((row) => row.markethash);
    }

    async upsertSportXITrade(sportXITrade: SportXITrade): Promise<void> {
        const tradeTable = this.buildTradeTable(sportXITrade);

        const query: QueryConfig = {
            text: insertQuery,
            values: [
                tradeTable._id,
                tradeTable.fillhash,
                tradeTable.fillorderhash,
                tradeTable.orderhash,
                tradeTable.markethash,
                tradeTable.basetoken,
                tradeTable.bettor,
                tradeTable.stake,
                tradeTable.odds,
                tradeTable.maker,
                tradeTable.bettime,
                tradeTable.bettimevalue,
                tradeTable.settled,
                tradeTable.bettingoutcomeone,
                tradeTable.tradestatus,
                tradeTable.isvalid,
                tradeTable.contractsversion,
                tradeTable.createdat,
                tradeTable.updatedat,
                tradeTable.settlevalue,
                tradeTable.outcome,
                tradeTable.settledate,
                tradeTable.settletxhash,
            ],
        };
        try {
            await this.db.query<TradeTable>(query);
        } catch (error) {
            console.error(`error payload = ${JSON.stringify(sportXITrade)} `);
            throw error;
        }
    }

    private buildTradeTable(sportXIMarket: SportXITrade): TradeTable {
        return {
            _id: sportXIMarket._id,
            fillhash: sportXIMarket.fillHash,
            fillorderhash:
                sportXIMarket.fillOrderHash !== undefined
                    ? sportXIMarket.fillOrderHash
                    : null,
            orderhash: sportXIMarket.orderHash,
            markethash: sportXIMarket.marketHash,
            basetoken: sportXIMarket.baseToken,
            bettor: sportXIMarket.bettor,
            stake: sportXIMarket.stake,
            odds: sportXIMarket.odds,
            maker: sportXIMarket.maker,
            bettime: sportXIMarket.betTime.toString(),
            bettimevalue: round(sportXIMarket.betTimeValue, 2),
            settled: sportXIMarket.settled,
            bettingoutcomeone: sportXIMarket.bettingOutcomeOne,
            tradestatus: sportXIMarket.tradeStatus,
            isvalid: sportXIMarket.valid,
            contractsversion: sportXIMarket.contractsVersion,
            createdat:
                sportXIMarket.createdAt !== undefined
                    ? sportXIMarket.createdAt
                    : null,
            updatedat:
                sportXIMarket.updatedAt !== undefined
                    ? sportXIMarket.updatedAt
                    : null,
            settlevalue:
                sportXIMarket.settleValue !== undefined
                    ? round(sportXIMarket.settleValue, 2)
                    : null,
            outcome:
                sportXIMarket.outcome !== undefined
                    ? sportXIMarket.outcome
                    : null,
            settledate:
                sportXIMarket.settleDate !== undefined
                    ? sportXIMarket.settleDate
                    : null,
            settletxhash:
                sportXIMarket.settleTxHash !== undefined
                    ? sportXIMarket.settleTxHash
                    : null,
        };
    }

    private buildSportXTrade(tradeTable: TradeTable): SportXITrade {
        return {
            _id: tradeTable._id,
            baseToken: tradeTable.basetoken,
            bettor: tradeTable.bettor,
            stake: tradeTable.stake,
            odds: tradeTable.odds,
            orderHash: tradeTable.orderhash,
            marketHash: tradeTable.markethash,
            maker: tradeTable.maker,
            betTime: Number(tradeTable.bettime),
            bettingOutcomeOne: tradeTable.bettingoutcomeone,
            settled: tradeTable.settled,
            fillHash: tradeTable.fillhash,
            betTimeValue: tradeTable.bettimevalue,
            tradeStatus: tradeTable.tradestatus,
            valid: tradeTable.isvalid,
            contractsVersion: tradeTable.contractsversion,
            createdAt:
                tradeTable.createdat !== null
                    ? tradeTable.createdat
                    : undefined,
            updatedAt:
                tradeTable.updatedat !== null
                    ? tradeTable.updatedat
                    : undefined,
            fillOrderHash:
                tradeTable.fillorderhash !== null
                    ? tradeTable.fillorderhash
                    : undefined,
            settleValue:
                tradeTable.settlevalue !== null
                    ? tradeTable.settlevalue
                    : undefined,
            outcome:
                tradeTable.outcome !== null ? tradeTable.outcome : undefined,
            settleDate:
                tradeTable.settledate !== null
                    ? tradeTable.settledate
                    : undefined,
            settleTxHash:
                tradeTable.settletxhash !== null
                    ? tradeTable.settletxhash
                    : undefined,
        };
    }
}
