import { useSearchParams } from '@remix-run/react';
import { type FC, type PropsWithChildren } from 'react';

export const SortableHeader: FC<
    PropsWithChildren<{
        sortName: string;
        className?: string;
    }>
> = ({ sortName, children, className }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order');

    const handleClick = () => {
        setSearchParams(
            (prevParams) => {
                prevParams.set('sort', sortName);

                //clear current pagination
                prevParams.delete('page');

                if (sortName === currentSort) {
                    if (currentOrder === 'asc') {
                        prevParams.set('order', 'desc');
                    } else {
                        prevParams.set('order', 'asc');
                    }
                } else {
                    prevParams.set('order', 'desc');
                }

                return prevParams;
            },
            {
                preventScrollReset: true,
            }
        );
    };

    return (
        <th
            className={`cursor-pointer ${className ? className : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            {children}
            {sortName === currentSort
                ? currentOrder === 'asc'
                    ? ' ▲'
                    : ' ▼'
                : ''}
        </th>
    );
};
