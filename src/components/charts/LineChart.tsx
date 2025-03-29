import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  yAxisLabel?: string;
  xAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  labels,
  datasets,
  yAxisLabel,
  xAxisLabel,
}) => {
  // Default colors if not provided
  const defaultColors = [
    'rgb(34, 197, 94)', // primary-500
    'rgb(59, 130, 246)', // blue-500
    'rgb(249, 115, 22)', // orange-500
    'rgb(236, 72, 153)', // pink-500
  ];

  // Apply default colors if not provided in datasets
  const formattedDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
    backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length] + '33', // Add transparency
    tension: 0.3,
  }));

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel || '',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const data = {
    labels,
    datasets: formattedDatasets,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart; 