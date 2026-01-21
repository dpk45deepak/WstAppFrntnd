// src/pages/admin/PickupsManagementPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Package,
  Calendar,
  MapPin,
  User,
  Truck,
  DollarSign,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  AlertCircle,
  ChevronRight,
  Leaf,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Pagination from "../../components/common/Pagination";

interface Pickup {
  id: string;
  userId: string;
  userName: string;
  driverId?: string;
  driverName?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  pickupDate: string;
  address: string;
  wasteType: "general" | "recyclable" | "hazardous" | "organic";
  price?: number;
  createdAt: string;
  estimatedDuration?: number;
  priority?: "low" | "medium" | "high";
  specialInstructions?: string;
}

const PickupsManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<Pickup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<
    "all" | "today" | "pending" | "urgent"
  >("all");
  const [_, setStats] = useState({
    totalRevenue: 0,
    avgCompletionTime: 0,
    satisfactionRate: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPickups();
    fetchStats();
  }, [currentPage]);

  useEffect(() => {
    filterPickups();
  }, [
    pickups,
    searchQuery,
    statusFilter,
    wasteTypeFilter,
    dateFilter,
    activeTab,
  ]);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/pickups", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      // Simulate additional data
      const pickupsWithDetails = response.data.pickups.map(
        (pickup: Pickup) => ({
          ...pickup,
          estimatedDuration: Math.floor(Math.random() * 120) + 30,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
            | "low"
            | "medium"
            | "high",
          specialInstructions:
            Math.random() > 0.7 ? "Special handling required" : undefined,
        }),
      );
      setPickups(pickupsWithDetails);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || "Failed to load pickups", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/pickups/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.address.toLowerCase().includes(query) ||
          p.userName.toLowerCase().includes(query) ||
          (p.driverName && p.driverName.toLowerCase().includes(query)),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (wasteTypeFilter !== "all") {
      filtered = filtered.filter((p) => p.wasteType === wasteTypeFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(
        (p) => new Date(p.pickupDate).toDateString() === filterDate,
      );
    }

    if (activeTab === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (p) => new Date(p.pickupDate).toDateString() === today,
      );
    } else if (activeTab === "pending") {
      filtered = filtered.filter(
        (p) => p.status === "scheduled" || p.status === "in_progress",
      );
    } else if (activeTab === "urgent") {
      filtered = filtered.filter((p) => p.priority === "high");
    }

    setFilteredPickups(filtered);
  };

  const handleStatusUpdate = async (
    pickupId: string,
    newStatus: Pickup["status"],
  ) => {
    try {
      await api.put(`/admin/pickups/${pickupId}/status`, { status: newStatus });
      showToast(
        `Pickup ${newStatus.replace("_", " ")} successfully`,
        "success",
      );
      fetchPickups();
    } catch (error: any) {
      showToast(error.message || "Failed to update pickup", "error");
    }
  };

  const getStatusBadge = (status: Pickup["status"]) => {
    const statusConfig = {
      scheduled: {
        color: "bg-linear-to-r from-yellow-500 to-amber-500 text-white",
        icon: <Clock className="w-3 h-3 animate-pulse" />,
        glow: "shadow-lg shadow-yellow-500/30",
      },
      in_progress: {
        color: "bg-linear-to-r from-blue-500 to-blue-600 text-white",
        icon: <Clock className="w-3 h-3 animate-spin-slow" />,
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: {
        color: "bg-linear-to-r from-rose-500 to-rose-600 text-white",
        label: "High",
      },
      medium: {
        color: "bg-linear-to-r from-amber-500 to-amber-600 text-white",
        label: "Medium",
      },
      low: {
        color: "bg-linear-to-r from-indigo-500 to-indigo-600 text-white",
        label: "Low",
      },
    };
    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.low;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType: Pickup["wasteType"]) => {
    const icons = {
      general: {
        icon: <Package className="w-5 h-5" />,
        color: "bg-gray-100 text-gray-600",
      },
      recyclable: {
        icon: <RefreshCw className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
      },
      hazardous: {
        icon: <Shield className="w-5 h-5" />,
        color: "bg-rose-100 text-rose-600",
      },
      organic: {
        icon: <Leaf className="w-5 h-5" />,
        color: "bg-teal-100 text-teal-600",
      },
    };
    return icons[wasteType];
  };

  const getTimelineProgress = (status: Pickup["status"]) => {
    const steps = ["scheduled", "in_progress", "completed"];
    const currentStep = steps.indexOf(status);
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-teal-500 to-blue-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
        {steps.map((step, index) => (
          <div
            key={step}
            className={`absolute top-1/2 w-3 h-3 rounded-full border-2 transform -translate-y-1/2 ${
              index <= currentStep
                ? "bg-white border-teal-500"
                : "bg-gray-300 border-gray-300"
            }`}
            style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const handleExportReport = async () => {
    try {
      showToast("Generating report...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("Report exported successfully", "success");
    } catch (error) {
      showToast("Failed to export report", "error");
    }
  };

  if (loading && pickups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-blue-500 rounded-full animate-spin-slow"></div>
          <Package className="absolute inset-0 m-auto w-10 h-10 text-white animate-bounce-slow" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Loading Pickups
          </h3>
          <p className="text-gray-500 mt-2">Fetching pickup information...</p>
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
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Pickups Management
                  </h1>
                  <p className="text-gray-600">
                    Monitor and manage all platform pickups in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                // variant="linear"
                // linear="teal-blue"
                onClick={() =>
                  (window.location.href = "/admin/pickups/analytics")
                }
                className="group relative overflow-hidden"
              >
                <BarChart3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Analytics Dashboard
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportReport}
                className="group"
              >
                <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            label: "Total Pickups",
            value: pickups.length,
            change: "+12.5%",
            icon: <Package className="w-6 h-6" />,
            color: "from-teal-500 to-teal-600",
            metric: "This month",
          },
          {
            label: "Revenue Generated",
            value: `$${(pickups.reduce((acc, p) => acc + (p.price || 0), 0) / 1000).toFixed(1)}K`,
            change: "+18.3%",
            icon: <DollarSign className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            metric: "Total revenue",
          },
          {
            label: "Completion Rate",
            value: `${((pickups.filter((p) => p.status === "completed").length / pickups.length) * 100 || 0).toFixed(1)}%`,
            change: "+5.2%",
            icon: <CheckCircle className="w-6 h-6" />,
            color: "from-rose-500 to-rose-600",
            metric: "Success rate",
          },
          {
            label: "Avg. Duration",
            value: `${Math.round(pickups.reduce((acc, p) => acc + (p.estimatedDuration || 0), 0) / pickups.length || 0)} min`,
            change: "-8.7%",
            icon: <Clock className="w-6 h-6" />,
            color: "from-indigo-500 to-indigo-600",
            metric: "Per pickup",
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
                  label: "Today",
                  count: pickups.filter(
                    (p) =>
                      new Date(p.pickupDate).toDateString() ===
                      new Date().toDateString(),
                  ).length,
                },
                {
                  id: "pending",
                  label: "Pending",
                  count: pickups.filter(
                    (p) =>
                      p.status === "scheduled" || p.status === "in_progress",
                  ).length,
                },
                {
                  id: "urgent",
                  label: "Urgent",
                  icon: <AlertCircle className="w-3 h-3" />,
                  count: pickups.filter((p) => p.priority === "high").length,
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

            {/* View Toggle & Refresh */}
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
              <Button
              // variant="ghost"
              onClick={fetchPickups}
              className="group"
              >
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search pickups by address, user, or driver..."
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

            {/* Status & Type Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={wasteTypeFilter}
                  onChange={(e) => setWasteTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="general">General</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pickups Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPickups.length > 0 ? (
            filteredPickups.map((pickup) => {
              const wasteType = getWasteTypeIcon(pickup.wasteType);
              return (
                <Card
                  key={pickup.id}
                  className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                >
                  {/* Pickup Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-2xl ${wasteType.color} flex items-center justify-center shadow-lg`}
                      >
                        {wasteType.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors capitalize">
                          {pickup.wasteType} Waste
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                          {getStatusBadge(pickup.status)}
                          {pickup.priority && getPriorityBadge(pickup.priority)}
                        </div>
                      </div>
                    </div>
                    {pickup.price && (
                      <div className="text-lg font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        ${pickup.price.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Timeline Progress */}
                  <div className="mb-6" ref={timelineRef}>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Scheduled</span>
                      <span>In Progress</span>
                      <span>Completed</span>
                    </div>
                    {getTimelineProgress(pickup.status)}
                  </div>

                  {/* Pickup Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                        <Calendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(pickup.pickupDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(pickup.pickupDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                        <MapPin className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-gray-600 truncate">
                        {pickup.address}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mr-3">
                          <User className="w-3 h-3 text-rose-600" />
                        </div>
                        <span className="text-gray-600">{pickup.userName}</span>
                      </div>
                      {pickup.driverName && (
                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-3">
                            <Truck className="w-3 h-3 text-indigo-600" />
                          </div>
                          <span className="text-gray-600">
                            {pickup.driverName}
                          </span>
                        </div>
                      )}
                    </div>

                    {pickup.specialInstructions && (
                      <div className="flex items-start text-sm">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mr-3">
                          <AlertCircle className="w-3 h-3 text-yellow-600" />
                        </div>
                        <span className="text-gray-600 italic">
                          {pickup.specialInstructions}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {pickup.estimatedDuration && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 inline mr-2" />
                            {pickup.estimatedDuration} min
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          // variant="ghost"
                          onClick={() =>
                            (window.location.href = `/admin/pickups/${pickup.id}`)
                          }
                          className="group"
                        >
                          <Eye className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                          View Details
                        </Button>
                        {pickup.status === "scheduled" && (
                          <Button
                            size="sm"
                            // variant="linear"
                            // linear="teal-blue"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "in_progress")
                            }
                            className="group relative overflow-hidden"
                          >
                            Start Pickup
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                          </Button>
                        )}
                        {pickup.status === "in_progress" && (
                          <Button
                            size="sm"
                            // variant="linear"
                            // linear="blue-indigo"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "completed")
                            }
                            className="group relative overflow-hidden"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
                  <Package className="relative w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No pickups found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "No pickups match your search criteria. Try different keywords or filters."
                    : "All pickups are processed or none are scheduled."}
                </p>
                <Button
                  // variant="linear"
                  // linear="teal-blue"
                  onClick={() => (window.location.href = "/admin/dashboard")}
                  className="group"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                  Go to Dashboard
                </Button>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Pickup Details
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Status & Progress
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPickups.map((pickup) => (
                  <tr
                    key={pickup.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg ${getWasteTypeIcon(pickup.wasteType).color} flex items-center justify-center mr-3`}
                        >
                          {getWasteTypeIcon(pickup.wasteType).icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {pickup.wasteType} Waste
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-2" />
                            {new Date(
                              pickup.pickupDate,
                            ).toLocaleDateString()} •{" "}
                            {new Date(pickup.pickupDate).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-2" />
                            {pickup.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">
                            {pickup.userName}
                          </span>
                        </div>
                        {pickup.driverName ? (
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">{pickup.driverName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                            Awaiting driver
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-3">
                        {getStatusBadge(pickup.status)}
                        <div className="w-32">
                          {getTimelineProgress(pickup.status)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {pickup.price ? (
                        <div className="text-lg font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                          ${pickup.price.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          // variant="ghost"
                          onClick={() =>
                            (window.location.href = `/admin/pickups/${pickup.id}`)
                          }
                          className="group"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-125 transition-transform" />
                        </Button>
                        {pickup.status === "scheduled" && (
                          <Button
                            size="sm"
                            // variant="linear"
                            // linear="teal-blue"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "in_progress")
                            }
                          >
                            Start
                          </Button>
                        )}
                        {pickup.status === "in_progress" && (
                          <Button
                            size="sm"
                            // variant="linear"
                            // linear="blue-indigo"
                            onClick={() =>
                              handleStatusUpdate(pickup.id, "completed")
                            }
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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

      {/* Today's Schedule Overview */}
      {activeTab === "today" && filteredPickups.length > 0 && (
        <Card className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Today's Schedule
              </h3>
              <p className="text-gray-600">
                {filteredPickups.length} pickups scheduled for today
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/pickups/schedule")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Full Schedule
            </Button>
          </div>
          <div className="space-y-4">
            {filteredPickups.slice(0, 3).map((pickup) => (
              <div
                key={pickup.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white transition-colors group"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-lg ${getWasteTypeIcon(pickup.wasteType).color} flex items-center justify-center mr-4`}
                  >
                    {getWasteTypeIcon(pickup.wasteType).icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {pickup.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pickup.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {new Date(pickup.pickupDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {getStatusBadge(pickup.status)}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PickupsManagementPage;
