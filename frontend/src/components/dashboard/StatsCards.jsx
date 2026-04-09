import PropTypes from 'prop-types';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

const StatCard = ({ title, value, description, icon: Icon, trend }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <Card.Content className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {trend && (
            <p className={`mt-2 text-sm ${
              trend.type === 'increase' 
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              <span>{trend.value}%</span>
              <span className="ml-1">vs last month</span>
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </Card.Content>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.shape({
    type: PropTypes.oneOf(['increase', 'decrease']).isRequired,
    value: PropTypes.number.isRequired,
  }),
};

export function StatsCards({ devices }) {
  // Calculate statistics
  const totalDevices = devices.length;
  const activeWarranties = devices.filter(d => d.warrantyStatus === 'active').length;
  const expiringWarranties = devices.filter(d => d.warrantyStatus === 'expiring-soon').length;
  const expiredWarranties = devices.filter(d => d.warrantyStatus === 'expired').length;

  // Calculate coverage percentage
  const coveragePercentage = totalDevices 
    ? Math.round((activeWarranties / totalDevices) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Devices"
        value={totalDevices}
        description="Total registered devices"
        icon={Package}
        trend={{ type: 'increase', value: 12 }}
      />
      <StatCard
        title="Active Warranties"
        value={activeWarranties}
        description={`${coveragePercentage}% coverage`}
        icon={CheckCircle}
        trend={{ type: 'increase', value: 8 }}
      />
      <StatCard
        title="Expiring Soon"
        value={expiringWarranties}
        description="Within next 30 days"
        icon={Clock}
        trend={{ type: 'increase', value: 2 }}
      />
      <StatCard
        title="Expired Warranties"
        value={expiredWarranties}
        description="Requires attention"
        icon={AlertTriangle}
        trend={{ type: 'decrease', value: 4 }}
      />
    </div>
  );
}

StatsCards.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
    })
  ).isRequired,
}; 