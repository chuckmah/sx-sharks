import type { Pool, QueryConfig } from 'pg';
import type {
    SportXIMarket,
    SportXIMarketLeg,
} from '../services/sportx-model.cjs';

interface MarketTable {
    _id: string;
    marketstatus: string;
    outcomeonename: string;
    outcometwoname: string;
    outcomevoidname: string;
    teamonename: string | null;
    teamtwoname: string | null;
    sportxeventid: string;
    sportlabel: string;
    sportid: number;
    leagueid: number;
    leaguelabel: string;
    hometeamfirst: boolean | null;
    liveenabled: boolean | null;
    participantoneid: number | null;
    participanttwoid: number | null;
    markettype: number | null;
    gametime: string;
    mainline: boolean | null;
    marketline: number | null;
    group1: string | null;
    group2: string | null;
    teamonemeta: string | null;
    teamtwometa: string | null;
    marketmeta: string | null;
    reporteddate: string | null;
    outcome: number | null;
    teamonescore: number | null;
    teamtwoscore: number | null;
    legs: unknown;
}

const selectQuery =
    'SELECT _id, marketstatus, outcomeOneName,outcomeTwoName,outcomeVoidName,teamOneName,teamTwoName, sportXeventId, sportLabel,sportId,leagueId, leagueLabel, homeTeamFirst, liveEnabled, participantOneId, participantTwoId, marketType,gameTime, mainLine, marketLine, group1, group2, teamOneMeta, teamTwoMeta, marketMeta, reportedDate, outcome , teamOneScore, teamTwoScore, legs FROM markets where _id=$1';

const insertQuery =
    'INSERT into markets(_id, marketstatus, outcomeonename,outcometwoname,outcomevoidname,teamonename,teamtwoname, sportxeventid, sportlabel,sportid,leagueid, leaguelabel, hometeamfirst, liveenabled, participantoneid, participanttwoid, markettype,gametime, mainline, marketline, group1, group2, teamonemeta, teamtwometa, marketmeta, reporteddate, outcome , teamonescore, teamtwoscore, legs) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)' +
    'ON CONFLICT (_id) DO UPDATE SET marketstatus = EXCLUDED.marketstatus, outcomeonename = EXCLUDED.outcomeonename, outcometwoname = EXCLUDED.outcometwoname , outcomevoidname = EXCLUDED.outcomevoidname , teamonename = EXCLUDED.teamonename , teamtwoname  = EXCLUDED.teamtwoname, sportlabel = EXCLUDED.sportlabel,sportid = EXCLUDED.sportid,leagueid = EXCLUDED.leagueid, leaguelabel = EXCLUDED.leaguelabel, hometeamfirst = EXCLUDED.hometeamfirst, liveenabled = EXCLUDED.liveenabled, participantoneid = EXCLUDED.participantoneid, participanttwoid = EXCLUDED.participanttwoid, markettype = EXCLUDED.markettype, gametime = EXCLUDED.gametime, mainline  = EXCLUDED.mainline, marketline = EXCLUDED.marketline, group1 = EXCLUDED.group1, group2 = EXCLUDED.group2, teamonemeta = EXCLUDED.teamonemeta, teamtwometa = EXCLUDED.teamtwometa, marketmeta = EXCLUDED.marketmeta, reporteddate = EXCLUDED.reporteddate, outcome = EXCLUDED.outcome, teamonescore = EXCLUDED.teamonescore, teamtwoscore = EXCLUDED.teamtwoscore, legs = EXCLUDED.legs';

export class SportxMarketDao {
    constructor(private db: Pool) {}

    async getSportxMarket(
        marketHash: string
    ): Promise<SportXIMarket | undefined> {
        const query: QueryConfig = {
            text: selectQuery,
            values: [marketHash],
        };

        const result = await this.db.query<MarketTable>(query);
        if (result.rows[0]) {
            return this.buildSportXIMarket(result.rows[0]);
        } else {
            return undefined;
        }
    }

    async upsertSportxMarket(sportXIMarket: SportXIMarket): Promise<void> {
        const marketTable = this.buildMarketTable(sportXIMarket);

        const query: QueryConfig = {
            text: insertQuery,
            values: [
                marketTable._id,
                marketTable.marketstatus,
                marketTable.outcomeonename,
                marketTable.outcometwoname,
                marketTable.outcomevoidname,
                marketTable.teamonename,
                marketTable.teamtwoname,
                marketTable.sportxeventid,
                marketTable.sportlabel,
                marketTable.sportid,
                marketTable.leagueid,
                marketTable.leaguelabel,
                marketTable.hometeamfirst,
                marketTable.liveenabled,
                marketTable.participantoneid,
                marketTable.participanttwoid,
                marketTable.markettype,
                marketTable.gametime,
                marketTable.mainline,
                marketTable.marketline,
                marketTable.group1,
                marketTable.group2,
                marketTable.teamonemeta,
                marketTable.teamtwometa,
                marketTable.marketmeta,
                marketTable.reporteddate,
                marketTable.outcome,
                marketTable.teamonescore,
                marketTable.teamtwoscore,
                marketTable.legs,
            ],
        };
        try {
            await this.db.query<MarketTable>(query);
        } catch (error) {
            console.error(`error payload = ${JSON.stringify(sportXIMarket)} `);
            throw error;
        }
    }

    private buildMarketTable(sportXIMarket: SportXIMarket): MarketTable {
        return {
            _id: sportXIMarket.marketHash,
            marketstatus: sportXIMarket.status,
            outcomeonename: sportXIMarket.outcomeOneName,
            outcometwoname: sportXIMarket.outcomeTwoName,
            outcomevoidname: sportXIMarket.outcomeVoidName,
            teamonename:
                sportXIMarket.teamOneName !== undefined
                    ? sportXIMarket.teamOneName
                    : null,
            teamtwoname:
                sportXIMarket.teamTwoName !== undefined
                    ? sportXIMarket.teamTwoName
                    : null,
            sportxeventid: sportXIMarket.sportXeventId,
            sportlabel: sportXIMarket.sportLabel,
            sportid: sportXIMarket.sportId,
            leagueid: sportXIMarket.leagueId,
            leaguelabel: sportXIMarket.leagueLabel,
            hometeamfirst:
                sportXIMarket.homeTeamFirst !== undefined
                    ? sportXIMarket.homeTeamFirst
                    : null,
            liveenabled:
                sportXIMarket.liveEnabled !== undefined
                    ? sportXIMarket.liveEnabled
                    : null,
            participantoneid:
                sportXIMarket.participantOneId !== undefined
                    ? sportXIMarket.participantOneId
                    : null,
            participanttwoid:
                sportXIMarket.participantTwoId !== undefined
                    ? sportXIMarket.participantTwoId
                    : null,
            markettype:
                sportXIMarket.type !== undefined ? sportXIMarket.type : null,
            gametime: sportXIMarket.gameTime.toString(),
            mainline:
                sportXIMarket.mainLine !== undefined
                    ? sportXIMarket.mainLine
                    : null,
            marketline:
                sportXIMarket.line !== undefined ? sportXIMarket.line : null,
            group1:
                sportXIMarket.group1 !== undefined
                    ? sportXIMarket.group1
                    : null,
            group2:
                sportXIMarket.group2 !== undefined
                    ? sportXIMarket.group2
                    : null,
            teamonemeta:
                sportXIMarket.teamOneMeta !== undefined
                    ? sportXIMarket.teamOneMeta
                    : null,
            teamtwometa:
                sportXIMarket.teamTwoMeta !== undefined
                    ? sportXIMarket.teamTwoMeta
                    : null,
            marketmeta:
                sportXIMarket.teamTwoMeta !== undefined
                    ? sportXIMarket.teamTwoMeta
                    : null,
            reporteddate:
                sportXIMarket.reportedDate !== undefined
                    ? sportXIMarket.reportedDate.toString()
                    : null,
            outcome:
                sportXIMarket.outcome !== undefined
                    ? sportXIMarket.outcome
                    : null,
            teamonescore:
                sportXIMarket.teamOneScore !== undefined
                    ? sportXIMarket.teamOneScore
                    : null,
            teamtwoscore:
                sportXIMarket.teamTwoScore !== undefined
                    ? sportXIMarket.teamTwoScore
                    : null,
            legs:
                sportXIMarket.legs !== undefined
                    ? JSON.stringify(sportXIMarket.legs)
                    : null,
        };
    }

    private buildSportXIMarket(marketTable: MarketTable): SportXIMarket {
        return {
            marketHash: marketTable._id,
            status: marketTable.marketstatus,
            outcomeOneName: marketTable.outcomeonename,
            outcomeTwoName: marketTable.outcometwoname,
            outcomeVoidName: marketTable.outcomevoidname,
            teamOneName:
                marketTable.teamonename !== null
                    ? marketTable.teamonename
                    : undefined,
            teamTwoName:
                marketTable.teamtwoname !== null
                    ? marketTable.teamtwoname
                    : undefined,
            participantOneId:
                marketTable.participantoneid !== null
                    ? marketTable.participantoneid
                    : undefined,
            participantTwoId:
                marketTable.participanttwoid !== null
                    ? marketTable.participanttwoid
                    : undefined,
            type:
                marketTable.markettype !== null
                    ? marketTable.markettype
                    : undefined,
            gameTime: Number(marketTable.gametime),
            sportXeventId: marketTable.sportxeventid,
            sportLabel: marketTable.sportlabel,
            sportId: marketTable.sportid,
            leagueId: marketTable.leagueid,
            homeTeamFirst:
                marketTable.hometeamfirst !== null
                    ? marketTable.hometeamfirst
                    : undefined,
            leagueLabel: marketTable.leaguelabel,
            line:
                marketTable.marketline !== null
                    ? marketTable.marketline
                    : undefined,
            reportedDate:
                marketTable.reporteddate !== null
                    ? Number(marketTable.reporteddate)
                    : undefined,
            outcome:
                marketTable.outcome !== null ? marketTable.outcome : undefined,
            teamOneScore:
                marketTable.teamonescore !== null
                    ? marketTable.teamonescore
                    : undefined,
            teamTwoScore:
                marketTable.teamtwoscore !== null
                    ? marketTable.teamtwoscore
                    : undefined,
            teamOneMeta:
                marketTable.teamonemeta !== null
                    ? marketTable.teamonemeta
                    : undefined,
            teamTwoMeta:
                marketTable.teamtwometa !== null
                    ? marketTable.teamtwometa
                    : undefined,
            marketMeta:
                marketTable.marketmeta !== null
                    ? marketTable.marketmeta
                    : undefined,
            mainLine:
                marketTable.mainline !== null
                    ? marketTable.mainline
                    : undefined,
            group1:
                marketTable.group1 !== null ? marketTable.group1 : undefined,
            group2:
                marketTable.group2 !== null ? marketTable.group2 : undefined,
            liveEnabled:
                marketTable.liveenabled !== null
                    ? marketTable.liveenabled
                    : undefined,
            legs:
                marketTable.legs !== null
                    ? (marketTable.legs as SportXIMarketLeg[])
                    : undefined,
        };
    }
}
