import { Link } from '@remix-run/react';
import { type FC } from 'react';
import { type OpenTrade } from '../../utils/trade-model';
import {
    getBetTimeFormat,
    getDisplayAmount,
    getTxUrl,
} from '../../utils/utils';
import { BettorName } from '../commun/bettor-name';
import { SortableHeader } from '../commun/sortable-header';

export const UnsettledTradesTable: FC<{
    trades: OpenTrade[];
    total: number;
    betValue: number;
}> = ({ trades, total, betValue }) => {
    return (
        <div className=" prose max-w-none overflow-x-auto prose-table:mb-1 ">
            <table className="table table-zebra table-auto max-md:table-xs">
                <caption className="mx-2 my-2 caption-top text-left">
                    Showing {total} trades with a total value of {betValue}
                </caption>
                <thead className="">
                    <tr>
                        <SortableHeader sortName="bettime">
                            Bet time
                        </SortableHeader>

                        <SortableHeader sortName="bettor">
                            Bettor
                        </SortableHeader>

                        <SortableHeader sortName="sport">Sport</SortableHeader>

                        <SortableHeader sortName="league">
                            League
                        </SortableHeader>

                        <SortableHeader sortName="eventname">
                            Event
                        </SortableHeader>

                        <th className="">Bet</th>

                        <SortableHeader
                            sortName="bettimevalue"
                            className="text-right"
                        >
                            Amount
                        </SortableHeader>

                        <SortableHeader sortName="odd" className="text-right">
                            Odd
                        </SortableHeader>

                        <th className=""></th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.id}>
                            <td className="">
                                {getBetTimeFormat(Number(trade.bettime))}
                            </td>
                            <td className="">
                                <Link
                                    to={'/bettors/' + trade.bettor}
                                    className="link-hover link link-primary"
                                >
                                    <BettorName
                                        bettorId={trade.bettor}
                                    ></BettorName>
                                </Link>
                            </td>
                            <td className="">{trade.sport}</td>
                            <td className="">{trade.league}</td>
                            <td className="">
                                <Link
                                    to={'/events/' + trade.eventid}
                                    className="link-hover link link-primary"
                                >
                                    {trade.eventname}
                                </Link>
                            </td>
                            <td className="">{trade.bet}</td>

                            <td className="text-right">
                                {getDisplayAmount(
                                    trade.amount,
                                    trade.baseToken
                                )}
                            </td>
                            <td className="text-right">{trade.odd}</td>
                            <td className="not-prose whitespace-nowrap">
                                {trade.info.fillTx !== null && (
                                    <a
                                        href={getTxUrl(
                                            trade.baseToken,
                                            trade.info.fillTx
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {' '}
                                        <span
                                            className="mx-1"
                                            title="fill transaction"
                                        >
                                            🧾
                                        </span>
                                    </a>
                                )}
                                {trade.info.isLive && (
                                    <span className="mx-1" title="live bet">
                                        🏃
                                    </span>
                                )}
                                {trade.info.failed && (
                                    <span className="mx-1" title="failed">
                                        ❌
                                    </span>
                                )}
                                {!trade.info.isValid && (
                                    <span className="mx-1" title="invalid">
                                        ⚠️
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
