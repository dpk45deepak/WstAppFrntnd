// src/pages/admin/ReportsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download,
  // Filter,
  // Calendar,
  Users,
  Package,
  Truck,
  DollarSign,
  PieChart,
  LineChart
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface ReportData {
  period: string;
  totalRevenue: number;
  totalPickups: number;
  newUsers: number;
  activeDrivers: number;
  pickupTypes: { [key: string]: number };
  revenueByMonth: { month: string; revenue: number }[];
  userGrowth: { month: string; users: number }[];
  topDrivers: { name: string; pickups: number; earnings: number; rating: number }[];
}

const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState<'overview' | 'revenue' | 'users' | 'drivers'>('overview');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reports', {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          type: reportType
        }
      });
      setReportData(response.data);
    } catch (error: any) {
      showToast(error.message || 'Failed to load report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await api.post('/admin/reports/export', {
        startDate: dateRange.start,
        endDate: dateRange.end,
        type: reportType,
        format
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wstapp-report-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast(`Report exported as ${format.toUpperCase()}`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to export report', 'error');
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${(reportData?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50',
      change: '+12.5%',
      trend: 'up' as const
    },
    {
      title: 'Total Pickups',
      value: (reportData?.totalPickups || 0).toLocaleString(),
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      change: '+8.3%',
      trend: 'up' as const
    },
    {
      title: 'New Users',
      value: (reportData?.newUsers || 0).toLocaleString(),
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50',
      change: '+15.2%',
      trend: 'up' as const
    },
    {
      title: 'Active Drivers',
      value: (reportData?.activeDrivers || 0).toLocaleString(),
      icon: <Truck className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50',
      change: '+5.7%',
      trend: 'up' as const
    }
  ];

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'drivers', label: 'Drivers', icon: <Truck className="w-4 h-4" /> }
  ];

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading report data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => handleExport('pdf')}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Range */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Report Type */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id as any)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${reportType === type.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                      }
                    `}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last period
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Revenue Trends</h2>
            <Button variant="outline" size="sm">
              <LineChart className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {reportData?.revenueByMonth?.slice(0, 6).map((item, index) => {
              const maxRevenue = Math.max(...(reportData?.revenueByMonth?.map(r => r.revenue) || [0]));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">{item.month}</div>
                  <div
                    className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300 hover:opacity-90"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs font-medium mt-2">
                    ${(item.revenue / 1000).toFixed(1)}k
                  </div>
                </div>
              );
            })}
          </div>
          {!reportData?.revenueByMonth?.length && (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No revenue data available</p>
            </div>
          )}
        </Card>

        {/* Pickup Types Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Pickup Types Distribution</h2>
            <Button variant="outline" size="sm">
              <PieChart className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="space-y-4">
            {reportData?.pickupTypes && Object.entries(reportData.pickupTypes).map(([type, count]) => {
              const total = Object.values(reportData.pickupTypes).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              const typeColors: { [key: string]: string } = {
                general: 'bg-blue-500',
                recyclable: 'bg-green-500',
                hazardous: 'bg-red-500',
                organic: 'bg-yellow-500'
              };

              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-gray-600">{count} pickups ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${typeColors[type] || 'bg-gray-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!reportData?.pickupTypes && (
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500">No pickup type data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Drivers */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Top Performing Drivers</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData?.topDrivers?.slice(0, 5).map((driver, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.pickups}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">
                        ${driver.earnings.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({driver.rating.toFixed(1)})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {(!reportData?.topDrivers || reportData.topDrivers.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No driver data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Peak Hours</h3>
            </div>
            <p className="text-sm text-blue-800">
              Most pickups scheduled between 10 AM - 2 PM (45% of daily volume)
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Revenue Growth</h3>
            </div>
            <p className="text-sm text-green-800">
              Monthly revenue increased by 18% compared to last month
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">User Retention</h3>
            </div>
            <p className="text-sm text-purple-800">
              92% of users return within 30 days of their first pickup
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Add Star component import
const Star: React.FC<{ className: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

export default ReportsPage;