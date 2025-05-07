import { BigNumber } from 'bignumber.js';
import round from 'lodash/round.js';
export const PERCENTAGE_PRECISION_EXPONENT = 20;
//constant
const MATIC_DAI = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
const MATIC_WETH = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
const MATIC_SX = '0x840195888Db4D6A99ED9F73FcD3B225Bb3cB1A79';
const MATIC_USDC = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const SX_WETH = '0xA173954Cc4b1810C0dBdb007522ADbC182DaB380';
const SX_WSX = '0xaa99bE3356a11eE92c3f099BD7a038399633566f';
const SX_USDC = '0xe2aa35C2039Bd0Ff196A6Ef99523CC0D3972ae3e';

const SXR_WSX = '0x3E96B0a25d51e3Cc89C557f152797c33B839968f';
const SXR_USDC = '0x6629Ce1Cf35Cc1329ebB4F63202F3f197b3F050B';

const FRACTION_DENOMINATOR =
    BigInt(10) ** BigInt(PERCENTAGE_PRECISION_EXPONENT);

export class SportXServiceHelper {
    static convertToDisplayAmount = (
        amount: string,
        tokenaddr: string
    ): number => {
        const bigNumWithDecimals = new BigNumber(amount.toString());
        const numberwithdecimal = bigNumWithDecimals.dividedBy(
            new BigNumber(10).exponentiatedBy(
                SportXServiceHelper.getTokenDecimalMapping(tokenaddr)
            )
        );
        return numberwithdecimal.toNumber();
    };

    static convertToNumberAmount = (
        amount: string,
        tokenaddr: string
    ): number => {
        return round(
            Number(
                SportXServiceHelper.convertToDisplayAmount(amount, tokenaddr)
            ),
            2
        );
    };

    static convertFromAPIPercentageOdds = (
        apiPercentageOdds: bigint
    ): number => {
        if (apiPercentageOdds > FRACTION_DENOMINATOR) {
            throw new Error(
                `Invalid api percentage odds. ${apiPercentageOdds} greater than ${FRACTION_DENOMINATOR.toString()}`
            );
        }
        const bigNumWithDecimals = new BigNumber(apiPercentageOdds.toString());
        const impliedOddsWithDecimals = bigNumWithDecimals.dividedBy(
            new BigNumber(10).exponentiatedBy(PERCENTAGE_PRECISION_EXPONENT)
        );
        return impliedOddsWithDecimals.toNumber();
    };

    static convertToTrueTokenAmount = (
        amount: number,
        tokenaddr: string
    ): bigint => {
        return BigInt(
            BigNumber(amount)
                .multipliedBy(
                    new BigNumber(10).exponentiatedBy(
                        SportXServiceHelper.getTokenDecimalMapping(tokenaddr)
                    )
                )
                .toString()
        );
    };

    // static getTokenAddr(token: 'DAI' | 'USDC' | 'WETH') {
    //     if (token === 'DAI') {
    //         return TOKEN_ADDRESSES[SidechainNetworks.MAIN_MATIC].DAI;
    //     } else if (token === 'WETH') {
    //         return TOKEN_ADDRESSES[SidechainNetworks.MAIN_MATIC].WETH;
    //     } else {
    //         return TOKEN_ADDRESSES[SidechainNetworks.MAIN_MATIC].USDC;
    //     }
    // }

    static getTokenFromAddr(
        tokenAddr: string
    ):
        | 'DAI'
        | 'USDC'
        | 'WETH'
        | 'SX'
        | 'WSX'
        | 'SX_WETH'
        | 'SX_USDC'
        | 'SXR_WSX'
        | 'SXR_USDC'
        | undefined {
        if (tokenAddr === MATIC_DAI) {
            return 'DAI';
        }

        if (tokenAddr === MATIC_USDC) {
            return 'USDC';
        }

        if (tokenAddr === MATIC_WETH) {
            return 'WETH';
        }

        if (tokenAddr === MATIC_SX) {
            return 'SX';
        }

        if (tokenAddr === SX_WSX) {
            return 'WSX';
        }
        if (tokenAddr === SX_WETH) {
            return 'SX_WETH';
        }
        if (tokenAddr === SX_USDC) {
            return 'SX_USDC';
        }
        if (tokenAddr === SXR_WSX) {
            return 'SXR_WSX';
        }
        if (tokenAddr === SXR_USDC) {
            return 'SXR_USDC';
        }

        return undefined;
    }

    static getBlockExplorerAddrFromToken(
        tokenAddr: string
    ): string | undefined {
        if (
            tokenAddr === MATIC_DAI ||
            tokenAddr === MATIC_USDC ||
            tokenAddr === MATIC_WETH ||
            tokenAddr === MATIC_SX
        ) {
            return 'https://polygonscan.com/tx/';
        } else if (
            tokenAddr === SX_WETH ||
            tokenAddr === SX_USDC ||
            tokenAddr === SX_WSX
        ) {
            return 'https://explorer.sx.technology/tx/';
        } else {
            return 'https://explorerl2.sx.technology/tx/';
        }
    }

    static getTokenDecimalMapping(tokenAddr: string): number {
        if (
            tokenAddr === SX_WETH ||
            tokenAddr === MATIC_WETH ||
            tokenAddr === SX_WSX ||
            tokenAddr === MATIC_SX ||
            tokenAddr === SXR_WSX
        ) {
            return 18;
        } else {
            return 6;
        }
    }
}
