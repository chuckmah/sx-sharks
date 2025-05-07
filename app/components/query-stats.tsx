import dayjs from 'dayjs';
import type { FC } from 'react';

export const QueryStats: FC<{ generatedDate: number; duration: number }> = ({
    generatedDate,
    duration,
}) => {
    //const [dataUnix, setDataUnix] = useState(generatedDate);
    const durationFormatted = `${duration} ms`;
    const dateLocalised = dayjs
        .unix(generatedDate)
        .format('DD/MM/YYYY HH:mm:ss');

    return (
        <>
            <div className="prose my-5 text-left text-xs">
                Last updated on {dateLocalised} - Query = {durationFormatted}
            </div>
        </>
    );
};
