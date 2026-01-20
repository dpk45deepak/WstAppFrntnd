// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from "react";
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
  BarChart3,
  PlusCircle,
  Activity,
  Zap,
  Sparkles,
  ChevronRight,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

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
  type: "user" | "pickup" | "driver" | "payment";
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
  const [animatedStats, setAnimatedStats] = useState<DashboardStats | null>(
    null,
  );
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">(
    "week",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    if (stats && !animatedStats) {
      animateStats();
    }
  }, [stats, animatedStats]);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const statsResponse = await api.get("/admin/stats", {
        params: { timeRange },
      });
      setStats(statsResponse.data);

      const activitiesResponse = await api.get("/admin/activities");
      setRecentActivities(activitiesResponse.data);
    } catch (error: any) {
      showToast(error.message || "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const animateStats = () => {
    if (!stats) return;

    const animatedData = { ...stats };
    Object.keys(animatedData).forEach((key, index) => {
      const typedKey = key as keyof DashboardStats;
      setTimeout(() => {
        setAnimatedStats((prev: any) => ({
          ...prev,
          [typedKey]: stats[typedKey],
        }));
      }, index * 150);
    });
  };

  const statCards = [
    {
      title: "Total Users",
      value: animatedStats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      change: animatedStats?.userGrowth || 0,
      color: "from-blue-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-blue-50 via-white to-white",
      borderColor: "border-blue-200",
      delay: 0.1,
      to: "/admin/users",
    },
    {
      title: "Total Pickups",
      value: animatedStats?.totalPickups || 0,
      icon: <Package className="w-6 h-6" />,
      subValue: `${animatedStats?.pendingPickups || 0} pending`,
      color: "from-teal-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-teal-50 via-white to-white",
      borderColor: "border-teal-200",
      delay: 0.2,
      to: "/admin/pickups",
    },
    {
      title: "Active Drivers",
      value: animatedStats?.activeDrivers || 0,
      icon: <Truck className="w-6 h-6" />,
      subValue: `${animatedStats?.totalDrivers || 0} total`,
      color: "from-rose-500 to-indigo-400",
      bgColor: "bg-gradient-to-br from-rose-50 via-white to-white",
      borderColor: "border-rose-200",
      delay: 0.3,
      to: "/admin/drivers",
    },
    {
      title: "Total Revenue",
      value: `$${(animatedStats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      change: animatedStats?.revenueGrowth || 0,
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-indigo-50 via-white to-white",
      borderColor: "border-indigo-200",
      delay: 0.4,
      to: "/admin/reports",
    },
  ];

  const quickActions = [
    {
      title: "Add New Driver",
      description: "Register a new driver account",
      icon: <Truck className="w-5 h-5" />,
      action: "/admin/drivers/add",
      variant: "primary" as const,
      color: "from-teal-500 to-blue-500",
    },
    {
      title: "View Reports",
      description: "Generate detailed analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      action: "/admin/reports",
      variant: "outline" as const,
      color: "text-blue-600 border-blue-200 hover:border-blue-500",
    },
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: <Users className="w-5 h-5" />,
      action: "/admin/users",
      variant: "outline" as const,
      color: "text-teal-600 border-teal-200 hover:border-teal-500",
    },
  ];

  const platformHealth = [
    {
      title: "Pickup Success Rate",
      value: "98.5%",
      icon: <Target className="w-5 h-5" />,
      color: "from-green-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-green-50 via-white to-white",
      borderColor: "border-green-200",
      change: "+2.3%",
    },
    {
      title: "Avg. Response Time",
      value: "15 min",
      icon: <Clock className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-400",
      bgColor: "bg-gradient-to-br from-blue-50 via-white to-white",
      borderColor: "border-blue-200",
      change: "-5 min",
    },
    {
      title: "Service Coverage",
      value: "85%",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-rose-500 to-purple-400",
      bgColor: "bg-gradient-to-br from-rose-50 via-white to-white",
      borderColor: "border-rose-200",
      change: "+12%",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-indigo-50 via-white to-white",
      borderColor: "border-indigo-200",
      change: "+0.3",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Header with Admin Badge */}
      <motion.div
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Shield className="w-8 h-8 text-teal-600" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back,{" "}
                <span className="font-semibold text-teal-600">
                  {user?.name}
                </span>
                . Here's what's happening with your platform.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span className="font-semibold">Administrator</span>
          </motion.div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300 transition-colors cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50 hover:border-teal-300 transition-colors disabled:opacity-50"
          >
            <Activity
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid with Animated Counters */}
      <motion.div
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            // variants={itemVariants}
            custom={stat.delay}
            whileHover={{
              y: -8,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            <Card
              className={`h-full border-2 ${stat.borderColor} ${stat.bgColor} overflow-hidden group hover:shadow-xl transition-all duration-300`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}
                  >
                    {stat.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/50 border border-white backdrop-blur-sm" />
                </div>

                <p className="text-sm font-medium text-gray-500 mb-2">
                  {stat.title}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {stat.subValue}
                    </p>
                  )}
                </div>

                {stat.change !== undefined && (
                  <div className="flex items-center mt-4">
                    <div
                      className={`flex items-center px-2 py-1 rounded-lg ${stat.change >= 0 ? "bg-green-100" : "bg-rose-100"}`}
                    >
                      {stat.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${stat.change >= 0 ? "text-green-700" : "text-rose-700"}`}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                    <div className="ml-auto">
                      <Button
                        // variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-teal-600"
                        onClick={() => (window.location.href = stat.to)}
                      >
                        View <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <Sparkles className="w-5 h-5 text-teal-500" />
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = action.action)}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all duration-300 group
                    ${
                      action.variant === "primary"
                        ? `bg-gradient-to-r ${action.color} text-white border-transparent shadow-lg hover:shadow-xl`
                        : `bg-white ${action.color} hover:bg-gradient-to-br hover:from-white hover:to-gray-50`
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg ${action.variant === "primary" ? "bg-white/20" : "bg-gray-100"}`}
                    >
                      {action.icon}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm opacity-80">{action.description}</p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 ml-auto ${action.variant === "primary" ? "text-white" : "text-gray-400"} group-hover:translate-x-1 transition-transform`}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <p className="text-gray-600 text-sm">
                  Real-time platform updates
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-700 hover:border-teal-500"
              >
                View All
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {recentActivities.length > 0 ? (
                <motion.div
                  // variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      // variants={itemVariants}
                      custom={index * 0.1}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="shrink-0 mt-1">
                        {activity.type === "user" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center shadow-sm">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {activity.type === "pickup" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {activity.type === "driver" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-sm">
                            <Truck className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {activity.type === "payment" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {activity.user && (
                          <p className="text-xs text-gray-500 mt-2">
                            By{" "}
                            <span className="font-medium text-teal-600">
                              {activity.user}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(activity.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Recent Activity
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Activities will appear here as they happen
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Platform Health Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Platform Health
              </h2>
              <p className="text-gray-600">Key performance indicators</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              Excellent
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformHealth.map((metric, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-2xl border-2 ${metric.borderColor} ${metric.bgColor} group hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}
                  >
                    {metric.icon}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: metric.value }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* System Status Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap items-center justify-center gap-6 pt-4"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div className="text-sm text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div className="text-sm text-gray-500">
          Uptime: <span className="font-medium text-teal-600">99.9%</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboardPage;
