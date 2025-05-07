import type { BettorTrade, EventTrade, OpenTrade } from '../utils/trade-model';
import {
    getDecimalOdd,
    getEventName,
    getOutcomeName,
    getProfit,
    isBetLive,
    isFailed,
} from '../utils/utils';
import { db } from './db.server';

export const getOpenTrades = async (
    minBetTime?: number
): Promise<OpenTrade[]> => {
    const openTrades = await db
        .selectFrom('trades')
        .innerJoin('markets', 'markets._id', 'trades.markethash')
        .select([
            'trades._id',
            'trades.bettime',
            'trades.markethash',
            'trades.bettor',
            'markets.sportlabel',
            'markets.leaguelabel',
            'markets.teamonename',
            'markets.teamtwoname',
            'markets.outcomeonename',
            'markets.outcometwoname',
            'trades.bettingoutcomeone',
            'trades.stake',
            'trades.odds',
            'trades.basetoken',
            'trades.fillorderhash',
            'markets.gametime',
            'trades.isvalid',
            'trades.maker',
            'trades.settled',
            'trades.outcome',
            'trades.tradestatus',
            'markets.sportxeventid',
            'trades.bettimevalue',
            'markets.legs',
        ])
        .where('trades.maker', '=', false)
        .where('trades.settled', '=', false)
        .where('trades.tradestatus', '=', 'SUCCESS')
        // .where('trades.bettimevalue', '>=', minBetTimeValue)
        .$if(minBetTime !== undefined, (qb) =>
            qb.where('trades.bettime', '>=', minBetTime!)
        )
        .orderBy('trades.bettime', 'desc')
        .execute();

    return openTrades.map((openTrade) => {
        return {
            id: openTrade._id,
            bettime: openTrade.bettime,
            bettor: openTrade.bettor,
            sport: openTrade.sportlabel,
            league: openTrade.leaguelabel,
            eventid: openTrade.sportxeventid,
            eventname: getEventName(
                openTrade.teamonename,
                openTrade.teamtwoname,
                openTrade.legs
            ),

            bet: getOutcomeName(
                openTrade.outcomeonename,
                openTrade.outcometwoname,
                openTrade.bettingoutcomeone
            ),
            baseToken: openTrade.basetoken,
            amount: openTrade.stake,
            bettimevalue: parseFloat(openTrade.bettimevalue),
            odd: getDecimalOdd(openTrade.odds),
            info: {
                fillTx: openTrade.fillorderhash,
                isLive: isBetLive(
                    Number(openTrade.bettime),
                    Number(openTrade.gametime)
                ),
                isValid: openTrade.isvalid,
                failed: isFailed(openTrade.tradestatus),
            },
        };
    });
};

export const getEventTrades = async (
    eventId: string,
    all: boolean
): Promise<EventTrade[]> => {
    const openTrades = await db
        .selectFrom('trades')
        .innerJoin('markets', 'markets._id', 'trades.markethash')
        .select([
            'trades._id',
            'trades.bettime',
            'trades.markethash',
            'trades.bettor',
            'markets.sportlabel',
            'markets.leaguelabel',
            'markets.teamonename',
            'markets.teamtwoname',
            'markets.outcomeonename',
            'markets.outcometwoname',
            'trades.bettingoutcomeone',
            'trades.stake',
            'trades.odds',
            'trades.basetoken',
            'trades.fillorderhash',
            'markets.gametime',
            'trades.isvalid',
            'trades.maker',
            'trades.settled',
            'trades.outcome',
            'trades.settletxhash',
            'trades.tradestatus',
            'trades.bettimevalue',
            'trades.settledate',
            'markets.sportxeventid',
            'markets.legs',
        ])
        .where('markets.sportxeventid', '=', eventId)
        .$if(!all, (qb) => qb.where('trades.maker', '=', false))
        .orderBy('trades.bettime', 'desc')
        .execute();

    return openTrades.map((openTrade) => {
        return {
            id: openTrade._id,
            bettime: openTrade.bettime,
            bettor: openTrade.bettor,
            eventid: openTrade.sportxeventid,
            eventname: getEventName(
                openTrade.teamonename,
                openTrade.teamtwoname,
                openTrade.legs
            ),

            bet: getOutcomeName(
                openTrade.outcomeonename,
                openTrade.outcometwoname,
                openTrade.bettingoutcomeone
            ),
            baseToken: openTrade.basetoken,
            amount: openTrade.stake,
            bettimevalue: parseFloat(openTrade.bettimevalue),
            odd: getDecimalOdd(openTrade.odds),
            profit:
                openTrade.settled && openTrade.outcome !== null
                    ? getProfit(
                          parseFloat(openTrade.bettimevalue),
                          openTrade.outcome,
                          openTrade.bettingoutcomeone,
                          openTrade.odds
                      )
                    : null,
            settledate: openTrade.settledate,
            info: {
                fillTx: openTrade.fillorderhash,
                isLive: isBetLive(
                    Number(openTrade.bettime),
                    Number(openTrade.gametime)
                ),
                isValid: openTrade.isvalid,
                failed: isFailed(openTrade.tradestatus),
                isMaker: openTrade.maker,
                settlementTx: openTrade.settletxhash,
            },
            settled: openTrade.settled,
        };
    });
};

export const getBettorTrades = async (
    bettor: string,
    startDateUnix?: number,
    sportId?: number,
    leagueid?: number,
    limit?: number
): Promise<BettorTrade[]> => {
    const bettorTrades = await db
        .selectFrom('trades')
        .innerJoin('markets', 'markets._id', 'trades.markethash')
        .select([
            'trades._id',
            'trades.bettime',
            'trades.markethash',
            'trades.bettor',
            'markets.sportlabel',
            'markets.leaguelabel',
            'markets.teamonename',
            'markets.teamtwoname',
            'markets.outcomeonename',
            'markets.outcometwoname',
            'trades.bettingoutcomeone',
            'trades.stake',
            'trades.odds',
            'trades.basetoken',
            'trades.fillorderhash',
            'markets.gametime',
            'trades.isvalid',
            'trades.maker',
            'trades.settled',
            'trades.outcome',
            'trades.settletxhash',
            'trades.tradestatus',
            'trades.bettimevalue',
            'trades.settledate',
            'markets.sportxeventid',
            'markets.legs',
        ])
        .where('trades.bettor', '=', bettor)
        .$if(startDateUnix !== undefined, (qb) =>
            qb.where('trades.bettime', '>=', startDateUnix!)
        )
        .$if(sportId !== undefined, (qb) =>
            qb.where('markets.sportid', '=', sportId!)
        )
        .$if(leagueid !== undefined, (qb) =>
            qb.where('markets.leagueid', '=', leagueid!)
        )
        .$if(limit !== undefined, (qb) => qb.limit(limit!))
        .orderBy('trades.bettime', 'desc')
        .execute();

    return bettorTrades.map((openTrade) => {
        return {
            id: openTrade._id,
            bettime: openTrade.bettime,
            sport: openTrade.sportlabel,
            league: openTrade.leaguelabel,
            eventid: openTrade.sportxeventid,
            eventname: getEventName(
                openTrade.teamonename,
                openTrade.teamtwoname,
                openTrade.legs
            ),
            bet: getOutcomeName(
                openTrade.outcomeonename,
                openTrade.outcometwoname,
                openTrade.bettingoutcomeone
            ),
            baseToken: openTrade.basetoken,
            amount: openTrade.stake,
            bettimevalue: parseFloat(openTrade.bettimevalue),
            odd: getDecimalOdd(openTrade.odds),
            profit:
                openTrade.settled && openTrade.outcome !== null
                    ? getProfit(
                          parseFloat(openTrade.bettimevalue),
                          openTrade.outcome,
                          openTrade.bettingoutcomeone,
                          openTrade.odds
                      )
                    : null,
            settledate: openTrade.settledate,
            info: {
                fillTx: openTrade.fillorderhash,
                isLive: isBetLive(
                    Number(openTrade.bettime),
                    Number(openTrade.gametime)
                ),
                isValid: openTrade.isvalid,
                failed: isFailed(openTrade.tradestatus),
                isMaker: openTrade.maker,
                settlementTx: openTrade.settletxhash,
            },
            settled: openTrade.settled,
        };
    });
};
