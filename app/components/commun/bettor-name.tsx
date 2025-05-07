import { type FC } from 'react';
import { useLocalStorageBettor } from './bettor.name.hook';

export const BettorName: FC<{ bettorId: string }> = ({ bettorId }) => {
    const [abettorName] = useLocalStorageBettor(bettorId);
    if (abettorName.icon)
        return <span>{`${abettorName.icon} ${abettorName.nickname}`}</span>;

    return <span>{`${abettorName.nickname}`}</span>;
};
