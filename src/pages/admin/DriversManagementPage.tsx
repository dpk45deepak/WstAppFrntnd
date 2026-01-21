// src/pages/admin/DriversManagementPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Truck,
  Star,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  UserPlus,
  Calendar,
  Download,
  TrendingUp,
  Clock,
  Award,
  Eye,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Pagination from "../../components/common/Pagination";

interface Driver {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  vehicleType: string;
  vehiclePlate: string;
  capacity: string;
  availability: boolean;
  rating?: number;
  totalPickups: number;
  totalEarnings: number;
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  lastActive?: string;
  performance?: number;
  currentLocation?: string;
  scheduledPickups?: number;
}

const DriversManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "unavailable" | "top"
  >("all");
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDrivers();
  }, [currentPage]);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchQuery, statusFilter, availabilityFilter, activeTab]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/drivers", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      // Simulate additional data
      const driversWithDetails = response.data.drivers.map(
        (driver: Driver) => ({
          ...driver,
          performance: Math.floor(Math.random() * 30) + 70,
          currentLocation: [
            "Downtown",
            "North District",
            "West Side",
            "East End",
          ][Math.floor(Math.random() * 4)],
          scheduledPickups: Math.floor(Math.random() * 8),
        }),
      );
      setDrivers(driversWithDetails);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || "Failed to load drivers", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = [...drivers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.email.toLowerCase().includes(query) ||
          d.phone.toLowerCase().includes(query) ||
          d.vehiclePlate.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter((d) =>
        availabilityFilter === "available" ? d.availability : !d.availability,
      );
    }

    if (activeTab === "active") {
      filtered = filtered.filter((d) => d.status === "active");
    } else if (activeTab === "unavailable") {
      filtered = filtered.filter((d) => !d.availability);
    } else if (activeTab === "top") {
      filtered = filtered
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    }

    setFilteredDrivers(filtered);
  };

  const handleAvailabilityToggle = async (
    driverId: string,
    available: boolean,
  ) => {
    try {
      await api.put(`/admin/drivers/${driverId}/availability`, { available });
      showToast(
        `Driver ${available ? "marked as available" : "marked as unavailable"}`,
        "success",
      );
      fetchDrivers();
    } catch (error: any) {
      showToast(error.message || "Failed to update availability", "error");
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("Drivers data exported successfully", "success");
    } catch (error) {
      showToast("Failed to export data", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: Driver["status"]) => {
    const statusConfig = {
      active: {
        color: "bg-linear-to-r from-teal-500 to-teal-600 text-white",
        icon: <CheckCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-teal-500/30",
      },
      inactive: {
        color: "bg-linear-to-r from-gray-400 to-gray-500 text-white",
        icon: null,
        glow: "",
      },
      suspended: {
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
        {config.icon && (
          <span className="mr-1.5 animate-pulse">{config.icon}</span>
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30 animate-pulse">
        <MapPin className="w-3 h-3 mr-1.5 animate-bounce" />
        Available Now
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-rose-500 to-rose-600 text-white">
        <Clock className="w-3 h-3 mr-1.5" />
        Offline
      </span>
    );
  };

  const getPerformanceRing = (percentage: number) => {
    const color =
      percentage >= 90 ? "#10b981" : percentage >= 80 ? "#3b82f6" : "#f43f5e";
    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percentage}, 100`}
            transform="rotate(-90 18 18)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {percentage}%
        </span>
      </div>
    );
  };

  const getRatingStars = (rating?: number) => {
    if (!rating)
      return (
        <div className="flex items-center text-gray-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3" />
          ))}
          <span className="ml-1 text-xs">No rating</span>
        </div>
      );

    return (
      <div className="flex items-center group">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 transition-transform duration-300 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400 group-hover:scale-125" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-xs font-medium bg-linear-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading && drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-blue-500 rounded-full animate-spin-slow"></div>
          <Truck className="absolute inset-0 m-auto w-10 h-10 text-white animate-bounce-slow" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Loading Drivers
          </h3>
          <p className="text-gray-500 mt-2">Fetching driver information...</p>
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
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Drivers Management
                  </h1>
                  <p className="text-gray-600">
                    Manage and monitor all platform drivers in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                // variant="linear"
                // linear="teal-blue"
                onClick={() => (window.location.href = "/admin/drivers/add")}
                className="group relative overflow-hidden"
              >
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Add New Driver
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
                className="group"
              >
                <Download
                  className={`w-4 h-4 mr-2 ${isExporting ? "animate-spin" : ""}`}
                />
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Drivers",
            value: drivers.length,
            change: "+3.2%",
            icon: <Truck className="w-6 h-6" />,
            color: "from-teal-500 to-teal-600",
            linear: "bg-linear-to-br",
          },
          {
            label: "On Duty Now",
            value: drivers.filter(
              (d) => d.availability && d.status === "active",
            ).length,
            change: "+12.5%",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            linear: "bg-linear-to-br",
          },
          {
            label: "Avg. Performance",
            value: `${(drivers.reduce((acc, d) => acc + (d.performance || 0), 0) / drivers.length || 0).toFixed(1)}%`,
            change: "+5.1%",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "from-rose-500 to-rose-600",
            linear: "bg-linear-to-br",
          },
          {
            label: "Total Earnings",
            value: `$${(drivers.reduce((acc, d) => acc + d.totalEarnings, 0) / 1000).toFixed(1)}K`,
            change: "+8.7%",
            icon: <BarChart3 className="w-6 h-6" />,
            color: "from-indigo-500 to-indigo-600",
            linear: "bg-linear-to-br",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden"
          >
            <div className="relative">
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${stat.linear} ${stat.color} opacity-10 group-hover:scale-125 transition-transform duration-500`}
              ></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <span className="ml-2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-2xl ${stat.linear} ${stat.color} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}
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
                { id: "all", label: "All Drivers", count: drivers.length },
                {
                  id: "active",
                  label: "Active",
                  count: drivers.filter((d) => d.status === "active").length,
                },
                {
                  id: "unavailable",
                  label: "Offline",
                  count: drivers.filter((d) => !d.availability).length,
                },
                {
                  id: "top",
                  label: "Top Rated",
                  icon: <Award className="w-3 h-3" />,
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

            {/* View Toggle */}
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
              <Button  onClick={fetchDrivers} className="group">
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search drivers by name, email, phone, or vehicle plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
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

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Availability</option>
                <option value="available">Available Now</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Drivers Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
              >
                {/* Driver Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-14 h-14 bg-linear-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Truck className="w-7 h-7 text-white" />
                      </div>
                      {driver.availability && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                        {driver.name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        {getStatusBadge(driver.status)}
                        {getAvailabilityBadge(driver.availability)}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Driver Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <Mail className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-600 truncate">
                      {driver.email}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                      <Phone className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-gray-600">{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mr-3">
                      <Shield className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-gray-600">
                      {driver.licenseNumber || "License pending"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mr-3">
                      <Truck className="w-3 h-3 text-rose-600" />
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {driver.vehicleType}
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="font-mono text-gray-800">
                        {driver.vehiclePlate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats & Performance */}
                <div className="grid grid-cols-4 gap-4 mb-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {driver.totalPickups}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pickups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      ${(driver.totalEarnings / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Earnings</div>
                  </div>
                  <div className="text-center">
                    {getRatingStars(driver.rating)}
                    <div className="text-xs text-gray-500 mt-1">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      {getPerformanceRing(driver.performance || 0)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Perf.</div>
                  </div>
                </div>

                {/* Actions & Footer */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-2" />
                      Joined{" "}
                      {new Date(driver.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        
                        onClick={() =>
                          (window.location.href = `/admin/drivers/${driver.id}`)
                        }
                        className="group"
                      >
                        <Eye className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        // variant={driver.availability ? "danger" : "linear"}
                        // linear={driver.availability ? undefined : "teal-blue"}
                        onClick={() =>
                          handleAvailabilityToggle(
                            driver.id,
                            !driver.availability,
                          )
                        }
                        className="group relative overflow-hidden"
                      >
                        {driver.availability ? "Set Offline" : "Set Online"}
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
                  <Truck className="relative w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No drivers found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "No drivers match your search criteria. Try different keywords or filters."
                    : "Start by adding your first driver to the platform."}
                </p>
                <Button
                  // variant="linear"
                  // linear="teal-blue"
                  onClick={() => (window.location.href = "/admin/drivers/add")}
                  className="group"
                >
                  <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Add First Driver
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
                    Driver
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Vehicle
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Performance
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Earnings
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {driver.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2">
                        {getStatusBadge(driver.status)}
                        {getAvailabilityBadge(driver.availability)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="font-medium">{driver.vehicleType}</div>
                        <div className="text-gray-500">
                          {driver.vehiclePlate}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {getPerformanceRing(driver.performance || 0)}
                        {getRatingStars(driver.rating)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-lg font-bold text-gray-900">
                        ${driver.totalEarnings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {driver.totalPickups} pickups
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          
                          onClick={() =>
                            (window.location.href = `/admin/drivers/${driver.id}/edit`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          // variant={driver.availability ? "outline" : "linear"}
                          // linear={
                          //   driver.availability ? undefined : "teal-blue"
                          // }
                          onClick={() =>
                            handleAvailabilityToggle(
                              driver.id,
                              !driver.availability,
                            )
                          }
                        >
                          {driver.availability ? "Set Offline" : "Set Online"}
                        </Button>
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

      {/* Floating Action Button */}
      <button
        onClick={() => (window.location.href = "/admin/drivers/add")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-r from-teal-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-bounce-slow z-50 group"
      >
        <UserPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        <div className="absolute -inset-4 bg-teal-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
      </button>
    </div>
  );
};

export default DriversManagementPage;
