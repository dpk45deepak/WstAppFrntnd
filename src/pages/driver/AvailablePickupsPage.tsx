// src/pages/driver/AvailablePickupsPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  User,
  Package,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Leaf,
  Shield,
  Target,
  Compass,
  RefreshCw,

} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import pickupService from "../../services/pickup";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Pagination from "../../components/common/Pagination";

interface AvailablePickup {
  id: string;
  userId: string;
  userName: string;
  address: string;
  city: string;
  distance: number;
  pickupTime: string;
  wasteType: "general" | "recyclable" | "hazardous" | "organic";
  quantity: string;
  estimatedDuration: number;
  price: number;
  priority: "low" | "medium" | "high";
  specialInstructions?: string;
  createdAt: string;
  estimatedEarnings?: number;
  customerRating?: number;
  totalPickups?: number;
}

const AvailablePickupsPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState<AvailablePickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<AvailablePickup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("all");
  const [distanceFilter, setDistanceFilter] = useState<number>(10);
  const [sortBy, setSortBy] = useState<"distance" | "price" | "time">(
    "distance",
  );
  const [selectedPickup, setSelectedPickup] = useState<AvailablePickup | null>(
    null,
  );
  const [acceptingPickup, setAcceptingPickup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "nearby" | "highValue" | "quick"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState({
    totalAvailable: 0,
    avgEarnings: 0,
    bestRouteEfficiency: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailablePickups();
    calculateStats();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortPickups();
  }, [
    pickups,
    searchQuery,
    wasteTypeFilter,
    distanceFilter,
    sortBy,
    activeTab,
  ]);

  const fetchAvailablePickups = async () => {
    setLoading(true);
    try {
      const response: any = await pickupService.getAllPickups({
        status: "pending",
      });
      // Simulate additional data
      const enhancedPickups = (response.data || []).map(
        (pickup: AvailablePickup) => ({
          ...pickup,
          estimatedEarnings: pickup.price + Math.random() * 20,
          customerRating: 3 + Math.random() * 2,
          totalPickups: Math.floor(Math.random() * 50),
        }),
      );
      setPickups(enhancedPickups);
      setTotalPages(Math.ceil(enhancedPickups.length / itemsPerPage));
    } catch (error: any) {
      showToast(error.message || "Failed to load available pickups", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (pickups.length > 0) {
      const avgEarnings =
        pickups.reduce((acc, p) => acc + p.price, 0) / pickups.length;
      const bestRoute =
        pickups.slice(0, 3).reduce((acc, p) => acc + p.distance, 0) / 3;
      setStats({
        totalAvailable: pickups.length,
        avgEarnings,
        bestRouteEfficiency: 100 - bestRoute * 5,
      });
    }
  };

  const filterAndSortPickups = () => {
    let filtered = [...pickups];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.userName.toLowerCase().includes(query),
      );
    }

    // Waste type filter
    if (wasteTypeFilter !== "all") {
      filtered = filtered.filter((p) => p.wasteType === wasteTypeFilter);
    }

    // Distance filter
    filtered = filtered.filter((p) => p.distance <= distanceFilter);

    // Active tab filters
    if (activeTab === "nearby") {
      filtered = filtered.filter((p) => p.distance <= 5);
    } else if (activeTab === "highValue") {
      filtered = filtered.filter((p) => p.price >= 50);
    } else if (activeTab === "quick") {
      filtered = filtered.filter((p) => p.estimatedDuration <= 30);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "price":
          return b.price - a.price;
        case "time":
          return (
            new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredPickups(
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    );
  };

  const handleAcceptPickup = async (pickupId: string) => {
    setAcceptingPickup(pickupId);
    try {
      if (!user) throw new Error("Not authenticated");
      await pickupService.assignDriver(pickupId, user.id);
      showToast("🚚 Pickup accepted successfully!", "success");
      fetchAvailablePickups();
      setSelectedPickup(null);
    } catch (error: any) {
      showToast(error.message || "Failed to accept pickup", "error");
    } finally {
      setAcceptingPickup(null);
    }
  };

  const getPriorityBadge = (priority: AvailablePickup["priority"]) => {
    const config = {
      low: {
        color: "bg-linear-to-r from-teal-500 to-teal-600 text-white",
        icon: <CheckCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-teal-500/30",
      },
      medium: {
        color: "bg-linear-to-r from-amber-500 to-amber-600 text-white",
        icon: <AlertCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-amber-500/30",
      },
      high: {
        color: "bg-linear-to-r from-rose-500 to-rose-600 text-white",
        icon: <AlertCircle className="w-3 h-3 animate-pulse" />,
        glow: "shadow-lg shadow-rose-500/30",
      },
    };
    const { color, icon, glow } = config[priority];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color} ${glow} transition-all duration-300 hover:scale-105`}
      >
        <span className="mr-1.5">{icon}</span>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType: AvailablePickup["wasteType"]) => {
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

  const getDistanceRing = (distance: number) => {
    const percentage = Math.min(100, (distance / 50) * 100);
    const color =
      distance <= 5 ? "#10b981" : distance <= 15 ? "#3b82f6" : "#f43f5e";

    return (
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percentage}, 100`}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {distance.toFixed(0)}
        </span>
      </div>
    );
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
            Finding Available Pickups
          </h3>
          <p className="text-gray-500 mt-2">
            Scanning your area for pickup opportunities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Animated Background */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-blue-50 to-teal-50 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-r from-teal-500 to-blue-500 rounded-2xl shadow-lg">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Available Pickups
                  </h1>
                  <p className="text-gray-600">
                    Find and accept new pickup jobs in your area
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                // variant="linear"
                // linear="teal-blue"
                onClick={fetchAvailablePickups}
                className="group relative overflow-hidden"
              >
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh Map
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/driver/map")}
                className="group"
              >
                <Navigation className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                View Live Map
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Available Now",
            value: stats.totalAvailable,
            change: "+12.5%",
            icon: <Package className="w-6 h-6" />,
            color: "from-teal-500 to-teal-600",
            metric: "In your area",
          },
          {
            label: "Avg. Earnings",
            value: `$${stats.avgEarnings.toFixed(2)}`,
            change: "+8.3%",
            icon: <DollarSign className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            metric: "Per pickup",
          },
          {
            label: "Route Efficiency",
            value: `${stats.bestRouteEfficiency.toFixed(1)}%`,
            change: "+5.1%",
            icon: <Target className="w-6 h-6" />,
            color: "from-rose-500 to-rose-600",
            metric: "Best route",
          },
          {
            label: "Nearby (≤5mi)",
            value: pickups.filter((p) => p.distance <= 5).length,
            change: "+15.7%",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-indigo-500 to-indigo-600",
            metric: "Close pickups",
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
                  id: "nearby",
                  label: "Nearby",
                  count: pickups.filter((p) => p.distance <= 5).length,
                },
                {
                  id: "highValue",
                  label: "High Value",
                  icon: <DollarSign className="w-3 h-3" />,
                  count: pickups.filter((p) => p.price >= 50).length,
                },
                {
                  id: "quick",
                  label: "Quick Jobs",
                  icon: <Zap className="w-3 h-3" />,
                  count: pickups.filter((p) => p.estimatedDuration <= 30)
                    .length,
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
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search by address, city, or customer name..."
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

            {/* Waste Type Filter */}
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Waste Types</option>
                <option value="general">General</option>
                <option value="recyclable">Recyclable</option>
                <option value="hazardous">Hazardous</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
              >
                <option value="distance">Sort by Distance</option>
                <option value="price">Sort by Price</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                <label className="text-sm font-medium text-gray-700">
                  Maximum Distance:{" "}
                  <span className="font-bold text-teal-600">
                    {distanceFilter} miles
                  </span>
                </label>
              </div>
              <span className="text-sm font-medium text-gray-500">
                Showing {filteredPickups.length} of {pickups.length} pickups
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="50"
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                className="w-full h-3 bg-linear-to-r from-teal-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-1"></span>
                  1 mi
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  10 mi
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></span>
                  25 mi
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-1"></span>
                  50 mi
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pickups Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPickups.length > 0 ? (
            filteredPickups.map((pickup) => {
              const wasteType = getWasteTypeIcon(pickup.wasteType);

              return (
                <Card
                  key={pickup.id}
                  className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 cursor-pointer"
                  onClick={() => setSelectedPickup(pickup)}
                >
                  {/* Earnings Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                      ${pickup.price}
                    </div>
                  </div>

                  {/* Waste Type Icon */}
                  <div
                    className={`w-16 h-16 ${wasteType.bg} rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${wasteType.color} flex items-center justify-center text-white`}
                    >
                      {wasteType.icon}
                    </div>
                  </div>

                  {/* Pickup Details */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                          {pickup.userName}
                        </h3>
                        <div className="flex items-center mt-1">
                          {getPriorityBadge(pickup.priority)}
                        </div>
                      </div>
                    </div>

                    {/* Distance & Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                          {pickup.distance.toFixed(1)} mi
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1 text-amber-500" />
                          {pickup.estimatedDuration} min
                        </div>
                      </div>
                      {getDistanceRing(pickup.distance)}
                    </div>

                    {/* Customer Rating */}
                    {pickup.customerRating && (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full mx-0.5 ${
                                i < Math.floor(pickup.customerRating!)
                                  ? "bg-yellow-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-2">
                            ({pickup.customerRating.toFixed(1)})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 ml-auto">
                          {pickup.totalPickups} pickups
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    <div className="pt-3 border-t border-gray-100">
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={pickup.address}
                      >
                        {pickup.address}
                      </p>
                      <p className="text-xs text-gray-500">{pickup.city}</p>
                    </div>

                    {/* Quantity & Waste Type */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {pickup.quantity}
                      </span>
                      <span className="text-gray-600 capitalize">
                        {pickup.wasteType} waste
                      </span>
                    </div>

                    {/* Accept Button */}
                    <Button
                      // variant="linear"
                      // linear="teal-blue"
                      className="w-full group relative overflow-hidden mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptPickup(pickup.id);
                      }}
                      loading={acceptingPickup === pickup.id}
                      disabled={!!acceptingPickup}
                    >
                      <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                      Accept Pickup
                      <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                    </Button>

                    {/* Hover Indicator */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-300 rounded-xl transition-all duration-300 pointer-events-none"></div>
                  </div>
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
                  No pickups available
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery ||
                  wasteTypeFilter !== "all" ||
                  distanceFilter < 50
                    ? "Try adjusting your filters or search criteria to find more pickups."
                    : "No pickups are currently available in your area. Check back soon!"}
                </p>
                <Button
                  // variant="linear"
                  // linear="teal-blue"
                  onClick={() => {
                    setSearchQuery("");
                    setWasteTypeFilter("all");
                    setDistanceFilter(50);
                    setActiveTab("all");
                  }}
                  className="group"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
                  Clear All Filters
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
                    Distance
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Priority
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
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPickup(pickup)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg ${getWasteTypeIcon(pickup.wasteType).bg} flex items-center justify-center mr-3`}
                        >
                          {getWasteTypeIcon(pickup.wasteType).icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {pickup.userName}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {pickup.address}, {pickup.city}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(pickup.pickupTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getDistanceRing(pickup.distance)}
                        <div>
                          <div className="font-medium">
                            {pickup.distance.toFixed(1)} mi
                          </div>
                          <div className="text-xs text-gray-500">
                            {pickup.estimatedDuration} min
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${pickup.price}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getPriorityBadge(pickup.priority)}
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        size="sm"
                        // variant="linear"
                        // linear="teal-blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptPickup(pickup.id);
                        }}
                        loading={acceptingPickup === pickup.id}
                        disabled={!!acceptingPickup}
                        className="group"
                      >
                        <CheckCircle className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                        Accept
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Selected Pickup Details Modal */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-100 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-xl ${getWasteTypeIcon(selectedPickup.wasteType).color} flex items-center justify-center`}
                >
                  {getWasteTypeIcon(selectedPickup.wasteType).icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Pickup Details
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPriorityBadge(selectedPickup.priority)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPickup(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Earnings Highlight */}
              <div className="bg-linear-to-r from-teal-50 to-blue-50 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Estimated Earnings</p>
                <p className="text-5xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  ${selectedPickup.price}
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedPickup.distance.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Miles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedPickup.estimatedDuration}
                    </div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      $
                      {(
                        (selectedPickup.price /
                          selectedPickup.estimatedDuration) *
                        60
                      ).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Hourly</div>
                  </div>
                </div>
              </div>

              {/* Customer & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-lg">
                        {selectedPickup.userName}
                      </p>
                    </div>
                    {selectedPickup.customerRating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full mx-0.5 ${
                                i < Math.floor(selectedPickup.customerRating!)
                                  ? "bg-yellow-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedPickup.customerRating.toFixed(1)}) •{" "}
                          {selectedPickup.totalPickups} pickups
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-500" />
                    Location Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedPickup.address}</p>
                      <p className="text-gray-600">{selectedPickup.city}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Navigation className="w-4 h-4 mr-1 text-blue-500" />
                          <span className="font-medium">
                            {selectedPickup.distance.toFixed(1)} mi
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-amber-500" />
                          <span className="font-medium">
                            {selectedPickup.estimatedDuration} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {/* <Calendar className="w-4 h-4 mr-1" /> */}
                        {new Date(selectedPickup.pickupTime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Job Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Waste Type</p>
                    <p className="font-medium capitalize mt-1">
                      {selectedPickup.wasteType}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium mt-1">
                      {selectedPickup.quantity}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Pickup Window</p>
                    <p className="font-medium mt-1">
                      {new Date(selectedPickup.pickupTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="font-medium text-green-600 mt-1">
                      $
                      {(
                        (selectedPickup.price /
                          selectedPickup.estimatedDuration) *
                        60
                      ).toFixed(2)}
                      /hr
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedPickup.specialInstructions && (
                <div className="bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                    <h5 className="font-semibold text-gray-900">
                      Special Instructions
                    </h5>
                  </div>
                  <p className="text-amber-800">
                    {selectedPickup.specialInstructions}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1 group"
                  onClick={() => setSelectedPickup(null)}
                >
                  Cancel
                </Button>
                <Button
                  // variant="linear"
                  // linear="teal-blue"
                  className="flex-1 group relative overflow-hidden"
                  onClick={() => handleAcceptPickup(selectedPickup.id)}
                  loading={acceptingPickup === selectedPickup.id}
                  disabled={!!acceptingPickup}
                >
                  <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />
                  Accept This Pickup
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                </Button>
              </div>
            </div>
          </Card>
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

      {/* Quick Actions Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-200 z-40">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/driver/map")}
            className="group"
          >
            <Navigation className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
            Live Map
          </Button>
          <Button
            // variant="linear"
            // linear="teal-blue"
            onClick={fetchAvailablePickups}
            className="group relative overflow-hidden"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
            Refresh List
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
          </Button>
          <Button
            // variant="linear"
            // linear="blue-indigo"
            onClick={() => (window.location.href = "/driver/earnings")}
            className="group relative overflow-hidden"
          >
            <DollarSign className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
            View Earnings
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailablePickupsPage;
