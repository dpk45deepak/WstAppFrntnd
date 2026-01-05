// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MapPin,
  Shield,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalPickups: number;
  totalDrivers: number;
  totalRevenue: number;
  pendingPickups: number;
  activeDrivers: number;
  userGrowth: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'pickup' | 'driver' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await api.get('/admin/stats', {
        params: { timeRange }
      });
      setStats(statsResponse.data);

      // Fetch recent activities
      const activitiesResponse = await api.get('/admin/activities');
      setRecentActivities(activitiesResponse.data);
    } catch (error: any) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: stats?.userGrowth || 0,
      color: 'bg-blue-50',
      to: '/admin/users'
    },
    {
      title: 'Total Pickups',
      value: stats?.totalPickups || 0,
      icon: <Package className="w-6 h-6 text-green-600" />,
      subValue: `${stats?.pendingPickups || 0} pending`,
      color: 'bg-green-50',
      to: '/admin/pickups'
    },
    {
      title: 'Active Drivers',
      value: stats?.activeDrivers || 0,
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      subValue: `${stats?.totalDrivers || 0} total`,
      color: 'bg-purple-50',
      to: '/admin/drivers'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      change: stats?.revenueGrowth || 0,
      color: 'bg-yellow-50',
      to: '/admin/reports'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Driver',
      description: 'Register a new driver account',
      icon: <Truck className="w-5 h-5" />,
      action: '/admin/drivers/add',
      variant: 'primary' as const
    },
    {
      title: 'View Reports',
      description: 'Generate detailed analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      action: '/admin/reports',
      variant: 'outline' as const
    },
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: <Users className="w-5 h-5" />,
      action: '/admin/users',
      variant: 'outline' as const
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4 mr-1" />
            Administrator
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
                )}
                {stat.change !== undefined && (
                  <div className="flex items-center mt-2">
                    {stat.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(stat.change)}% {stat.change >= 0 ? 'increase' : 'decrease'}
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => window.location.href = stat.to}
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.action}
                className={`
                  w-full p-4 rounded-lg border text-left transition-colors
                  ${action.variant === 'primary' 
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${action.variant === 'primary' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={action.variant === 'primary' ? 'text-blue-600' : 'text-gray-600'}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="shrink-0 mt-1">
                    {activity.type === 'user' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    {activity.type === 'pickup' && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    {activity.type === 'driver' && (
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    {activity.type === 'payment' && (
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pickup Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Avg. Response Time</p>
                <p className="text-2xl font-bold">15 min</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Service Coverage</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;