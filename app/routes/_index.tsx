import {
    json,
    type HeadersFunction,
    type LoaderFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import { Pagination } from '../components/commun/pagination';
import { QueryStats } from '../components/query-stats';
import { UnsettledTradesFilters } from '../components/unsettled/unsettled-trades-filters';
import { UnsettledTradesTable } from '../components/unsettled/unsettled-trades-table';
import { getCachedOpenTrades } from '../db/cached-trade-dao.server';

export const headers: HeadersFunction = ({}) => ({
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
});

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    //pagination
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('size') || '25', 10);

    // filters
    const minSize = parseInt(url.searchParams.get('min') || '0', 10);
    const live = url.searchParams.get('live') === 'true';
    const sports = url.searchParams.getAll('sport') || [];
    const betTime = url.searchParams.get('betTime') || undefined;

    // sorting
    const sortBy = url.searchParams.get('sort') || undefined;
    const order = url.searchParams.get('order') || undefined;

    const result = await getCachedOpenTrades();

    //get all disctinc sports from the result using a Set
    const uniqSports = Array.from(
        new Set(result.trades.map((trade) => trade.sport))
    );

    // apply filters
    const filteredTrades = result.trades.filter((trade) => {
        if (minSize && trade.bettimevalue < minSize) {
            return false;
        }

        if (live && !trade.info.isLive) {
            return false;
        }

        if (sports && sports.length > 0) {
            const sportsLowecase = sports.map((sport) =>
                sport.toLocaleLowerCase()
            );

            if (!sportsLowecase.includes(trade.sport.toLocaleLowerCase())) {
                return false;
            }
        }

        if (
            betTime &&
            dayjs(betTime).isValid() &&
            dayjs.unix(trade.bettime).isBefore(betTime)
        ) {
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
            [
                'bettime',
                'bettor',
                'sport',
                'league',
                'bettimevalue',
                'odd',
                'eventname',
            ].includes(sortBy.toLocaleLowerCase()) &&
            ['asc', 'desc'].includes(order.toLocaleLowerCase())
        ) {
            sortedTrades = orderBy(
                filteredTrades,
                [sortBy.toLocaleLowerCase()],
                [order.toLocaleLowerCase() as 'asc' | 'desc']
            );
        }
    }

    // apply pagination
    const paginatedTrades = slice(
        sortedTrades,
        (page - 1) * pageSize,
        page * pageSize
    );

    const generatedDate = result.generatedDate;

    const duration = result.duration;

    return json({
        uniqSports,
        trades: paginatedTrades,
        generatedDate,
        duration,
        total: filteredTrades.length,
        page,
        pageSize,
        betValues,
    });
};

export default function Index() {
    const {
        trades,
        generatedDate,
        duration,
        total,
        page,
        pageSize,
        uniqSports,
        betValues,
    } = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="my-4 text-xl font-bold">Unsettled trades</h1>
            <UnsettledTradesFilters sportList={uniqSports} />
            <div className="mt-8">
                {trades.length === 0 ? (
                    <p>No Results</p>
                ) : (
                    <>
                        <UnsettledTradesTable
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
