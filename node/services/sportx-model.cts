export interface SportxActiveMarketsRequest {
    onlyMainLine?: boolean;
    eventId?: string;
    leagueId?: number;
    sportIds?: number[];
    liveOnly?: boolean;
    betGroup?: string;
    type?: number;
}

export interface SportXIResponseObject<T> {
    status: string;
    data: {
        [id: string]: T;
    };
}

export interface SportXIResponseArray<T> {
    status: string;
    data: T[];
}

export interface SportXIMarketResponse {
    status: string;
    data: {
        markets: SportXIMarket[];
        nextKey?: string;
    };
}

export interface SportXLineChange {
    marketHash: string;
    marketType: number;
    sportXeventId: string;
}

export interface SportXIMarketLeg {
    status: string;
    marketHash: string;
    outcomeOneName: string;
    outcomeTwoName: string;
    outcomeVoidName: string;
    teamOneName: string;
    teamTwoName: string;
    type: number;
    gameTime: number;
    sportXeventId: string;
    bettingOutcomeOne: boolean;
    line?: number;
    reportedDate?: number;
    outcome?: number;
    teamOneScore?: number;
    teamTwoScore?: number;
    teamOneMeta?: string;
    teamTwoMeta?: string;
    marketMeta?: string;
    sportLabel: string;
    sportId: number;
    leagueId: number;
    homeTeamFirst: boolean;
    leagueLabel: string;
    mainLine?: boolean;
    liveEnabled?: boolean;
    group1?: string;
    group2?: string;
    group3?: string;
}

export interface SportXIMarket {
    status: string;
    marketHash: string;
    outcomeOneName: string;
    outcomeTwoName: string;
    outcomeVoidName: string;
    teamOneName?: string;
    teamTwoName?: string;
    participantOneId?: number;
    participantTwoId?: number;
    type?: number;
    __type?: number;
    gameTime: number;
    line?: number;
    reportedDate?: number;
    outcome?: number;
    teamOneScore?: number;
    teamTwoScore?: number;
    teamOneMeta?: string;
    teamTwoMeta?: string;
    marketMeta?: string;
    sportXeventId: string;
    sportLabel: string;
    sportId: number;
    leagueId: number;
    homeTeamFirst?: boolean;
    leagueLabel: string;
    mainLine?: boolean;
    liveEnabled?: boolean;
    group1?: string;
    group2?: string;
    group3?: string;
    legs?: unknown[];
}

export interface SportXIDetailedRelayerMakerOrder
    extends SportXISignedRelayerMakerOrder {
    orderHash: string;
    fillAmount: string;
}

export interface SportXISignedRelayerMakerOrder
    extends SportXIRelayerMakerOrder {
    signature: string;
}

export interface SportXIRelayerMakerOrder {
    marketHash: string;
    baseToken: string;
    maker: string;
    totalBetSize: string;
    percentageOdds: string;
    expiry: number;
    apiExpiry: number;
    executor: string;
    salt: string;
    isMakerBettingOutcomeOne: boolean;
}

export interface SportXITradeResponse {
    status: string;
    data: {
        trades: SportXITrade[];
        nextKey?: string;
        pageSize: number;
        count: number;
    };
}

export interface SportXITrade {
    _id: string;
    baseToken: string;
    bettor: string;
    stake: string;
    odds: string;
    orderHash: string;
    marketHash: string;
    maker: boolean;
    betTime: number;
    bettingOutcomeOne: boolean;
    settled: boolean;
    fillHash: string;
    betTimeValue: number;
    tradeStatus: string;
    valid: boolean;
    contractsVersion: string;
    createdAt?: string;
    updatedAt?: string;
    fillOrderHash?: string;
    settleValue?: number;
    outcome?: number;
    settleDate?: string;
    settleTxHash?: string;
}

export interface SportXIMetadata {
    executorAddress: string;
    oracleFees: {
        [token: string]: string;
    };
    sportXAffiliate: {
        address: string;
        amount: string;
    };
    makerOrderMinimums: {
        [token: string]: string;
    };
    takerMinimums: {
        [token: string]: string;
    };
    addresses: {
        [network: string]: { [token: string]: string };
    };
    bettingEnabled: boolean;
    depositMinimums: {
        [token: string]: string;
    };
    withdrawMinimums: {
        [token: string]: string;
    };
    totalVolume: number;
    domainVersion: string;
    EIP712FillHasher: string;
    TokenTransferProxy: string;
    oddsLadderStepSize: number;
}
// export interface SportXIResponseConsolidatedTrades {
//     status: string;
//     data: {
//         trades: SportXIConsolidatedTrade[];
//         count: number;
//     };
// }
export interface SportXIConsolidatedTrade {
    id: string;
    baseToken: string;
    tradeStatus: string;
    bettor: string;
    totalStake: string;
    totalBetTimeValue: string;
    weightedAverageOdds: string;
    netReturn: string;
    crosschainNetReturn: string;
    netReturnBetTimeValue: number;
    settleNetReturnValue: number;
    marketHash: string;
    maker: boolean;
    settled: boolean;
    fillHash: string;
    fillOrderHash: string;
    bettingOutcome: number;
    gameLabel: string;
    bettingOutcomeLabel: string;
    sportXeventId: string;
    marketType: number;
    gameTime: string;
    leagueLabel: string;
    outcome: number;
    betTime: number;
    settleDate: number;
    sportId: number;
    chainVersion: string;
}

export interface SportXIGetTradesRequest {
    startDate?: number;
    endDate?: number;
    bettor?: string;
    settled?: boolean;
    marketHashes?: string[];
    baseToken?: string;
    maker?: boolean;
    affiliate?: string;
    pageSize?: number; // default is 100
    paginationKey?: string; // default is 100
}

export enum SportXToken {
    USDC = 'USDC',
    DAI = 'DAI',
    WETH = 'WETH',
    SX = 'SX',
}
