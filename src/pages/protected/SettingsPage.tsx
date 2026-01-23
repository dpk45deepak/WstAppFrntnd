import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  CreditCard,
  Globe,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import Input from "../../components/common/Input";
import { Label } from "../../components/ui/Label";
// import { Separator } from "../../components/ui/Separator";

const SettingsPage = () => {
//   const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    earnings: true,
    promotions: true,
    rideRequests: true,
    messages: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const settingsCategories = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Manage your notification preferences",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy & Security",
      description: "Privacy settings and security options",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Payment Methods",
      description: "Manage your payment options",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Language & Region",
      description: "App language and regional settings",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  const privacySettings = [
    { id: "location", label: "Share live location", value: true },
    { id: "activity", label: "Show online status", value: true },
    { id: "profile", label: "Make profile public", value: false },
    { id: "analytics", label: "Share analytics data", value: true },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Categories */}
          <div className="lg:col-span-1 space-y-4">
            {settingsCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="border border-gray-200 hover:border-blue-200 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <div className={category.color}>{category.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Settings Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications about {key}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {privacySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Label htmlFor={setting.id}>{setting.label}</Label>
                    </div>
                    <Switch id={setting.id} defaultChecked={setting.value} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <Button className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-600 mt-1">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
