// src/pages/user/PickupsPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Truck,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Navigation,
  Phone,
  MessageSquare,
  Star,
  TrendingUp,
  PackageOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Input from "../../components/common/Input";
import { Badge } from "../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useNavigate } from "react-router";

interface Pickup {
  id: string;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  type: string;
  items: number;
  driver: {
    name: string;
    rating: number;
    phone: string;
    avatar: string;
  };
  location: {
    from: string;
    to: string;
  };
  price: number;
  estimatedTime: string;
  notes?: string;
}

const NavigateToScheduleButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/schedule-pickup")}
      className="bg-linear-to-r from-blue-500 to-blue-600"
    >
      <PackageOpen className="w-4 h-4 mr-2" />
      Schedule New Pickup
    </Button>
  );
};

const PickupsPage = () => {
  const [pickups, _] = useState<Pickup[]>([
    {
      id: "P001",
      date: "Today",
      time: "2:30 PM",
      status: "in-progress",
      type: "Furniture",
      items: 3,
      driver: {
        name: "Michael Chen",
        rating: 4.9,
        phone: "+1 (555) 123-4567",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      location: {
        from: "123 Main St, Apt 4B",
        to: "456 Warehouse Ave",
      },
      price: 89.99,
      estimatedTime: "30-45 min",
    },
    {
      id: "P002",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "scheduled",
      type: "Electronics",
      items: 5,
      driver: {
        name: "Sarah Johnson",
        rating: 4.8,
        phone: "+1 (555) 987-6543",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      location: {
        from: "789 Oak St",
        to: "101 Tech Park",
      },
      price: 149.5,
      estimatedTime: "45-60 min",
    },
    {
      id: "P003",
      date: "Oct 15",
      time: "3:45 PM",
      status: "completed",
      type: "Clothing",
      items: 12,
      driver: {
        name: "David Wilson",
        rating: 4.7,
        phone: "+1 (555) 456-7890",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      location: {
        from: "321 Pine St",
        to: "654 Donation Center",
      },
      price: 45.0,
      estimatedTime: "Completed",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, _loading] = useState(false);

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    scheduled: <ClockIcon className="w-4 h-4" />,
    "in-progress": <Truck className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const filteredPickups = pickups.filter((pickup) => {
    const matchesSearch =
      pickup.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.driver.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || pickup.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: pickups.length,
    completed: pickups.filter((p) => p.status === "completed").length,
    upcoming: pickups.filter((p) => p.status === "scheduled").length,
    inProgress: pickups.filter((p) => p.status === "in-progress").length,
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Pickups</h1>
              </div>
              <p className="text-gray-600">
                Track and manage all your scheduled pickups
              </p>
            </div>
            <Button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <PackageOpen className="w-4 h-4 mr-2" />
              Schedule New Pickup
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Pickups",
              value: stats.total,
              icon: Package,
              color: "from-blue-500 to-blue-600",
              change: "+12%",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
              change: "+8%",
            },
            {
              label: "Upcoming",
              value: stats.upcoming,
              icon: Calendar,
              color: "from-indigo-500 to-indigo-600",
              change: "+5%",
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              icon: Truck,
              color: "from-amber-500 to-amber-600",
              change: "+15%",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-200 hover:border-blue-200 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 bg-linear-to-br ${stat.color} rounded-xl`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Filters & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search pickups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { key: "all", label: "All Pickups", count: pickups.length },
                  {
                    key: "scheduled",
                    label: "Scheduled",
                    count: stats.upcoming,
                  },
                  {
                    key: "in-progress",
                    label: "In Progress",
                    count: stats.inProgress,
                  },
                  {
                    key: "completed",
                    label: "Completed",
                    count: stats.completed,
                  },
                  { key: "cancelled", label: "Cancelled", count: 0 },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedStatus(filter.key)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      selectedStatus === filter.key
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          filter.key === "all"
                            ? "bg-gray-400"
                            : filter.key === "scheduled"
                              ? "bg-blue-400"
                              : filter.key === "in-progress"
                                ? "bg-amber-400"
                                : filter.key === "completed"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                        }`}
                      />
                      <span className="font-medium">{filter.label}</span>
                    </div>
                    <Badge variant="secondary">{filter.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Schedule Pickup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pickups List */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <AnimatePresence>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <LoadingSpinner text="Loading pickups..." />
                    </div>
                  ) : filteredPickups.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPickups.map((pickup, index) => (
                        <motion.div
                          key={pickup.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <Card className="border border-gray-200 hover:border-blue-200 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                              {/* Header */}
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <Badge
                                    className={`${statusColors[pickup.status]} border`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {statusIcons[pickup.status]}
                                      <span className="capitalize">
                                        {pickup.status}
                                      </span>
                                    </div>
                                  </Badge>
                                  <span className="font-mono font-bold text-gray-900">
                                    #{pickup.id}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {pickup.type}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">
                                    ${pickup.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Total cost
                                  </p>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                      Schedule
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        {pickup.date}
                                      </span>
                                      <Clock className="w-4 h-4 text-gray-500 ml-4" />
                                      <span className="font-medium">
                                        {pickup.time}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                      Items
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <Package className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        {pickup.items} items
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                      Driver
                                    </h4>
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={pickup.driver.avatar}
                                        alt={pickup.driver.name}
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                      />
                                      <div>
                                        <p className="font-medium">
                                          {pickup.driver.name}
                                        </p>
                                        <div className="flex items-center gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`w-3 h-3 ${
                                                i <
                                                Math.floor(pickup.driver.rating)
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                          <span className="text-sm text-gray-600 ml-1">
                                            {pickup.driver.rating}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                      Route
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex items-start gap-2">
                                        <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                                          <div className="w-0.5 h-8 bg-gray-300" />
                                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">
                                            Pickup
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {pickup.location.from}
                                          </p>
                                          <div className="h-6" />
                                          <p className="font-medium text-gray-900">
                                            Drop-off
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {pickup.location.to}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">
                                        Estimated Time
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {pickup.estimatedTime}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-9"
                                      >
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-9"
                                      >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Message
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                {pickup.status === "scheduled" && (
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Pickup
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                  <ChevronRight className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="p-4 bg-linear-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No pickups found
                      </h3>
                      <p className="text-gray-600 max-w-sm mb-6">
                        {searchQuery || selectedStatus !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Schedule your first pickup to get started!"}
                      </p>
                          <NavigateToScheduleButton />
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-100 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="p-4 bg-white/80 rounded-full inline-block mb-4">
                          <Navigation className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Map View Coming Soon
                        </h3>
                        <p className="text-gray-600">
                          Track your pickups in real-time on an interactive map
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PickupsPage;
