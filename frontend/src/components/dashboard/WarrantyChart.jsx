import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Card } from '../ui/Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartColors = {
  active: '#10B981', // green
  expiringSoon: '#F59E0B', // yellow
  expired: '#EF4444', // red
  unknown: '#6B7280', // gray
};

export function WarrantyChart({ devices }) {
  const [selectedView, setSelectedView] = useState('status'); // 'status' or 'monthly'
  
  // Calculate data for status distribution
  const statusData = {
    active: devices.filter(d => d.warrantyStatus === 'active').length,
    expiringSoon: devices.filter(d => d.warrantyStatus === 'expiring-soon').length,
    expired: devices.filter(d => d.warrantyStatus === 'expired').length,
    unknown: devices.filter(d => d.warrantyStatus === 'unknown').length,
  };

  // Calculate monthly expiration data (next 6 months)
  const getMonthlyData = () => {
    const today = new Date();
    const monthlyData = Array(6).fill(0);
    const monthNames = [];

    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      monthNames.push(month.toLocaleString('default', { month: 'short' }));
    }

    devices.forEach(device => {
      if (!device.warrantyEndDate) return;
      
      const endDate = new Date(device.warrantyEndDate);
      const monthDiff = (endDate.getFullYear() - today.getFullYear()) * 12 +
        endDate.getMonth() - today.getMonth();

      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyData[monthDiff]++;
      }
    });

    return { monthlyData, monthNames };
  };

  const { monthlyData, monthNames } = getMonthlyData();

  const doughnutData = {
    labels: ['Active', 'Expiring Soon', 'Expired', 'Unknown'],
    datasets: [
      {
        data: [
          statusData.active,
          statusData.expiringSoon,
          statusData.expired,
          statusData.unknown,
        ],
        backgroundColor: [
          chartColors.active,
          chartColors.expiringSoon,
          chartColors.expired,
          chartColors.unknown,
        ],
        borderColor: [
          chartColors.active,
          chartColors.expiringSoon,
          chartColors.expired,
          chartColors.unknown,
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Warranties Expiring',
        data: monthlyData,
        backgroundColor: chartColors.expiringSoon,
        borderColor: chartColors.expiringSoon,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: 'rgb(156, 163, 175)', // text-gray-500
        },
      },
    },
  };

  return (
    <Card className="h-[400px]">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Warranty Overview</Card.Title>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('status')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedView === 'status'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setSelectedView('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedView === 'monthly'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="h-[300px]">
        {selectedView === 'status' ? (
          <Doughnut data={doughnutData} options={chartOptions} />
        ) : (
          <Bar data={barData} options={chartOptions} />
        )}
      </Card.Content>
    </Card>
  );
}

WarrantyChart.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
      warrantyEndDate: PropTypes.string,
    })
  ).isRequired,
}; 