// src/pages/admin/ReportsPage.tsx
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Users,
  Package,
  Truck,
  DollarSign,
  PieChart,
  LineChart,
  Filter,
  Calendar,
  ChevronDown,
  Star,
  RefreshCw,
  Eye,
  Printer,
  Share2,
  Zap,
  Target,
  Clock,
  Award,
  Sparkles,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

interface ReportData {
  period: string;
  totalRevenue: number;
  totalPickups: number;
  newUsers: number;
  activeDrivers: number;
  pickupTypes: { [key: string]: number };
  revenueByMonth: { month: string; revenue: number }[];
  userGrowth: { month: string; users: number }[];
  topDrivers: {
    name: string;
    pickups: number;
    earnings: number;
    rating: number;
  }[];
}

const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [reportType, setReportType] = useState<
    "overview" | "revenue" | "users" | "drivers"
  >("overview");
  const [animatedStats, setAnimatedStats] = useState({
    revenue: 0,
    pickups: 0,
    users: 0,
    drivers: 0,
  });
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  useEffect(() => {
    if (reportData) {
      animateStats();
    }
  }, [reportData]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/reports", {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          type: reportType,
        },
      });
      setReportData(response.data);
    } catch (error: any) {
      showToast(error.message || "Failed to load report data", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchReportData();
    setRefreshing(false);
    showToast("Report data refreshed", "success");
  };

  const animateStats = () => {
    if (!reportData) return;

    setTimeout(
      () =>
        setAnimatedStats((s) => ({ ...s, revenue: reportData.totalRevenue })),
      100,
    );
    setTimeout(
      () =>
        setAnimatedStats((s) => ({ ...s, pickups: reportData.totalPickups })),
      300,
    );
    setTimeout(
      () => setAnimatedStats((s) => ({ ...s, users: reportData.newUsers })),
      500,
    );
    setTimeout(
      () =>
        setAnimatedStats((s) => ({ ...s, drivers: reportData.activeDrivers })),
      700,
    );
  };

  const handleExport = async (format: "csv" | "pdf" | "excel") => {
    setExporting(true);
    try {
      const response = await api.post(
        "/admin/reports/export",
        {
          startDate: dateRange.start,
          endDate: dateRange.end,
          type: reportType,
          format,
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ecotrack-report-${new Date().toISOString().split("T")[0]}.${format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast(`Report exported as ${format.toUpperCase()}`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to export report", "error");
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${animatedStats.revenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-green-50 via-white to-white",
      borderColor: "border-green-200",
      change: "+12.5%",
      trend: "up" as const,
      delay: 0.1,
    },
    {
      title: "Total Pickups",
      value: animatedStats.pickups.toLocaleString(),
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-400",
      bgColor: "bg-gradient-to-br from-blue-50 via-white to-white",
      borderColor: "border-blue-200",
      change: "+8.3%",
      trend: "up" as const,
      delay: 0.2,
    },
    {
      title: "New Users",
      value: animatedStats.users.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      color: "from-rose-500 to-purple-400",
      bgColor: "bg-gradient-to-br from-rose-50 via-white to-white",
      borderColor: "border-rose-200",
      change: "+15.2%",
      trend: "up" as const,
      delay: 0.3,
    },
    {
      title: "Active Drivers",
      value: animatedStats.drivers.toLocaleString(),
      icon: <Truck className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-indigo-50 via-white to-white",
      borderColor: "border-indigo-200",
      change: "+5.7%",
      trend: "up" as const,
      delay: 0.4,
    },
  ];

  const reportTypes = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
      color: "from-teal-500 to-blue-500",
    },
    {
      id: "revenue",
      label: "Revenue",
      icon: <DollarSign className="w-4 h-4" />,
      color: "from-green-500 to-teal-500",
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      color: "from-rose-500 to-purple-500",
    },
    {
      id: "drivers",
      label: "Drivers",
      icon: <Truck className="w-4 h-4" />,
      color: "from-indigo-500 to-blue-500",
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

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading report data..." />
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
      {/* Header */}
      <motion.div
        variants={containerVariants}
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
              <BarChart3 className="w-8 h-8 text-teal-600" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights and platform performance metrics
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50 hover:border-teal-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-medium shadow-lg"
            >
              <Filter className="w-4 h-4" />
              Export Options
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10"
                >
                  <div className="p-2">
                    {["pdf", "csv", "excel"].map((format) => (
                      <motion.button
                        key={format}
                        whileHover={{ x: 4 }}
                        onClick={() => handleExport(format as any)}
                        disabled={exporting}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span>Export as {format.toUpperCase()}</span>
                        <Download className="w-4 h-4" />
                      </motion.button>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
                        <span>Print Report</span>
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
                        <span>Share</span>
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
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
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-rose-600"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>

                <motion.div
                  className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-200 rounded-full mt-4 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: stat.delay }}
                >
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Type Selector & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Report Type Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Report Type
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {reportTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setReportType(type.id as any)}
                    className={`
                      flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-300
                      ${
                        reportType === type.id
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50"
                      }
                    `}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Revenue Trends
                </h2>
                <p className="text-gray-600">Monthly revenue performance</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-700"
              >
                <LineChart className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>

            <div className="h-64 relative">
              {reportData?.revenueByMonth?.slice(0, 6).map((item, index) => {
                const maxRevenue = Math.max(
                  ...(reportData?.revenueByMonth?.map((r) => r.revenue) || [0]),
                );
                const height =
                  maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{
                      left: `${(index * 100) / 6}%`,
                      width: `${100 / 6}%`,
                    }}
                  >
                    <div className="group relative">
                      <div
                        className="w-8 bg-gradient-to-t from-blue-500 via-blue-400 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90 cursor-pointer"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                          ${item.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {item.month}
                    </div>
                  </motion.div>
                );
              })}

              {!reportData?.revenueByMonth?.length && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No revenue data available</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Pickup Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Waste Distribution
                </h2>
                <p className="text-gray-600">Breakdown by pickup type</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-700"
              >
                <PieChart className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>

            <div className="space-y-6">
              {reportData?.pickupTypes &&
                Object.entries(reportData.pickupTypes).map(
                  ([type, count], index) => {
                    const total = Object.values(reportData.pickupTypes).reduce(
                      (a, b) => a + b,
                      0,
                    );
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    const typeColors: {
                      [key: string]: { gradient: string; bg: string };
                    } = {
                      general: {
                        gradient: "from-blue-500 to-teal-400",
                        bg: "bg-blue-100",
                      },
                      recyclable: {
                        gradient: "from-green-500 to-teal-400",
                        bg: "bg-green-100",
                      },
                      hazardous: {
                        gradient: "from-rose-500 to-indigo-400",
                        bg: "bg-rose-100",
                      },
                      organic: {
                        gradient: "from-amber-500 to-yellow-400",
                        bg: "bg-amber-100",
                      },
                    };

                    const colors = typeColors[type] || {
                      gradient: "from-gray-500 to-gray-400",
                      bg: "bg-gray-100",
                    };

                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}
                            />
                            <span className="font-medium capitalize text-gray-900">
                              {type}
                            </span>
                          </div>
                          <span className="text-gray-600 font-medium">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + 0.3,
                            }}
                            className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                          />
                        </div>
                      </motion.div>
                    );
                  },
                )}

              {!reportData?.pickupTypes && (
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No pickup type data available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Top Drivers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Top Performing Drivers
                </h2>
                <p className="text-gray-600">Based on performance metrics</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-700"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-gray-100">
                <div className="font-semibold text-gray-900">Driver</div>
                <div className="font-semibold text-gray-900">Pickups</div>
                <div className="font-semibold text-gray-900">Earnings</div>
                <div className="font-semibold text-gray-900">Rating</div>
                <div className="font-semibold text-gray-900">Status</div>
              </div>

              <div className="divide-y divide-gray-100">
                {reportData?.topDrivers?.slice(0, 5).map((driver, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-xl flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Driver #{index + 101}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {driver.pickups}
                      </div>
                      <Package className="w-4 h-4 text-gray-400 ml-2" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-teal-600">
                        ${driver.earnings.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">this period</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(driver.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ({driver.rating.toFixed(1)})
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-teal-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}

                {(!reportData?.topDrivers ||
                  reportData.topDrivers.length === 0) && (
                  <div className="p-12 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Driver Data
                    </h3>
                    <p className="text-gray-600">
                      Driver performance data will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Key Insights & Trends
              </h2>
              <p className="text-gray-600">
                Actionable intelligence from your data
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-teal-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Peak Service Hours",
                desc: "Most pickups scheduled between 10 AM - 2 PM",
                metric: "45%",
                icon: <Clock className="w-5 h-5" />,
                color: "from-blue-500 to-teal-400",
                bg: "bg-gradient-to-br from-blue-50 via-white to-white",
              },
              {
                title: "Revenue Growth",
                desc: "Monthly increase compared to last period",
                metric: "+18%",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "from-green-500 to-teal-400",
                bg: "bg-gradient-to-br from-green-50 via-white to-white",
              },
              {
                title: "User Retention",
                desc: "Users returning within 30 days",
                metric: "92%",
                icon: <Users className="w-5 h-5" />,
                color: "from-rose-500 to-purple-400",
                bg: "bg-gradient-to-br from-rose-50 via-white to-white",
              },
              {
                title: "Eco Impact",
                desc: "Waste diverted from landfills",
                metric: "125T",
                icon: <Zap className="w-5 h-5" />,
                color: "from-teal-500 to-green-400",
                bg: "bg-gradient-to-br from-teal-50 via-white to-white",
              },
              {
                title: "Service Quality",
                desc: "Average driver rating this month",
                metric: "4.8",
                icon: <Award className="w-5 h-5" />,
                color: "from-amber-500 to-yellow-400",
                bg: "bg-gradient-to-br from-amber-50 via-white to-white",
              },
              {
                title: "Response Time",
                desc: "Average pickup response time",
                metric: "15min",
                icon: <Target className="w-5 h-5" />,
                color: "from-indigo-500 to-blue-400",
                bg: "bg-gradient-to-br from-indigo-50 via-white to-white",
              },
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border-2 border-gray-100 ${insight.bg} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${insight.color}`}
                  >
                    {insight.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {insight.metric}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600">{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReportsPage;
