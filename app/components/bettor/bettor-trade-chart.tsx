import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    TimeSeriesScale,
    Tooltip,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import { type FC } from 'react';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    BarController,
    Legend,
    Tooltip,
    LineController
);

export const chartOptions: any = {
    responsive: true,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    interaction: {
        mode: 'point',
    },
    scales: {
        x: {
            type: 'timeseries',
            time: {
                tooltipFormat: 'dd/MM/yyyy',

                minUnit: 'day',
            },
            grid: {
                display: false,
            },
            axis: 'x',
        },
        profit: {
            type: 'linear',

            position: 'right',
            grid: {
                display: false,
            },
            title: {
                display: true,
                text: 'Total Profit',
            },

            axis: 'y',
        },
        volume: {
            type: 'linear',

            position: 'left',
            min: 0,
            suggestedMax: 10000,
            grid: {
                display: false,
            },
            axis: 'y',
            offset: true,
            title: {
                display: true,
                text: 'Daily Volume',
                color: 'green',
            },

            ticks: {
                color: 'green',
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            position: 'average',
            labels: {
                color: '#FFFFFF',
            },
        },
    },
};

export const BettorTradeChart: FC<{
    profitOverTime: { x: string; y: number; z: number }[];
}> = ({ profitOverTime }) => {
    const data = {
        labels: profitOverTime.map((trade) => trade.x),
        datasets: [
            {
                type: 'line' as const,
                label: 'profit',
                data: profitOverTime.map((trade) => trade.y),
                fill: false,
                yAxisID: 'profit',
            },
            {
                type: 'bar' as const,
                label: 'volume',
                data: profitOverTime.map((trade) => trade.z),
                backgroundColor: 'green',
                yAxisID: 'volume',
            },
        ],
    };

    // console.log(`profitOverTime`, profitOverTime);

    return (
        <div className="md:w-3/5">
            <Chart type="bar" data={data} options={chartOptions}></Chart>
        </div>
    );
};
