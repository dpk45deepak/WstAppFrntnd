// src/pages/driver/EarningsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  Package,
  CreditCard,
  BarChart3,
  Wallet,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface EarningsData {
  period: string;
  totalEarnings: number;
  completedPickups: number;
  pendingPayout: number;
  lastPayout: number;
  lastPayoutDate: string;
  earningsByDay: { day: string; earnings: number; pickups: number }[];
  earningsByType: { type: string; earnings: number; count: number }[];
  upcomingPayout: number;
  payoutDate: string;
  taxDeductions: number;
  netEarnings: number;
}

const EarningsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/driver/earnings', {
        params: { timeRange }
      });
      setEarningsData(response.data);
    } catch (error: any) {
      showToast(error.message || 'Failed to load earnings data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    try {
      const response = await api.post('/driver/earnings/export', {
        timeRange,
        format
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `earnings-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast(`Earnings exported as ${format.toUpperCase()}`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to export earnings', 'error');
    } finally {
      setExporting(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Earnings',
      value: `$${(earningsData?.totalEarnings || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50',
      change: '+12.5%',
      trend: 'up' as const
    },
    {
      title: 'Completed Pickups',
      value: (earningsData?.completedPickups || 0).toString(),
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      subValue: `$${(earningsData?.totalEarnings || 0) / (earningsData?.completedPickups || 1)} avg. per pickup`,
    },
    {
      title: 'Pending Payout',
      value: `$${(earningsData?.pendingPayout || 0).toLocaleString()}`,
      icon: <Wallet className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50',
      subValue: `Payout on ${earningsData?.payoutDate ? new Date(earningsData.payoutDate).toLocaleDateString() : 'N/A'}`,
    },
    {
      title: 'Last Payout',
      value: `$${(earningsData?.lastPayout || 0).toLocaleString()}`,
      icon: <Banknote className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50',
      subValue: earningsData?.lastPayoutDate ? new Date(earningsData.lastPayoutDate).toLocaleDateString() : 'N/A',
    }
  ];

  const getEarningsTrend = (earningsByDay: { earnings: number }[]) => {
    if (!earningsByDay || earningsByDay.length < 2) return { trend: 'neutral', percentage: 0 };
    
    const lastDay = earningsByDay[earningsByDay.length - 1].earnings;
    const prevDay = earningsByDay[earningsByDay.length - 2].earnings;
    
    if (prevDay === 0) return { trend: 'neutral', percentage: 0 };
    
    const percentage = ((lastDay - prevDay) / prevDay) * 100;
    return {
      trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const earningsTrend = earningsData ? getEarningsTrend(earningsData.earningsByDay) : { trend: 'neutral', percentage: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading earnings data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-gray-600">Track your earnings and manage payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            loading={exporting}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/driver/payouts/request'}
            className="flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">View earnings for:</span>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${timeRange === range
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }
                `}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
                )}
                {stat.change && (
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last period
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Earnings Trend</h2>
              <div className="flex items-center mt-1">
                {earningsTrend.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : earningsTrend.trend === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-sm ${earningsTrend.trend === 'up' ? 'text-green-600' : earningsTrend.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {earningsTrend.trend === 'up' ? '+' : earningsTrend.trend === 'down' ? '-' : ''}
                  {earningsTrend.percentage.toFixed(1)}% from previous period
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          
          <div className="h-64">
            {earningsData?.earningsByDay && earningsData.earningsByDay.length > 0 ? (
              <div className="h-full flex items-end space-x-2">
                {earningsData.earningsByDay.slice(-7).map((day, index) => {
                  const maxEarnings = Math.max(...earningsData.earningsByDay.map(d => d.earnings));
                  const height = maxEarnings > 0 ? (day.earnings / maxEarnings) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">{day.day.slice(0, 3)}</div>
                      <div
                        className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300 hover:opacity-90"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs font-medium mt-2">
                        ${day.earnings.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No earnings data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Earnings by Type */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Earnings by Waste Type</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {earningsData?.earningsByType && earningsData.earningsByType.length > 0 ? (
              earningsData.earningsByType.map((type, index) => {
                const percentage = (type.earnings / earningsData.totalEarnings) * 100;
                const typeColors: { [key: string]: string } = {
                  general: 'bg-gray-500',
                  recyclable: 'bg-green-500',
                  hazardous: 'bg-red-500',
                  organic: 'bg-yellow-500'
                };

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <span className="font-medium capitalize">{type.type}</span>
                        <span className="text-gray-500 text-xs ml-2">({type.count} pickups)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">${type.earnings.toFixed(2)}</span>
                        <span className="text-gray-500 text-xs ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${typeColors[type.type] || 'bg-gray-500'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500">No type data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Payout Details */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">Payout Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-4">
              <Wallet className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">Available for Payout</h3>
                <p className="text-3xl font-bold text-blue-800 mt-2">
                  ${(earningsData?.pendingPayout || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              Minimum payout: $50. Next payout date: {
                earningsData?.payoutDate 
                  ? new Date(earningsData.payoutDate).toLocaleDateString()
                  : 'Not scheduled'
              }
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <div className="flex items-center mb-4">
              <Banknote className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-900">Net Earnings</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">
                  ${(earningsData?.netEarnings || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-700">
              After tax deductions: ${(earningsData?.taxDeductions || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-purple-900">Projected Earnings</h3>
                <p className="text-3xl font-bold text-purple-800 mt-2">
                  ${((earningsData?.totalEarnings || 0) * 1.15).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-purple-700">
              Based on current performance (15% growth projection)
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Payout Method</h3>
              <p className="text-sm text-gray-600">Bank Transfer (•••• 1234)</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="lg">
                Update Payment Method
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                disabled={(earningsData?.pendingPayout || 0) < 50}
              >
                Request Payout
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: '2024-01-15', pickup: 'GW-1234', type: 'General', amount: 45.50, status: 'Paid' },
                { date: '2024-01-14', pickup: 'RW-5678', type: 'Recyclable', amount: 38.75, status: 'Paid' },
                { date: '2024-01-13', pickup: 'HW-9012', type: 'Hazardous', amount: 65.00, status: 'Pending' },
                { date: '2024-01-12', pickup: 'OW-3456', type: 'Organic', amount: 32.25, status: 'Paid' },
                { date: '2024-01-11', pickup: 'GW-7890', type: 'General', amount: 42.80, status: 'Paid' },
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{transaction.pickup}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EarningsPage;