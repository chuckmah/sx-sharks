import round from 'lodash/round.js';
export class OddConverter {
    static americanToDecimal = (moneyline: number): number => {
        let decimal: number;
        moneyline > 0
            ? (decimal = moneyline / 100 + 1)
            : (decimal = 100 / Math.abs(moneyline) + 1);
        return round(decimal, 2);
    };

    static decimalToAmerican = (decimal: number): number => {
        let american: number;
        decimal < 2.0
            ? (american = -100 / (decimal - 1))
            : (american = (decimal - 1) * 100);
        return round(american, 0);
    };

    static percentageToDecimal = (
        percentage: number,
        precision = 4
    ): number => {
        return round(1.0 / percentage, precision);
    };

    static decimalToPercentage = (
        decimalOdd: number,
        precision = 4
    ): number => {
        return round(1.0 / decimalOdd, precision);
    };
}
