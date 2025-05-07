import {
    json,
    type HeadersFunction,
    type LoaderFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import { Pagination } from '../components/commun/pagination';
import { EventTradesFilters } from '../components/event/event-trades-filters';
import { EventTradesTable } from '../components/event/event-trades-table';
import { QueryStats } from '../components/query-stats';
import { getCachedEventTrades } from '../db/cached-trade-dao.server';

export const headers: HeadersFunction = ({}) => ({
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
});

export let loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '25', 10);

    const eventId = params.id;
    if (!eventId) {
        throw json('Not Found', { status: 404 });
    }

    // filters
    const minSize = parseInt(url.searchParams.get('min') || '0', 10);
    const hidemaker = url.searchParams.get('hidemaker') === 'true';
    const hidetaker = url.searchParams.get('hidetaker') === 'true';

    // sorting
    const sortBy = url.searchParams.get('sort') || undefined;
    const order = url.searchParams.get('order') || undefined;

    const result = await getCachedEventTrades(eventId, true);

    //event name
    const eventName =
        result.trades.length > 0 ? result.trades[0].eventname : 'unknown';

    //filtering
    const filteredTrades = result.trades.filter((trade) => {
        if (minSize && trade.bettimevalue < minSize) {
            return false;
        }

        if (hidemaker && trade.info.isMaker) {
            return false;
        }

        if (hidetaker && !trade.info.isMaker) {
            return false;
        }

        return true;
    });

    //get total amount
    const betValuesNumber = filteredTrades.reduce(
        (acc, trade) => acc + trade.bettimevalue,
        0
    );
    const betValues = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(betValuesNumber);

    // apply sorting
    let sortedTrades = filteredTrades;
    if (sortBy && order) {
        if (
            ['bettime', 'bettor', 'bettimevalue', 'odd'].includes(
                sortBy.toLocaleLowerCase()
            ) &&
            ['asc', 'desc'].includes(order.toLocaleLowerCase())
        ) {
            sortedTrades = orderBy(
                filteredTrades,
                [sortBy.toLocaleLowerCase()],
                [order.toLocaleLowerCase() as 'asc' | 'desc']
            );
        }
    }

    const paginatedTrades = slice(
        sortedTrades,
        (page - 1) * pageSize,
        page * pageSize
    );

    const generatedDate = result.generatedDate;

    const duration = result.duration;

    return json({
        eventId,
        trades: paginatedTrades,
        generatedDate,
        duration,
        page,
        pageSize,
        betValues,
        total: filteredTrades.length,
        eventName,
    });
};

export default function EventDetails() {
    const {
        trades,
        generatedDate,
        duration,
        page,
        pageSize,
        total,
        betValues,
        eventName,
    } = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="my-4 text-xl font-bold">{eventName}</h1>
            <EventTradesFilters />
            <div className="mt-8">
                {trades.length === 0 ? (
                    <p>No Results</p>
                ) : (
                    <>
                        <EventTradesTable
                            trades={trades}
                            total={total}
                            betValue={betValues}
                        />
                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={total}
                        />
                        <QueryStats
                            duration={duration}
                            generatedDate={generatedDate}
                        />
                    </>
                )}
            </div>
        </>
    );
}
