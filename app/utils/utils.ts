import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import round from 'lodash/round.js';
import { OddConverter } from '../utils/odd-converter';
import { SportXServiceHelper } from '../utils/sportx-helper';
dayjs.extend(duration);

export const getBetTimeFormat = (unixTimeStamp: number): string => {
    return dayjs.unix(unixTimeStamp).format('DD/MM/YYYY HH:mm:ss');
};

export const getBetTimeFormatFromIso = (isoDate: string): string => {
    return dayjs(isoDate).format('DD/MM/YYYY HH:mm:ss');
};

export const getDurationAsIso = (ms: number): string => {
    return dayjs.duration({ milliseconds: ms }).format('SSS [ms]');
};

interface ParlyLeg {
    marketHash: string;
    outcomeOneName: string;
    outcomeTwoName: string;
    outcomeVoidName: string;
    teamOneName: string;
    teamTwoName: string;
    bettingOutcomeOne: boolean;
}

export const getEventName = (
    teamOneName: string | null,
    teamtwoname: string | null,
    legs: unknown | null
): string => {
    if (teamOneName !== null && teamtwoname !== null) {
        return `${teamtwoname} vs ${teamOneName}`;
    } else if (legs !== null) {
        const _legs = legs as ParlyLeg[];

        const outCome = _legs.map((leg) => {
            return getOutcomeName(
                leg.outcomeOneName,
                leg.outcomeTwoName,
                leg.bettingOutcomeOne
            );
        });

        return `${outCome.join(', ')}`;
    } else {
        return `unknown event`;
    }
};

export const getOutcomeName = (
    outcomeonename: string,
    outcometwoname: string,
    bettingoutcomeone: boolean
): string => {
    if (bettingoutcomeone) {
        return outcomeonename;
    } else {
        return outcometwoname;
    }
};

export const getDisplayAmount = (
    apiAmount: string,
    baseToken: string
): string => {
    const token = SportXServiceHelper.getTokenFromAddr(baseToken);
    const displayAmount = SportXServiceHelper.convertToDisplayAmount(
        apiAmount,
        baseToken
    );
    if (token === 'USDC' || token === 'DAI' || token === 'SX_USDC' || token === 'SXR_USDC') {
        return `$${round(Number(displayAmount), 2)}`;
    } else if (token === 'WETH' || token === 'SX_WETH' ) {
        return `Ξ${round(Number(displayAmount), 4)}`;
    } else if (token === 'SX' || token === 'WSX' || token === 'SXR_WSX') {
        return `SX${round(Number(displayAmount), 0)}`;
    } else {
        return 'UNKNOWN!';
    }
};

export const getDecimalOdd = (apiOdds: string): number => {
    return OddConverter.percentageToDecimal(
        SportXServiceHelper.convertFromAPIPercentageOdds(BigInt(apiOdds))
    );
};

export const isBetLive = (betTime: number, gameTime: number): boolean => {
    return dayjs.unix(betTime).isAfter(dayjs.unix(gameTime));
};

export const isFailed = (tradestatus: string): boolean => {
    return tradestatus !== 'SUCCESS';
};

export const getTxUrl = (baseToken: string, txHash: string): string => {
    return `${SportXServiceHelper.getBlockExplorerAddrFromToken(
        baseToken
    )}${txHash}`;
};

export const getProfit = (
    betTimeValue: number,
    outcome: number,
    isBettingOutcomeOne: boolean,
    apiOdds: string
) => {
    let profit = 0;
    const decimalOdd = OddConverter.percentageToDecimal(
        SportXServiceHelper.convertFromAPIPercentageOdds(BigInt(apiOdds))
    );

    if (outcome === 1) {
        if (isBettingOutcomeOne) {
            profit = betTimeValue * decimalOdd - betTimeValue;
        } else {
            profit = -betTimeValue;
        }
    } else if (outcome === 2) {
        if (isBettingOutcomeOne) {
            profit = -betTimeValue;
        } else {
            profit = betTimeValue * decimalOdd - betTimeValue;
        }
    } else {
        // push
        profit = 0;
    }

    return round(profit, 2);
};
