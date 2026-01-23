import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  BellOff,
  DollarSign,
  Shield,
  Package,
  Star,
  AlertTriangle,
  XCircle,
  Filter,
  Trash2,
  Check,
  Clock,
  Settings,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "earnings",
      title: "Weekly Earnings Summary",
      message:
        "You earned $1,245.75 this week! That's 15% more than last week.",
      time: "2 hours ago",
      read: false,
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      type: "safety",
      title: "Safety Reminder",
      message: "Remember to complete your daily vehicle safety check.",
      time: "Yesterday",
      read: false,
      icon: <Shield className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      type: "ride",
      title: "New Ride Request",
      message: "Pickup at Central Park, destination: JFK Airport",
      time: "2 days ago",
      read: true,
      icon: <Package className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      type: "rating",
      title: "New 5-star Rating",
      message:
        "Sarah Johnson gave you a 5-star rating for your excellent service!",
      time: "3 days ago",
      read: true,
      icon: <Star className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 5,
      type: "alert",
      title: "Weather Alert",
      message: "Heavy rain expected in your area. Drive safely!",
      time: "1 week ago",
      read: true,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
    },
  ]);

  const [settings, setSettings] = useState({
    push: true,
    email: true,
    sms: false,
    earnings: true,
    rides: true,
    safety: true,
    promotions: true,
  });

  const notificationTypes = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.read).length,
    },
    { key: "earnings", label: "Earnings", count: 2 },
    { key: "rides", label: "Rides", count: 1 },
    { key: "safety", label: "Safety", count: 1 },
  ];

  const markAsRead = (id : any) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: any) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
            </div>
            <p className="text-gray-600">
              Stay updated with your ride activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Filters & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "push",
                    label: "Push Notifications",
                    icon: <Bell className="w-4 h-4" />,
                  },
                  {
                    key: "email",
                    label: "Email Notifications",
                    icon: <Mail className="w-4 h-4" />,
                  },
                  {
                    key: "sms",
                    label: "SMS Alerts",
                    icon: <MessageSquare className="w-4 h-4" />,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings]}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.key}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <Badge variant="secondary">{type.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unread</span>
                  <span className="font-bold text-blue-600">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today</span>
                  <span className="font-bold text-green-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-bold text-purple-600">12</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <AnimatePresence>
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${notification.color}`}
                            >
                              {notification.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                  </h3>
                                  <p className="text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="h-8 text-gray-600 hover:bg-gray-100"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
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
                        <BellOff className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No notifications yet
                      </h3>
                      <p className="text-gray-600 max-w-sm">
                        When you receive notifications, they'll appear here.
                        Stay tuned for updates!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Upcoming & Recent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-linear-to-br from-green-50 to-green-100/50 rounded-lg">
                      <p className="font-medium text-green-800">
                        Maintenance Due
                      </p>
                      <p className="text-sm text-green-600">
                        Vehicle service in 2 days
                      </p>
                    </div>
                    <div className="p-3 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-lg">
                      <p className="font-medium text-blue-800">
                        Training Session
                      </p>
                      <p className="text-sm text-blue-600">
                        Safety webinar tomorrow at 2 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-linear-to-br from-purple-50 to-purple-100/50 rounded-lg">
                      <p className="font-medium text-purple-800">
                        Driver Meetup
                      </p>
                      <p className="text-sm text-purple-600">
                        Monthly meetup this Friday
                      </p>
                    </div>
                    <div className="p-3 bg-linear-to-br from-amber-50 to-amber-100/50 rounded-lg">
                      <p className="font-medium text-amber-800">New Features</p>
                      <p className="text-sm text-amber-600">
                        Check out the latest app updates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
