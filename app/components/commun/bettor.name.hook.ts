import { useEffect, useState } from 'react';
import { type BettorName } from '../../db/names';

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: string) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export function useLocalStorageBettor(
    bettorAddr: string
): [BettorName, (bettorName: BettorName) => void] {
    const [abettorName, setBettorName] = useState<BettorName>({
        nickname: truncateEthAddress(bettorAddr),
    });

    useEffect(() => {
        if (window.$ssbettorNames[bettorAddr] !== undefined) {
            setBettorName(window.$ssbettorNames[bettorAddr]);
        }
    }, [bettorAddr]);

    const setBettorNameWithLocalStorage = (bettorName: BettorName) => {
        window.$ssbettorNames[bettorAddr] = bettorName;

        setBettorName(bettorName);
        console.log(
            `Setting bettor name for ${bettorAddr} to ${JSON.stringify(
                window.$ssbettorNames[bettorAddr]
            )}`
        );
        localStorage.setItem(
            'bettorsName',
            JSON.stringify(window.$ssbettorNames)
        );
    };

    return [abettorName, setBettorNameWithLocalStorage];
}
