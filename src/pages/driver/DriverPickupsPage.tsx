// src/pages/driver/DriverPickupsPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Navigation,
  Calendar,
  TrendingUp,
  DollarSign,
  Award,
  RefreshCw,
  AlertCircle,

Shield,
    Leaf,
  Zap,
  Truck,
  PlayCircle,
  StopCircle,
  Timer,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import pickupService from "../../services/pickup";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Pagination from "../../components/common/Pagination";

interface DriverPickup {
  id: string;
  userId: string;
  userName: string;
  address: string;
  pickupTime: string;
  wasteType: "general" | "recyclable" | "hazardous" | "organic";
  quantity: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  price: number;
  completedAt?: string;
  rating?: number;
  feedback?: string;
  specialInstructions?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  distance?: number;
  customerPhone?: string;
}

const DriverPickupsPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState<DriverPickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<DriverPickup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "all" | "today" | "active" | "upcoming"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [_, setSelectedPickup] = useState<DriverPickup | null>(
    null,
  );
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statsRef = useRef<HTMLDivElement>(null);
  const today = new Date().toDateString();

  useEffect(() => {
    fetchDriverPickups();
  }, [currentPage]);

  useEffect(() => {
    filterPickups();
  }, [pickups, searchQuery, statusFilter, dateFilter, activeTab]);

  const fetchDriverPickups = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      const response: any = await pickupService.getDriverPickups(user.id);
      // Simulate additional data
      const enhancedPickups = (response.data || []).map(
        (pickup: DriverPickup) => ({
          ...pickup,
          estimatedDuration: Math.floor(Math.random() * 120) + 30,
          actualDuration:
            pickup.status === "completed"
              ? Math.floor(Math.random() * 120) + 30
              : undefined,
          distance: Math.random() * 20 + 1,
          customerPhone:
            pickup.status === "in_progress" || pickup.status === "scheduled"
              ? `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
              : undefined,
        }),
      );
      setPickups(enhancedPickups);
      setTotalPages(Math.ceil(enhancedPickups.length / itemsPerPage));
    } catch (error: any) {
      showToast(error.message || "Failed to load your pickups", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.address.toLowerCase().includes(query) ||
          p.userName.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(
        (p) => new Date(p.pickupTime).toDateString() === filterDate,
      );
    }

    if (activeTab === "today") {
      filtered = filtered.filter(
        (p) => new Date(p.pickupTime).toDateString() === today,
      );
    } else if (activeTab === "active") {
      filtered = filtered.filter(
        (p) => p.status === "scheduled" || p.status === "in_progress",
      );
    } else if (activeTab === "upcoming") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter(
        (p) =>
          new Date(p.pickupTime) > new Date() &&
          new Date(p.pickupTime) <= tomorrow,
      );
    }

    setFilteredPickups(
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    );
  };

  const handleStatusUpdate = async (
    pickupId: string,
    action: "start" | "complete" | "cancel",
  ) => {
    try {
      if (action === "start") await pickupService.startPickup(pickupId);
      if (action === "complete") await pickupService.completePickup(pickupId);
      if (action === "cancel") await pickupService.cancelPickup(pickupId);

      const actionMessages = {
        start: "Pickup started successfully! 🚚",
        complete: "Pickup completed successfully! ✅",
        cancel: "Pickup cancelled successfully! ⚠️",
      };

      showToast(actionMessages[action], "success");
      fetchDriverPickups();
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} pickup`, "error");
    }
  };

  const handleQuickAction = async (
    pickupId: string,
    action: "start" | "complete",
  ) => {
    try {
      if (action === "start") {
        await pickupService.startPickup(pickupId);
        showToast("Pickup started! 🚀", "success");
      } else if (action === "complete") {
        await pickupService.completePickup(pickupId);
        showToast("Pickup completed! 🎉", "success");
      }
      fetchDriverPickups();
      setShowQuickActions(false);
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} pickup`, "error");
    }
  };

  const getStatusBadge = (status: DriverPickup["status"]) => {
    const statusConfig = {
      scheduled: {
        color: "bg-linear-to-r from-yellow-500 to-amber-500 text-white",
        icon: <Clock className="w-3 h-3 animate-pulse" />,
        glow: "shadow-lg shadow-yellow-500/30",
      },
      in_progress: {
        color: "bg-linear-to-r from-blue-500 to-blue-600 text-white",
        icon: <Navigation className="w-3 h-3 animate-spin-slow" />,
        glow: "shadow-lg shadow-blue-500/30",
      },
      completed: {
        color: "bg-linear-to-r from-teal-500 to-teal-600 text-white",
        icon: <CheckCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-teal-500/30",
      },
      cancelled: {
        color: "bg-linear-to-r from-rose-500 to-rose-600 text-white",
        icon: <XCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-rose-500/30",
      },
    };
    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.glow} transition-all duration-300 hover:scale-105`}
      >
        <span className="mr-1.5">{config.icon}</span>
        {status.replace("_", " ").charAt(0).toUpperCase() +
          status.replace("_", " ").slice(1)}
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType: DriverPickup["wasteType"]) => {
    const icons = {
      general: {
        icon: <Package className="w-5 h-5" />,
        color: "bg-linear-to-br from-gray-500 to-gray-600",
        bg: "bg-gray-100",
      },
      recyclable: {
        icon: <RefreshCw className="w-5 h-5" />,
        color: "bg-linear-to-br from-blue-500 to-blue-600",
        bg: "bg-blue-100",
      },
      hazardous: {
        icon: <Shield className="w-5 h-5" />,
        color: "bg-linear-to-br from-rose-500 to-rose-600",
        bg: "bg-rose-100",
      },
      organic: {
        icon: <Leaf className="w-5 h-5" />,
        color: "bg-linear-to-br from-teal-500 to-teal-600",
        bg: "bg-teal-100",
      },
    };
    return icons[wasteType];
  };

  const getTimeRemaining = (pickupTime: string) => {
    const now = new Date();
    const pickupDate = new Date(pickupTime);
    const diffMs = pickupDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0)
      return {
        text: "Overdue",
        color: "bg-linear-to-r from-rose-500 to-rose-600",
        urgency: "high",
      };
    if (diffHours > 1)
      return {
        text: `${diffHours}h`,
        color: "bg-linear-to-r from-teal-500 to-teal-600",
        urgency: "low",
      };
    if (diffHours > 0)
      return {
        text: `${diffHours}h ${diffMinutes}m`,
        color: "bg-linear-to-r from-amber-500 to-amber-600",
        urgency: "medium",
      };
    return {
      text: `${diffMinutes}m`,
      color: "bg-linear-to-r from-rose-500 to-rose-600",
      urgency: "high",
    };
  };

  const getEfficiencyScore = (pickup: DriverPickup) => {
    if (!pickup.actualDuration || !pickup.estimatedDuration) return null;
    const efficiency = (pickup.estimatedDuration / pickup.actualDuration) * 100;
    const score = Math.min(100, Math.max(0, efficiency));

    return (
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={
              score >= 90 ? "#10b981" : score >= 70 ? "#3b82f6" : "#f43f5e"
            }
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${score}, 100`}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {Math.round(score)}
        </span>
      </div>
    );
  };

  if (loading && pickups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-blue-500 rounded-full animate-spin-slow"></div>
          <Truck className="absolute inset-0 m-auto w-10 h-10 text-white animate-bounce-slow" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Loading Your Pickups
          </h3>
          <p className="text-gray-500 mt-2">
            Fetching your pickup schedule and details...
          </p>
        </div>
      </div>
    );
  }

  const totalEarnings = pickups
    .filter((p) => p.status === "completed")
    .reduce((acc, p) => acc + p.price, 0);
  const todayEarnings = pickups
    .filter(
      (p) =>
        p.status === "completed" &&
        new Date(p.completedAt || "").toDateString() === today,
    )
    .reduce((acc, p) => acc + p.price, 0);
  const activePickups = pickups.filter(
    (p) => p.status === "in_progress",
  ).length;
  const completionRate =
    pickups.length > 0
      ? (
          (pickups.filter((p) => p.status === "completed").length /
            pickups.length) *
          100
        ).toFixed(1)
      : "0";

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
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    My Pickups
                  </h1>
                  <p className="text-gray-600">
                    Manage your assigned pickup jobs and track your progress
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                // variant="linear"
                // linear="teal-blue"
                onClick={() => (window.location.href = "/driver/available")}
                className="group relative overflow-hidden"
              >
                <Package className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Find New Pickups
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                onClick={fetchDriverPickups}
                className="group"
              >
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Earnings",
            value: `$${totalEarnings.toLocaleString()}`,
            change: "+18.3%",
            icon: <DollarSign className="w-6 h-6" />,
            color: "from-teal-500 to-teal-600",
            metric: "All time",
          },
          {
            label: "Today's Earnings",
            value: `$${todayEarnings.toLocaleString()}`,
            change: "+12.5%",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            metric: "So far today",
          },
          {
            label: "Active Pickups",
            value: activePickups,
            change: "+8.7%",
            icon: <Navigation className="w-6 h-6" />,
            color: "from-rose-500 to-rose-600",
            metric: "In progress now",
          },
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: "+5.2%",
            icon: <Award className="w-6 h-6" />,
            color: "from-indigo-500 to-indigo-600",
            metric: "Success rate",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden"
          >
            <div className="relative">
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-linear-to-br ${stat.color} opacity-10 group-hover:scale-125 transition-transform duration-500`}
              ></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        stat.change.startsWith("+")
                          ? "text-teal-600 bg-teal-50"
                          : "text-rose-600 bg-rose-50"
                      }`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 inline mr-1 ${stat.change.startsWith("+") ? "" : "rotate-180"}`}
                      />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.metric}</p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-linear-to-br ${stat.color} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs & Filters */}
      <Card className="overflow-hidden">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Pickups", count: pickups.length },
                {
                  id: "today",
                  label: "Today's",
                  count: pickups.filter(
                    (p) => new Date(p.pickupTime).toDateString() === today,
                  ).length,
                },
                {
                  id: "active",
                  label: "Active",
                  count: pickups.filter(
                    (p) =>
                      p.status === "scheduled" || p.status === "in_progress",
                  ).length,
                },
                {
                  id: "upcoming",
                  label: "Upcoming",
                  icon: <Clock className="w-3 h-3" />,
                  count: pickups.filter(
                    (p) =>
                      new Date(p.pickupTime) > new Date() &&
                      new Date(p.pickupTime) <=
                        new Date(new Date().setDate(new Date().getDate() + 1)),
                  ).length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-white/20" : "bg-gray-100"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.icon && <span>{tab.icon}</span>}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* View Toggle & Quick Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-teal-50 text-teal-600" : "text-gray-600"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-teal-50 text-teal-600" : "text-gray-600"}`}
                >
                  List
                </button>
              </div>
              {activePickups > 0 && (
                <Button
                //   variant="linear"
                //   linear="blue-indigo"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="group relative overflow-hidden"
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                  Quick Actions
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                </Button>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search by address or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
              <Input
                type="date"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <Card className="border-2 border-teal-500 shadow-lg animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">
                  Quickly manage your active pickups
                </p>
              </div>
            </div>
            <Button
            //   variant="ghost"
              size="sm"
              onClick={() => setShowQuickActions(false)}
            >
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pickups
              .filter(
                (p) => p.status === "in_progress" || p.status === "scheduled",
              )
              .slice(0, 3)
              .map((pickup) => (
                <div
                  key={pickup.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-lg ${getWasteTypeIcon(pickup.wasteType).bg} flex items-center justify-center mr-3`}
                    >
                      {getWasteTypeIcon(pickup.wasteType).icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium truncate max-w-30">
                        {pickup.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pickup.address.split(",")[0]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {pickup.status === "scheduled" && (
                      <Button
                        size="sm"
                        // variant="linear"
                        // linear="teal-blue"
                        onClick={() => handleQuickAction(pickup.id, "start")}
                        className="group"
                      >
                        <PlayCircle className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      </Button>
                    )}
                    {pickup.status === "in_progress" && (
                      <Button
                        size="sm"
                        // variant="linear"
                        // linear="blue-indigo"
                        onClick={() => handleQuickAction(pickup.id, "complete")}
                        className="group"
                      >
                        <StopCircle className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Pickups Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPickups.map((pickup) => {
            const wasteType = getWasteTypeIcon(pickup.wasteType);
            const timeRemaining = getTimeRemaining(pickup.pickupTime);

            return (
              <Card
                key={pickup.id}
                className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
              >
                {/* Status & Time Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(pickup.status)}
                    {pickup.status === "scheduled" && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${timeRemaining.color}`}
                      >
                        {timeRemaining.text}
                      </span>
                    )}
                  </div>
                  {pickup.status === "completed" && getEfficiencyScore(pickup)}
                </div>

                {/* Waste Type & Customer */}
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${wasteType?.bg} flex items-center justify-center mr-3`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${wasteType?.color} flex items-center justify-center text-white`}
                    >
                      {wasteType?.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                      {pickup.userName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {pickup.wasteType} Waste
                    </p>
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <MapPin className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-600 truncate">
                      {pickup.address}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                      <Calendar className="w-3 h-3 text-teal-600" />
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {new Date(pickup.pickupTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {pickup.distance && (
                        <span className="text-gray-500 ml-2">
                          • {pickup.distance.toFixed(1)} mi
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mr-3">
                      <Package className="w-3 h-3 text-rose-600" />
                    </div>
                    <span className="text-gray-600">{pickup.quantity}</span>
                  </div>
                </div>

                {/* Earnings & Actions */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${pickup.price}
                      </div>
                      <div className="text-xs text-gray-500">Earnings</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        // variant="ghost"
                        onClick={() => setSelectedPickup(pickup)}
                        className="group"
                      >
                        <Eye className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      </Button>
                      {pickup.status === "scheduled" && (
                        <Button
                          size="sm"
                        //   variant="linear"
                        //   linear="teal-blue"
                          onClick={() => handleStatusUpdate(pickup.id, "start")}
                          className="group relative overflow-hidden"
                        >
                          <PlayCircle className="w-3 h-3 mr-1" />
                          Start
                          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                        </Button>
                      )}
                      {pickup.status === "in_progress" && (
                        <Button
                          size="sm"
                        //   variant="linear"
                        //   linear="blue-indigo"
                          onClick={() =>
                            handleStatusUpdate(pickup.id, "complete")
                          }
                          className="group relative overflow-hidden"
                        >
                          <StopCircle className="w-3 h-3 mr-1" />
                          Complete
                          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredPickups.length > 0 ? (
            filteredPickups.map((pickup) => {
              const wasteType = getWasteTypeIcon(pickup.wasteType);
              const timeRemaining = getTimeRemaining(pickup.pickupTime);

              return (
                <Card
                  key={pickup.id}
                  className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${wasteType?.bg} flex items-center justify-center mr-4`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${wasteType?.color} flex items-center justify-center text-white`}
                          >
                            {wasteType?.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                                {pickup.userName}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {pickup.wasteType} Waste • {pickup.quantity}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(pickup.status)}
                              {pickup.status === "scheduled" && (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${timeRemaining.color}`}
                                >
                                  {timeRemaining.text}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center text-sm">
                              <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center mr-2">
                                <MapPin className="w-3 h-3 text-blue-600" />
                              </div>
                              <span className="text-gray-600 truncate">
                                {pickup.address}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center mr-2">
                                <Calendar className="w-3 h-3 text-teal-600" />
                              </div>
                              <span className="text-gray-600">
                                {new Date(pickup.pickupTime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-6 h-6 rounded bg-rose-50 flex items-center justify-center mr-2">
                                <Timer className="w-3 h-3 text-rose-600" />
                              </div>
                              <span className="text-gray-600">
                                {pickup.estimatedDuration} min
                                {pickup.distance
                                  ? ` • ${pickup.distance.toFixed(1)} mi`
                                  : ""}
                              </span>
                            </div>
                          </div>

                          {/* Special Instructions */}
                          {pickup.specialInstructions && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 italic">
                                <AlertCircle className="w-3 h-3 inline mr-1 text-amber-500" />
                                {pickup.specialInstructions}
                              </p>
                            </div>
                          )}

                          {/* Rating */}
                          {pickup.status === "completed" && pickup.rating && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
                              <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(pickup.rating!) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                  >
                                    ★
                                  </div>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({pickup.rating.toFixed(1)})
                                </span>
                              </div>
                              {getEfficiencyScore(pickup)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions & Price */}
                    <div className="lg:w-56 space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${pickup.price}
                        </div>
                        <div className="text-sm text-gray-500">Earnings</div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                        //   variant="ghost"
                          size="sm"
                          className="w-full group"
                          onClick={() => setSelectedPickup(pickup)}
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                          View Details
                        </Button>

                        {pickup.status === "scheduled" && (
                          <Button
                            // variant="linear"
                            // linear="teal-blue"
                            size="sm"
                            className="w-full group relative overflow-hidden"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "start")
                            }
                          >
                            <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                            Start Pickup
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                          </Button>
                        )}

                        {pickup.status === "in_progress" && (
                          <Button
                            // variant="linear"
                            // linear="blue-indigo"
                            size="sm"
                            className="w-full group relative overflow-hidden"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "complete")
                            }
                          >
                            <StopCircle className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                            Complete Pickup
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                          </Button>
                        )}

                        {(pickup.status === "scheduled" ||
                          pickup.status === "in_progress") && (
                          <Button
                            // variant="linear"
                            // linear="rose-rose"
                            size="sm"
                            className="w-full group relative overflow-hidden"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to cancel this pickup?",
                                )
                              ) {
                                handleStatusUpdate(pickup.id, "cancel");
                              }
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                            Cancel Pickup
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
                  <Package className="relative w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No pickups found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || statusFilter !== "all" || dateFilter
                    ? "Try adjusting your filters or search criteria"
                    : "You don't have any pickups assigned yet. Find new pickups to get started!"}
                </p>
                <Button
                //   variant="linear"
                //   linear="teal-blue"
                  onClick={() => (window.location.href = "/driver/available")}
                  className="group"
                >
                  <Package className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Find Available Pickups
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Quick Actions Floating Button */}
      {activePickups > 0 && !showQuickActions && (
        <button
          onClick={() => setShowQuickActions(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-bounce-slow z-50 group"
        >
          <Zap className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
        </button>
      )}
    </div>
  );
};

export default DriverPickupsPage;
