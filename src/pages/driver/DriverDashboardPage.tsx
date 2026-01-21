// src/pages/driver/DriverDashboardPage.tsx
import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Calendar,
  Navigation,
  Shield,
  Sparkles,
  Zap,
  Target,
  Award,
  Leaf,
  Truck,
  Activity,
  ChevronRight,
  PlayCircle,
  BatteryCharging,
  Navigation2,
  RotateCw,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import pickupService from "../../services/pickup";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

interface DriverStats {
  totalPickups: number;
  completedToday: number;
  pendingPickups: number;
  totalEarnings: number;
  todayEarnings: number;
  rating: number;
  activeHours: number;
}

interface ActivePickup {
  id: string;
  userId: string;
  userName: string;
  address: string;
  pickupTime: string;
  wasteType: string;
  estimatedDuration: number;
  distance: number;
  payment: number;
}

const DriverDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    completedToday: 0,
    pendingPickups: 0,
    todayEarnings: 0,
    rating: 0,
  });
  const [activePickup, setActivePickup] = useState<ActivePickup | null>(null);
  const [nextPickup, setNextPickup] = useState<ActivePickup | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isOnline, setIsOnline] = useState(true);
  const [performanceStreak, _] = useState(5);

  useEffect(() => {
    fetchDashboardData();
    checkLocationPermission();
    updateBatteryLevel();

    const interval = setInterval(() => {
      updateBatteryLevel();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats) {
      animateStats();
    }
  }, [stats]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      const statsResponse: any = await pickupService.getPickupStats(user.id);
      const driverPickupsResponse: any = await pickupService.getDriverPickups(
        user.id,
      );

      const statsData = statsResponse.data || {};
      setStats({
        totalPickups: statsData.total || 0,
        completedToday: statsData.completed || 0,
        pendingPickups: statsData.scheduled || 0,
        totalEarnings: statsData.revenue || 0,
        todayEarnings: statsData.todayRevenue || 0,
        rating: statsData.rating || 4.8,
        activeHours: statsData.activeHours || 6,
      });

      const pickups: any[] = driverPickupsResponse.data || [];
      const inProgress =
        pickups.find((p) => p.status === "in_progress") || null;
      const next = pickups.find((p) => p.status === "scheduled") || null;
      setActivePickup(inProgress);
      setNextPickup(next);
    } catch (error: any) {
      showToast(error.message || "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showToast("Dashboard refreshed", "success");
  };

  const animateStats = () => {
    if (!stats) return;

    setTimeout(
      () =>
        setAnimatedStats((s) => ({
          ...s,
          completedToday: stats.completedToday,
        })),
      100,
    );
    setTimeout(
      () =>
        setAnimatedStats((s) => ({
          ...s,
          pendingPickups: stats.pendingPickups,
        })),
      300,
    );
    setTimeout(
      () =>
        setAnimatedStats((s) => ({ ...s, todayEarnings: stats.todayEarnings })),
      500,
    );
    setTimeout(
      () => setAnimatedStats((s) => ({ ...s, rating: stats.rating })),
      700,
    );
  };

  const checkLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false),
      );
    }
  };

  const updateBatteryLevel = () => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  };

  const handleStartPickup = async (pickupId: string) => {
    try {
      await pickupService.startPickup(pickupId);
      showToast("Pickup started successfully", "success");
      fetchDashboardData();
    } catch (error: any) {
      showToast(error.message || "Failed to start pickup", "error");
    }
  };

  const handleCompletePickup = async (pickupId: string) => {
    try {
      await pickupService.completePickup(pickupId);
      showToast("Pickup completed successfully", "success");
      fetchDashboardData();
    } catch (error: any) {
      showToast(error.message || "Failed to complete pickup", "error");
    }
  };

  const handleToggleOnline = async () => {
    try {
      setIsOnline(!isOnline);
      showToast(`You are now ${!isOnline ? "online" : "offline"}`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to update status", "error");
      setIsOnline(!isOnline); // Revert on error
    }
  };

  const statCards = [
    {
      title: "Today's Pickups",
      value: animatedStats.completedToday,
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-teal-400",
      bgColor: "bg-linear-to-br from-blue-50 via-white to-white",
      borderColor: "border-blue-200",
      change: "+2 from yesterday",
      trend: "up" as const,
      delay: 0.1,
      to: "/driver/pickups",
    },
    {
      title: "Active Pickups",
      value: animatedStats.pendingPickups,
      icon: <Clock className="w-6 h-6" />,
      color: "from-rose-500 to-indigo-400",
      bgColor: "bg-linear-to-br from-rose-50 via-white to-white",
      borderColor: "border-rose-200",
      subValue: `${activePickup ? "1 active" : "None"}`,
      delay: 0.2,
      to: "/driver/available",
    },
    {
      title: "Today's Earnings",
      value: `$${animatedStats.todayEarnings.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-teal-400",
      bgColor: "bg-linear-to-br from-green-50 via-white to-white",
      borderColor: "border-green-200",
      change: `$${(stats?.totalEarnings || 0).toFixed(2)} total`,
      delay: 0.3,
      to: "/driver/earnings",
    },
    {
      title: "Driver Rating",
      value: animatedStats.rating.toFixed(1),
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-linear-to-br from-indigo-50 via-white to-white",
      borderColor: "border-indigo-200",
      subValue: `${stats?.totalPickups || 0} trips`,
      delay: 0.4,
      to: "/driver/profile",
    },
  ];

  const quickActions = [
    {
      title: "Find New Pickups",
      description: "Browse available opportunities",
      icon: <MapPin className="w-5 h-5" />,
      action: "/driver/available",
      variant: "primary" as const,
      color: "from-teal-500 to-blue-500",
    },
    {
      title: "View Schedule",
      description: "Upcoming pickups calendar",
      icon: <Calendar className="w-5 h-5" />,
      action: "/driver/pickups",
      variant: "outline" as const,
      color: "text-blue-600 border-blue-200",
    },
    {
      title: "Performance Stats",
      description: "View detailed analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      action: "/driver/stats",
      variant: "outline" as const,
      color: "text-indigo-600 border-indigo-200",
    },
  ];

  const performanceTips = [
    {
      title: "Eco Warrior",
      description: "Maintain 4.8+ rating for 7 days",
      icon: <Leaf className="w-5 h-5" />,
      progress: 85,
      color: "from-teal-500 to-green-400",
      reward: "Eco Badge",
    },
    {
      title: "Peak Performer",
      description: "Complete 3+ pickups in peak hours",
      icon: <Zap className="w-5 h-5" />,
      progress: 66,
      color: "from-yellow-500 to-amber-400",
      reward: "+15% Bonus",
    },
    {
      title: "Safety Streak",
      description: "30 days without incidents",
      icon: <Shield className="w-5 h-5" />,
      progress: 90,
      color: "from-blue-500 to-indigo-400",
      reward: "Safety Award",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading driver dashboard..." />
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
      {/* Header with Status */}
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
              <Truck className="w-8 h-8 text-teal-600" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back,{" "}
                <span className="font-semibold text-teal-600">
                  {user?.name}
                </span>
                . Ready for your next pickup?
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleOnline}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${isOnline ? "bg-linear-to-r from-green-500 to-teal-500 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-white" : "bg-gray-500"}`}
              />
              {isOnline ? "Online" : "Offline"}
            </motion.button>

            <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-blue-50 to-teal-50 rounded-xl">
              <BatteryCharging
                className={`w-5 h-5 ${batteryLevel > 30 ? "text-green-500" : "text-rose-500"}`}
              />
              <span className="font-bold text-gray-900">{batteryLevel}%</span>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${locationEnabled ? "bg-linear-to-r from-teal-50 to-blue-50" : "bg-linear-to-r from-rose-50 to-rose-100"}`}
            >
              <Navigation2
                className={`w-5 h-5 ${locationEnabled ? "text-blue-500" : "text-rose-500"}`}
              />
              <span className="font-bold text-gray-900">
                {locationEnabled ? "GPS Active" : "GPS Off"}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50"
          >
            <RotateCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
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
                    className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-md`}
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

                {stat.change && (
                  <div className="flex items-center mt-4">
                    <div
                      className={`flex items-center px-2 py-1 rounded-lg ${stat.trend === "up" ? "bg-green-100" : "bg-rose-100"}`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-green-700" : "text-rose-700"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Pickup Section */}
      <AnimatePresence mode="wait">
        {activePickup ? (
          <motion.div
            key="active-pickup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-blue-200 bg-linear-to-r from-blue-50 via-white to-teal-50/30">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-14 h-14 bg-linear-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Package className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          Active Pickup
                        </h3>
                        <span className="px-3 py-1 bg-linear-to-r from-blue-500 to-teal-500 text-white text-xs font-bold rounded-full">
                          In Progress
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {activePickup.estimatedDuration} minutes remaining
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-semibold text-gray-900">
                            {activePickup.userName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Distance</p>
                          <p className="font-semibold text-gray-900">
                            {activePickup.distance.toFixed(1)} miles
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-rose-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Earnings</p>
                          <p className="font-semibold text-teal-600">
                            ${activePickup.payment?.toFixed(2) || "25.00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-teal-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Pickup Address
                    </p>
                    <p className="text-gray-900 font-medium">
                      {activePickup.address}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Scheduled:{" "}
                      {new Date(activePickup.pickupTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                </div>

                <div className="lg:w-96 space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full h-14 bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white shadow-lg"
                      onClick={() => handleCompletePickup(activePickup.id)}
                    >
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Complete Pickup
                    </Button>
                  </motion.div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 border-2 border-teal-200 text-teal-700 hover:border-teal-500 hover:bg-teal-50"
                    onClick={() =>
                      (window.location.href = `/driver/pickup/${activePickup.id}`)
                    }
                  >
                    <Activity className="w-5 h-5 mr-3" />
                    View Details
                  </Button>

                  <div className="p-4 bg-linear-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Quick Actions
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Call Customer
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="no-active-pickup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-amber-200 bg-linear-to-r from-amber-50 via-white to-yellow-50/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center"
                  >
                    <AlertCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      No Active Pickup
                    </h3>
                    <p className="text-gray-600 mt-1">
                      You're currently not assigned to any pickup job
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <span className="text-sm text-amber-600">
                        Ready to work
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-linear-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white"
                    onClick={() => (window.location.href = "/driver/available")}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Available Pickups
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
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
                                            ? `bg-linear-to-r ${action.color} text-white border-transparent shadow-lg`
                                            : `bg-white ${action.color} hover:bg-linear-to-br hover:from-white hover:to-gray-50 border`
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

        {/* Performance Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Performance Goals
                </h2>
                <p className="text-gray-600">
                  Track your progress and earn rewards
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                <Award className="w-4 h-4" />
                Streak: {performanceStreak} days
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {performanceTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-5 bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg bg-linear-to-br ${tip.color}`}
                    >
                      {tip.icon}
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-full">
                      {tip.reward}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {tip.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-bold text-gray-900">
                        {tip.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tip.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        className={`h-full rounded-full bg-linear-to-r ${tip.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Next Pickup & Earnings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Pickup */}
        {nextPickup && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Next Pickup
                  </h2>
                  <p className="text-gray-600">Your upcoming assignment</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-linear-to-r from-teal-500 to-blue-500 text-white"
                  onClick={() => handleStartPickup(nextPickup.id)}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Pickup
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-linear-to-r from-teal-50 to-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {nextPickup.userName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {nextPickup.address}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-gray-500">Scheduled</p>
                    <p className="font-bold text-gray-900">
                      {new Date(nextPickup.pickupTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-bold text-gray-900 capitalize">
                      {nextPickup.wasteType}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-bold text-gray-900">
                      {nextPickup.estimatedDuration} min
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-bold text-gray-900">
                      {nextPickup.distance.toFixed(1)} mi
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-teal-500" />
                      <span>
                        Estimated Earnings:{" "}
                        <span className="font-bold text-teal-600">
                          ${nextPickup.payment?.toFixed(2) || "22.50"}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-teal-200 text-teal-700"
                      onClick={() =>
                        (window.location.href = `/driver/pickup/${nextPickup.id}`)
                      }
                    >
                      Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Earnings Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Earnings Preview
                </h2>
                <p className="text-gray-600">This week's projected earnings</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-linear-to-r from-green-50 to-teal-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${animatedStats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Goal</span>
                  <span className="font-bold text-gray-900">$500</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(animatedStats.todayEarnings / 500) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-linear-to-r from-teal-500 to-green-500 rounded-full"
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {((animatedStats.todayEarnings / 500) * 100).toFixed(1)}%
                  completed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Avg. per Pickup</p>
                  <p className="font-bold text-gray-900">$24.50</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Best Day</p>
                  <p className="font-bold text-gray-900">$186.75</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-teal-200 text-teal-700 hover:border-teal-500"
                onClick={() => (window.location.href = "/driver/earnings")}
              >
                View Detailed Earnings
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DriverDashboardPage;
