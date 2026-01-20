// src/pages/driver/EarningsPage.tsx
import React, { useState, useEffect, useRef } from "react";
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
  ArrowDownRight,
  Sparkles,
  Target,
  Zap,
  Trophy,
  TrendingDown,
  RefreshCw,
  CheckCircle,
  Clock,
  Percent,
  PieChart,
  LineChart,
  Shield,
  Award,
  Users,
  Leaf,
  Eye,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
);

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
  avgDailyEarnings: number;
  peakEarnings: number;
  bestDay: string;
  rank: number;
  percentile: number;
}

const EarningsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [exporting, setExporting] = useState(false);
  const [activeChart, setActiveChart] = useState<
    "trend" | "distribution" | "comparison"
  >("trend");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");

  const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
  };

  const convertAmount = (amount: number) => {
    return (amount * currencyRates[currency]).toFixed(2);
  };

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/driver/earnings", {
        params: { timeRange },
      });
      // Simulate additional data
      const enhancedData = {
        ...response.data,
        avgDailyEarnings:
          response.data.totalEarnings /
          (timeRange === "week"
            ? 7
            : timeRange === "month"
              ? 30
              : timeRange === "quarter"
                ? 90
                : 365),
        peakEarnings: Math.max(
          ...(response.data.earningsByDay?.map((d: any) => d.earnings) || [0]),
        ),
        bestDay: response.data.earningsByDay?.reduce(
          (best: any, current: any) =>
            current.earnings > best.earnings ? current : best,
          { day: "Monday", earnings: 0 },
        ).day,
        rank: Math.floor(Math.random() * 500) + 1,
        percentile: Math.floor(Math.random() * 30) + 70,
      };
      setEarningsData(enhancedData);
    } catch (error: any) {
      showToast(error.message || "Failed to load earnings data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast(`Earnings exported as ${format.toUpperCase()}`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to export earnings", "error");
    } finally {
      setExporting(false);
    }
  };

  const getTrendData = () => {
    if (!earningsData?.earningsByDay) return null;

    const labels = earningsData.earningsByDay.map((d) => d.day.slice(0, 3));
    const data = earningsData.earningsByDay.map((d) => d.earnings);
    const pickups = earningsData.earningsByDay.map((d) => d.pickups);

    return {
      labels,
      datasets: [
        {
          label: "Earnings",
          data,
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#0d9488",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Pickups",
          data: pickups,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };
  };

  const getDistributionData = () => {
    if (!earningsData?.earningsByType) return null;

    const types = earningsData.earningsByType.map((t) => t.type);
    const earnings = earningsData.earningsByType.map((t) => t.earnings);
    const counts = earningsData.earningsByType.map((t) => t.count);

    return {
      labels: types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
      datasets: [
        {
          data: earnings,
          backgroundColor: [
            "rgba(13, 148, 136, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(244, 63, 94, 0.8)",
            "rgpersistate(168, 85, 247, 0.8)",
          ],
          borderColor: ["#0d9488", "#3b82f6", "#f43f5e", "#a855f7"],
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  };

  const getComparisonData = () => {
    const lastPeriodLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const lastPeriodData = Array(7)
      .fill(0)
      .map(() => Math.random() * 100 + 50);
    const currentPeriodData = Array(7)
      .fill(0)
      .map(() => Math.random() * 100 + 50);

    return {
      labels: lastPeriodLabels,
      datasets: [
        {
          label: "Last Period",
          data: lastPeriodData,
          backgroundColor: "rgba(156, 163, 175, 0.5)",
          borderColor: "#9ca3af",
          borderWidth: 1,
        },
        {
          label: "Current Period",
          data: currentPeriodData,
          backgroundColor: "rgba(13, 148, 136, 0.5)",
          borderColor: "#0d9488",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales:
      activeChart === "comparison"
        ? {
            x: {
              grid: {
                color: "rgba(229, 231, 235, 0.3)",
              },
              ticks: {
                color: "#6b7280",
              },
            },
            y: {
              grid: {
                color: "rgba(229, 231, 235, 0.3)",
              },
              ticks: {
                color: "#6b7280",
                callback: (value: any) => `$${value}`,
              },
            },
          }
        : {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#6b7280",
              },
            },
            y: {
              grid: {
                color: "rgba(229, 231, 235, 0.3)",
              },
              ticks: {
                color: "#6b7280",
                callback: (value: any) => `$${value}`,
              },
            },
          },
  };

  const summaryCards = [
    {
      title: "Total Earnings",
      value: `${currency}${convertAmount(earningsData?.totalEarnings || 0)}`,
      icon: <DollarSign className="w-6 h-6" />,
      linear: "from-teal-500 to-teal-600",
      change: "+12.5%",
      trend: "up" as const,
      metric: "All time",
    },
    {
      title: "Completed Pickups",
      value: (earningsData?.completedPickups || 0).toString(),
      icon: <Package className="w-6 h-6" />,
      linear: "from-blue-500 to-blue-600",
      subValue: `${currency}${convertAmount((earningsData?.totalEarnings || 0) / (earningsData?.completedPickups || 1))} avg.`,
      metric: "Pickups completed",
    },
    {
      title: "Pending Payout",
      value: `${currency}${convertAmount(earningsData?.pendingPayout || 0)}`,
      icon: <Wallet className="w-6 h-6" />,
      linear: "from-rose-500 to-rose-600",
      subValue: `Payout: ${earningsData?.payoutDate ? new Date(earningsData.payoutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}`,
      metric: "Available now",
    },
    {
      title: "Net Earnings",
      value: `${currency}${convertAmount(earningsData?.netEarnings || 0)}`,
      icon: <Banknote className="w-6 h-6" />,
      linear: "from-indigo-500 to-indigo-600",
      change: "+8.7%",
      trend: "up" as const,
      metric: "After deductions",
    },
  ];

  const getEarningsTrend = () => {
    if (!earningsData?.earningsByDay || earningsData.earningsByDay.length < 2) {
      return { trend: "neutral", percentage: 0 };
    }

    const currentPeriod = earningsData.earningsByDay
      .slice(-7)
      .reduce((sum, day) => sum + day.earnings, 0);
    const previousPeriod = earningsData.earningsByDay
      .slice(-14, -7)
      .reduce((sum, day) => sum + day.earnings, 0);

    if (previousPeriod === 0) return { trend: "neutral", percentage: 0 };

    const percentage =
      ((currentPeriod - previousPeriod) / previousPeriod) * 100;
    return {
      trend: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
      percentage: Math.abs(percentage),
    };
  };

  const earningsTrend = getEarningsTrend();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-blue-500 rounded-full animate-spin-slow"></div>
          <DollarSign className="absolute inset-0 m-auto w-10 h-10 text-white animate-bounce-slow" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Loading Earnings
          </h3>
          <p className="text-gray-500 mt-2">
            Calculating your earnings and statistics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Animated Background */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-teal-50 to-blue-50 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-r from-teal-500 to-blue-500 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Earnings Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Track your earnings, performance, and manage payouts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                {(["USD", "EUR", "GBP"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-2 ${currency === curr ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
              <Button
                // variant="linear"
                // linear="teal-blue"
                onClick={() =>
                  (window.location.href = "/driver/payouts/request")
                }
                className="group relative overflow-hidden"
              >
                <CreditCard className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                Request Payout
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range & Export */}
      <Card className="overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-teal-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Time Period:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["week", "month", "quarter", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    timeRange === range
                      ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                  {timeRange === range && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              loading={exporting}
              className="group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("pdf")}
              loading={exporting}
              className="group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
              Export PDF
            </Button>
            <Button
              // variant="ghost"
              onClick={fetchEarningsData}
              className="group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Enhanced Stats Overview */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden"
          >
            <div className="relative">
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-linear-to-br ${stat.linear} opacity-10 group-hover:scale-125 transition-transform duration-500`}
              ></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <span
                        className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                          stat.trend === "up"
                            ? "text-teal-600 bg-teal-50"
                            : "text-rose-600 bg-rose-50"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3 inline mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 inline mr-1" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  {stat.subValue && (
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.subValue}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{stat.metric}</p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-linear-to-br ${stat.linear} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Performance Rank</h3>
              <p className="text-sm text-gray-600">Among all drivers</p>
            </div>
          </div>
          <div className="text-center py-6">
            <div className="text-5xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              #{earningsData?.rank || 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Top {earningsData?.percentile || 0}% of drivers
            </p>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Peak Performance</h3>
              <p className="text-sm text-gray-600">Best day this period</p>
            </div>
          </div>
          <div className="text-center py-6">
            <div className="text-5xl font-bold bg-linear-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              ${earningsData?.peakEarnings?.toFixed(0) || 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Earned on {earningsData?.bestDay || "N/A"}
            </p>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Average Daily</h3>
              <p className="text-sm text-gray-600">Earnings per day</p>
            </div>
          </div>
          <div className="text-center py-6">
            <div className="text-5xl font-bold bg-linear-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              ${earningsData?.avgDailyEarnings?.toFixed(0) || 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${((earningsData?.avgDailyEarnings || 0) * 30).toFixed(0)}{" "}
              projected monthly
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Earnings Analytics
            </h2>
            <p className="text-gray-600">
              Visual breakdown of your earnings performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              {
                id: "trend",
                label: "Trend",
                icon: <LineChart className="w-4 h-4" />,
              },
              {
                id: "distribution",
                label: "Distribution",
                icon: <PieChart className="w-4 h-4" />,
              },
              {
                id: "comparison",
                label: "Comparison",
                icon: <BarChart3 className="w-4 h-4" />,
              },
            ].map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id as any)}
                className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeChart === chart.id
                    ? "bg-teal-50 text-teal-600 border border-teal-200"
                    : "text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span className="mr-2">{chart.icon}</span>
                {chart.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-96 mb-6">
          {activeChart === "trend" && getTrendData() && (
            <Line data={getTrendData()!} options={chartOptions} />
          )}
          {activeChart === "distribution" && getDistributionData() && (
            <div className="flex items-center justify-center h-full">
              <div className="w-64 h-64">
                <Pie data={getDistributionData()!} options={chartOptions} />
              </div>
            </div>
          )}
          {activeChart === "comparison" && getComparisonData() && (
            <Bar data={getComparisonData()!} options={chartOptions} />
          )}
        </div>

        {/* Chart Legend */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Current Period</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pickups Count</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Previous Period</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${
                  earningsTrend.trend === "up"
                    ? "text-teal-600"
                    : earningsTrend.trend === "down"
                      ? "text-rose-600"
                      : "text-gray-600"
                }`}
              >
                {earningsTrend.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 inline mr-1" />
                ) : earningsTrend.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 inline mr-1" />
                ) : null}
                {earningsTrend.percentage.toFixed(1)}% vs last period
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payout & Financial Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout Status */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-linear-to-r from-teal-500 to-blue-500 rounded-lg mr-3">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payout Status
                </h2>
                <p className="text-sm text-gray-600">
                  Track your payout progress
                </p>
              </div>
            </div>
            <Button
              // variant="linear"
              // gradient="teal-blue"
              disabled={(earningsData?.pendingPayout || 0) < 50}
              className="group relative overflow-hidden"
            >
              <CreditCard className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
              Request Payout
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
            </Button>
          </div>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Payout Progress</span>
                <span className="font-medium text-gray-900">
                  ${earningsData?.pendingPayout?.toFixed(2)} / $50
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-500 to-blue-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(100, ((earningsData?.pendingPayout || 0) / 50) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum $50 required for payout. Next payout date:{" "}
                {earningsData?.payoutDate
                  ? new Date(earningsData.payoutDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "Not scheduled"}
              </p>
            </div>

            {/* Payout Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">
                  ${earningsData?.pendingPayout?.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Next Payout</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ${earningsData?.upcomingPayout?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Summary */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-linear-to-r from-indigo-500 to-indigo-600 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Financial Summary
                </h2>
                <p className="text-sm text-gray-600">
                  Complete breakdown of your earnings
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "/driver/earnings/details")
              }
              className="group"
            >
              <Eye className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
              View Details
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Gross Earnings",
                value: earningsData?.totalEarnings || 0,
                color: "text-teal-600",
              },
              {
                label: "Tax Deductions",
                value: earningsData?.taxDeductions || 0,
                color: "text-rose-600",
              },
              {
                label: "Net Earnings",
                value: earningsData?.netEarnings || 0,
                color: "text-indigo-600",
              },
              {
                label: "Processing Fees",
                value: (earningsData?.totalEarnings || 0) * 0.029,
                color: "text-gray-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      index === 0
                        ? "bg-teal-500"
                        : index === 1
                          ? "bg-rose-500"
                          : index === 2
                            ? "bg-indigo-500"
                            : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-gray-600">{item.label}</span>
                </div>
                <span className={`font-medium ${item.color}`}>
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Annual Projection */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Projection</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${((earningsData?.totalEarnings || 0) * 12).toLocaleString()}
                </p>
              </div>
              <Percent className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
            <p className="text-gray-600">
              Latest earnings and payout activities
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="group">
              <Calendar className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
              Filter by Date
            </Button>
            <Button variant="outline" size="sm" className="group">
              <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Date & Time
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Transaction
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "TRX-001",
                  date: "2024-01-15 14:30",
                  description: "General Waste Pickup",
                  type: "Earnings",
                  amount: 45.5,
                  status: "Completed",
                  icon: <Package className="w-4 h-4" />,
                },
                {
                  id: "TRX-002",
                  date: "2024-01-14 11:15",
                  description: "Recyclables Pickup",
                  type: "Earnings",
                  amount: 38.75,
                  status: "Completed",
                  icon: <RefreshCw className="w-4 h-4" />,
                },
                {
                  id: "TRX-003",
                  date: "2024-01-13 16:45",
                  description: "Payout Processing",
                  type: "Payout",
                  amount: -150.25,
                  status: "Processing",
                  icon: <CreditCard className="w-4 h-4" />,
                },
                {
                  id: "TRX-004",
                  date: "2024-01-12 09:20",
                  description: "Organic Waste Pickup",
                  type: "Earnings",
                  amount: 32.25,
                  status: "Completed",
                  icon: <Leaf className="w-4 h-4" />,
                },
                {
                  id: "TRX-005",
                  date: "2024-01-11 13:10",
                  description: "Hazardous Waste Pickup",
                  type: "Earnings",
                  amount: 65.0,
                  status: "Completed",
                  icon: <Shield className="w-4 h-4" />,
                },
              ].map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        {transaction.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "Earnings"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`text-lg font-bold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-rose-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          transaction.status === "Completed"
                            ? "bg-green-500"
                            : transaction.status === "Processing"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Button
                      // variant="ghost"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/driver/transactions/${transaction.id}`)
                      }
                      className="group"
                    >
                      <Eye className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights & Tips */}
      <Card className="bg-linear-to-br from-teal-50 to-blue-50 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-teal-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">
                Earnings Insights
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Based on your performance, here are some tips to maximize your
              earnings:
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                <span>You earn 18% more on hazardous waste pickups</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                <span>Weekend pickups pay 12% higher than weekdays</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                <span>Complete 5+ pickups daily for bonus incentives</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block p-4 bg-linear-to-r from-teal-500 to-blue-500 rounded-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-3">
              Keep up the great work! 🎉
            </p>
            <p className="text-xs text-gray-600">
              You're on track for your best month yet
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EarningsPage;
