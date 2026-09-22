import { useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useDevicesQuery } from '../hooks/useDevices';
import { Card } from '../components/ui/Card';
import { NotificationDropdown } from '../components/ui/NotificationDropdown';
import { getDeviceIcon } from '../utils/getDeviceIcon'; // ♻️ shared icon logic (was duplicated inline)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Shield,
  Clock,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

// 🔽 Local sub-component: only used on this page, so it lives here instead of its own file.
function SpendingChart({ data }) {
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Spending']}
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="spending" fill="#3b82f6" name="Total Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Dashboard() {
  const { data: devices = [], isLoading, isFetching, error } = useDevicesQuery();
  const navigate = useNavigate();
  const normalizeStatus = (status) => (status || '').toLowerCase().replace(' ', '-');

  // This data processing logic for the chart is already correct
  const spendingData = useMemo(() => {
    if (!devices || devices.length === 0) return [];

    const spendingByYear = devices.reduce((acc, device) => {
      const year = new Date(device.purchaseDate).getFullYear();
      const price = device.purchasePrice || 0;
      
      if (!acc[year]) {
        acc[year] = { year: year.toString(), spending: 0 };
      }
      acc[year].spending += price;
      
      return acc;
    }, {});

    return Object.values(spendingByYear).sort((a, b) => a.year.localeCompare(b.year));
  }, [devices]);


  // Only block on a spinner when there is truly nothing to show yet (first
  // ever visit, empty cache). Once we have data - even stale data from a
  // previous visit - we show it immediately and refresh quietly in the
  // background (see the small spinner next to the title below).
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Error loading dashboard
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error.userMessage || error.message}
          </p>
        </div>
      </div>
    );
  }

  const activeDevices = devices.filter(d => normalizeStatus(d.warrantyStatus) === 'active').length;
  const expiringSoon = devices.filter(d => normalizeStatus(d.warrantyStatus) === 'expiring-soon').length;
  const expiredDevices = devices.filter(d => normalizeStatus(d.warrantyStatus) === 'expired').length;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Dashboard
          {isFetching && (
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" aria-label="Refreshing" />
          )}
        </h1>
        <div className="flex items-center">
          <NotificationDropdown />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/80 dark:to-emerald-900/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-emerald-900/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800 dark:text-white">Active Warranties</h3>
              <div className="p-2 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm"><Shield className="w-6 h-6 text-green-600 dark:text-white" /></div>
            </div>
            <p className="text-4xl font-bold text-green-900 dark:text-white">{activeDevices}</p>
            <p className="mt-2 text-sm text-green-700 dark:text-gray-200">Protected devices</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-amber-900/80 dark:to-yellow-900/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-amber-900/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-white">Expiring Soon</h3>
              <div className="p-2 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm"><Clock className="w-6 h-6 text-yellow-600 dark:text-white" /></div>
            </div>
            <p className="text-4xl font-bold text-yellow-900 dark:text-white">{expiringSoon}</p>
            <p className="mt-2 text-sm text-yellow-700 dark:text-gray-200">Need attention soon</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-rose-900/80 dark:to-red-900/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-rose-900/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800 dark:text-white">Expired</h3>
              <div className="p-2 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-white" /></div>
            </div>
            <p className="text-4xl font-bold text-red-900 dark:text-white">{expiredDevices}</p>
            <p className="mt-2 text-sm text-red-700 dark:text-gray-200">Require immediate action</p>
          </div>
        </Card>
      </div>
      
      

      {/* Recent Devices */}
      <Card className="bg-white dark:bg-transparent border dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Devices</h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {devices.slice(0, 5).map(device => {
              const DeviceIcon = getDeviceIcon(device);
              return (
                <div 
                  key={device.id} 
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150 rounded-md px-2 -mx-2"
                  onClick={() => navigate(`/devices/${device.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <DeviceIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {device.name || `${device.manufacturer} - ${device.model}`}
                        </h3>
                        <div className="mt-1 flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            device.warrantyStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            device.warrantyStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {device.warrantyStatus.replace('-', ' ').charAt(0).toUpperCase() + device.warrantyStatus.slice(1).replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Expires: {new Date(device.warrantyEndDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      {/* ✨ ADDED: Spending Chart Section */}
      <Card className="bg-white dark:bg-transparent border dark:border-gray-700">
        <Card.Header>
          <Card.Title className="text-xl font-semibold text-gray-900 dark:text-white">Spending Over Time</Card.Title>
          <Card.Description>Total purchase price of devices added each year.</Card.Description>
        </Card.Header>
        <Card.Content>
          {spendingData.length > 0 ? (
            <SpendingChart data={spendingData} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No spending data available. Add devices with a purchase price to see this chart.</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}