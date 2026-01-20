import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePickup } from "../../hooks/usePickup";
import { useToast } from "../../hooks/useToast";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  Leaf,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Card from "../../components/common/Card";
import PickupCard from "../../components/pickup/PickupCard";
import LinkButton from "../../components/common/LinkButton";
import type { Pickup } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

const DashboardPage = () => {
  const { user } = useAuth();
  const { getPickups } = usePickup();
  const { showToast } = useToast();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
  });
  const hasAnimated = useRef(false);

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    if (!loading && pickups.length > 0 && !hasAnimated.current) {
      animateStats();
      hasAnimated.current = true;
    }
  }, [loading, pickups]);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const data = await getPickups();
      setPickups(data.slice(0, 5));
    } catch {
      showToast("Failed to fetch pickups", "error");
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    const total = pickups.length;
    const scheduled = pickups.filter((p) => p.status === "scheduled").length;
    const inProgress = pickups.filter((p) => p.status === "in_progress").length;
    const completed = pickups.filter((p) => p.status === "completed").length;

    // Animate each stat with a slight delay
    setTimeout(() => setAnimatedStats((s) => ({ ...s, total })), 100);
    setTimeout(() => setAnimatedStats((s) => ({ ...s, scheduled })), 250);
    setTimeout(() => setAnimatedStats((s) => ({ ...s, inProgress })), 400);
    setTimeout(() => setAnimatedStats((s) => ({ ...s, completed })), 550);
  };

  const stats = [
    {
      title: "Total Pickups",
      value: animatedStats.total.toString(),
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-blue-50 via-white to-white",
      borderColor: "border-blue-100",
      delay: 0.1,
    },
    {
      title: "Scheduled",
      value: animatedStats.scheduled.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: "from-teal-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-teal-50 via-white to-white",
      borderColor: "border-teal-100",
      delay: 0.2,
    },
    {
      title: "In Progress",
      value: animatedStats.inProgress.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: "from-rose-500 to-indigo-400",
      bgColor: "bg-gradient-to-br from-rose-50 via-white to-white",
      borderColor: "border-rose-100",
      delay: 0.3,
    },
    {
      title: "Completed",
      value: animatedStats.completed.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-400",
      bgColor: "bg-gradient-to-br from-indigo-50 via-white to-white",
      borderColor: "border-indigo-100",
      delay: 0.4,
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Welcome Section with Animated Gradient */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full translate-y-48 -translate-x-48" />

        <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Sparkles className="w-6 h-6 text-teal-500" />
                </motion.div>
                <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  Eco Warrior
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back,{" "}
                <span className="text-teal-600">{user?.name}!</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening with your waste management today.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0"
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg">
                <Leaf className="w-5 h-5" />
                <span className="font-semibold">Carbon Saved: 42kg</span>
                <TrendingUp className="w-5 h-5" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions with Hover Effects */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div>
          <LinkButton
            to="/schedule-pickup"
            size="lg"
            className="w-full h-full group relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative flex items-center justify-center gap-3">
              Schedule New Pickup
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Calendar className="w-5 h-5" />
              </motion.div>
            </span>
          </LinkButton>
        </motion.div>

        <motion.div>
          <LinkButton
            to="/pickups"
            size="lg"
            variant="outline"
            className="w-full h-full group border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-teal-700 hover:text-teal-800 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-3">
              View All Pickups
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </LinkButton>
        </motion.div>

        <motion.div>
          <LinkButton
            to="/reports"
            size="lg"
            variant="outline"
            className="w-full h-full group border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-all duration-300"
          >
            View Analytics
          </LinkButton>
        </motion.div>
      </motion.div>

      {/* Stats Grid with Animated Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
          
            custom={stat.delay}
            whileHover={{
              y: -8,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            <Card
              padding="lg"
              className={`h-full border-2 ${stat.borderColor} ${stat.bgColor} overflow-hidden group hover:shadow-xl transition-all duration-300`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
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
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/80 to-transparent absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* Recent Pickups with Enhanced Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card
          padding="lg"
          className="border border-gray-100 bg-gradient-to-b from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Pickups
              </h2>
              <p className="text-gray-600 mt-1">
                Track your waste collection activities
              </p>
            </div>
            <LinkButton
              to="/pickups"
              size="sm"
              className="group border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-teal-700"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </LinkButton>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">
                  Loading your pickups...
                </p>
              </motion.div>
            ) : pickups.length > 0 ? (
              <motion.div
                key="pickups"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {pickups.map((pickup, index) => (
                  <motion.div
                    key={pickup.id}
                  
                    custom={index * 0.1}
                  >
                    <PickupCard pickup={pickup} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full" />
                  <Package className="absolute inset-0 m-auto w-16 h-16 text-teal-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No pickups scheduled yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start your waste management journey by scheduling your first
                  pickup
                </p>
                <LinkButton
                  to="/schedule-pickup"
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule First Pickup
                </LinkButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Environmental Impact Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
          <Leaf className="w-4 h-4 text-teal-500" />
          <span>
            Your activities have saved{" "}
            <span className="font-semibold text-teal-600">42kg</span> of CO₂
            this month
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
