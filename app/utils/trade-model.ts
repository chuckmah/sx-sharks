export interface OpenTradeQuery {
    trades: OpenTrade[];
    duration: number;
    generatedDate: number;
}
export interface OpenTrade {
    id: string;
    bettime: number;
    bettor: string;
    sport: string;
    league: string;
    eventid: string;
    eventname: string;
    bet: string;
    amount: string;
    odd: number;
    baseToken: string;
    bettimevalue: number;
    info: {
        fillTx: string | null;
        isLive: boolean;
        failed: boolean;
        isValid: boolean;
    };
}

export interface EventTradeQuery {
    trades: EventTrade[];
    duration: number;
    generatedDate: number;
}

export interface EventTrade {
    id: string;
    bettime: number;
    bettor: string;
    eventid: string;
    eventname: string;
    baseToken: string;
    bet: string;
    amount: string;
    odd: number;
    profit: number | null;
    settledate: string | null;
    settled: boolean;
    bettimevalue: number;
    info: {
        fillTx: string | null;
        isLive: boolean;
        failed: boolean;
        isValid: boolean;
        isMaker: boolean;
        settlementTx: string | null;
    };
}

export interface BettorTradeQuery {
    trades: BettorTrade[];
    duration: number;
    generatedDate: number;
}

export interface BettorTrade {
    id: string;
    bettime: number;
    sport: string;
    league: string;
    eventid: string;
    eventname: string;
    baseToken: string;
    bet: string;
    amount: string;
    odd: number;
    profit: number | null;
    settledate: string | null;
    settled: boolean;
    bettimevalue: number;
    info: {
        fillTx: string | null;
        isLive: boolean;
        failed: boolean;
        isValid: boolean;
        isMaker: boolean;
        settlementTx: string | null;
    };
}
