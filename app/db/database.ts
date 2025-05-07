export interface TradeTable {
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
    bettime: number;
    bettimevalue: string;
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

export interface MarketTable {
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
    hometeamfirst: boolean;
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
    legs: unknown | null;
}

export interface Database {
    trades: TradeTable;
    markets: MarketTable;
}
