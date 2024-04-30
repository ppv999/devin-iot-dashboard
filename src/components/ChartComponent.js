import React from 'react';
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: chartData.label,
        data: chartData.values,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartComponent;
