import {
    json,
    type HeadersFunction,
    type LoaderFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import sortBy from 'lodash/sortBy.js';
import { BettorTradeChart } from '../components/bettor/bettor-trade-chart';
import { BettorTradesTable } from '../components/bettor/bettor-trade-table';
import { BettorTradesFilters } from '../components/bettor/bettor-trades-filters';
import { EditableBettorName } from '../components/commun/editable-bettor-name';
import { Pagination } from '../components/commun/pagination';
import { QueryStats } from '../components/query-stats';
import { getCachedBettorTrades } from '../db/cached-trade-dao.server';

export const headers: HeadersFunction = ({}) => ({
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
});

export let loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '25', 10);

    const all = url.searchParams.get('all') === 'true';

    const bettorId = params.id;
    if (!bettorId) {
        throw json('Not Found', { status: 404 });
    }

    // filters
    const minSize = parseInt(url.searchParams.get('min') || '0', 10);
    const sports = url.searchParams.getAll('sport') || [];
    const minbetTime = url.searchParams.get('minbettime') || undefined;
    const maxbettime = url.searchParams.get('maxbettime') || undefined;
    const hidemaker = url.searchParams.get('hidemaker') === 'true';
    const hidetaker = url.searchParams.get('hidetaker') === 'true';

    // sorting
    const sort = url.searchParams.get('sort') || undefined;
    const order = url.searchParams.get('order') || undefined;

    const result = await getCachedBettorTrades(bettorId, all);

    // console.log(`result: ${result.trades.length}`);

    //get all disctinc sports from the result using a Set
    const uniqSports = Array.from(
        new Set(result.trades.map((trade) => trade.sport))
    );

    // apply filters
    const filteredTrades = result.trades.filter((trade) => {
        if (minSize && trade.bettimevalue < minSize) {
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

        if (hidemaker && trade.info.isMaker) {
            return false;
        }

        if (hidetaker && !trade.info.isMaker) {
            return false;
        }

        if (
            minbetTime &&
            dayjs(minbetTime).isValid() &&
            dayjs.unix(trade.bettime).isBefore(minbetTime)
        ) {
            return false;
        }

        if (
            maxbettime &&
            dayjs(maxbettime).isValid() &&
            dayjs.unix(trade.bettime).isAfter(maxbettime)
        ) {
            return false;
        }

        return true;
    });

    // console.log(`filteredTrades: ${filteredTrades.length}`);

    // apply sorting
    let sortedTrades = filteredTrades;
    if (sort && order) {
        if (
            ['bettime', 'bettor', 'bettimevalue', 'odd', 'profit'].includes(
                sort.toLocaleLowerCase()
            ) &&
            ['asc', 'desc'].includes(order.toLocaleLowerCase())
        ) {
            sortedTrades = orderBy(
                filteredTrades,
                [sort.toLocaleLowerCase()],
                [order.toLocaleLowerCase() as 'asc' | 'desc']
            );
        }
    }

    // get only settled trades
    const settledTrades = sortedTrades.filter(
        (trade) => trade.settled && trade.settledate && trade.profit !== null
    );

    // reduce array per day using YYYY-MM-DD format
    const tradesPerDay = settledTrades.reduce(
        (acc, trade) => {
            const date = dayjs(trade.settledate!).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = {
                    totalAmount: trade.bettimevalue,
                    totalProfit: trade.profit!,
                    numberOfTrades: 1,
                };
            } else {
                acc[date].totalAmount =
                    acc[date].totalAmount + trade.bettimevalue;
                acc[date].totalProfit = acc[date].totalProfit + trade.profit!;
                acc[date].numberOfTrades = acc[date].numberOfTrades + 1;
            }

            return acc;
        },
        {} as Record<
            string,
            {
                totalAmount: number;
                totalProfit: number;
                numberOfTrades: number;
            }
        >
    );

    const arrayofTradesPerDay = Object.keys(tradesPerDay).map((key) => {
        return {
            x: key,
            y: tradesPerDay[key].totalProfit,
            z: tradesPerDay[key].totalAmount,
            n: tradesPerDay[key].numberOfTrades,
        };
    });

    let totalProfit = 0;
    const profitOverTime: { x: string; y: number; z: number }[] = sortBy(
        arrayofTradesPerDay,
        'x'
    ).map((trade) => {
        totalProfit = totalProfit + trade.y;
        return {
            x: trade.x,
            y: totalProfit,
            z: trade.z,
        };
    });

    //get total amount
    const betValuesNumber = profitOverTime.reduce(
        (acc, trade) => acc + trade.z,
        0
    );
    const betValues = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(betValuesNumber);

    const paginatedTrades = slice(
        sortedTrades,
        (page - 1) * pageSize,
        page * pageSize
    );

    const generatedDate = result.generatedDate;
    const duration = result.duration;

    return {
        profitOverTime,
        bettorId,
        trades: paginatedTrades,
        generatedDate,
        duration,
        page,
        pageSize,
        total: filteredTrades.length,
        uniqSports,
        betValues,
    };
};

export default function EventDetails() {
    const {
        profitOverTime,
        bettorId,
        trades,
        generatedDate,
        duration,
        page,
        pageSize,
        total,
        uniqSports,
        betValues,
    } = useLoaderData<typeof loader>();

    return (
        <>
            <EditableBettorName bettorId={bettorId}></EditableBettorName>

            <BettorTradesFilters sportList={uniqSports} />
            <div className="mt-8">
                {trades.length === 0 ? (
                    <p>No Results</p>
                ) : (
                    <>
                        <BettorTradeChart profitOverTime={profitOverTime} />
                        <BettorTradesTable
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
