import { Link } from '@remix-run/react';
import { SortableHeader } from '../commun/sortable-header';

import { type FC } from 'react';
import { type EventTrade } from '../../utils/trade-model';
import {
    getBetTimeFormat,
    getDisplayAmount,
    getTxUrl,
} from '../../utils/utils';
import { BettorName } from '../commun/bettor-name';
export const EventTradesTable: FC<{
    trades: EventTrade[];
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
                            bettime
                        </SortableHeader>

                        <SortableHeader sortName="bettor">
                            bettor
                        </SortableHeader>
                        <th className="">bet</th>

                        <SortableHeader
                            sortName="bettimevalue"
                            className="text-right"
                        >
                            amount
                        </SortableHeader>
                        <SortableHeader sortName="odd" className="text-right">
                            odd
                        </SortableHeader>
                        <th className="text-right">profit</th>
                        {/* <th className="">settledate</th> */}
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

                            <td className="">{trade.bet}</td>
                            <td className="text-right">
                                {getDisplayAmount(
                                    trade.amount,
                                    trade.baseToken
                                )}
                            </td>
                            <td className="text-right">{trade.odd}</td>
                            <td className="text-right">
                                {trade.profit !== null ? trade.profit : ''}
                            </td>
                            {/* <td className="">
                                {trade.settledate !== null
                                    ? getBetTimeFormatFromIso(trade.settledate)
                                    : ''}
                            </td> */}
                            <td className="not-prose whitespace-nowrap">
                                <span>
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
                                                className="mr-1"
                                                title="fill transaction"
                                            >
                                                🧾
                                            </span>
                                        </a>
                                    )}
                                    {trade.info.isLive && (
                                        <span title="live bet">🏃</span>
                                    )}
                                    {trade.info.failed && (
                                        <span title="failed">❌</span>
                                    )}
                                    {!trade.info.isValid && (
                                        <span title="invalid">⚠️</span>
                                    )}
                                    {trade.info.isMaker && (
                                        <span title="maker bet">💰</span>
                                    )}
                                    {trade.info.settlementTx && (
                                        <a
                                            href={getTxUrl(
                                                trade.baseToken,
                                                trade.info.settlementTx
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {' '}
                                            <span
                                                className=""
                                                title="settlement transaction"
                                            >
                                                📝
                                            </span>
                                        </a>
                                    )}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
