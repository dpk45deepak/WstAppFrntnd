import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Award,
  Star,
  Clock,
  Package,
  TrendingUp,
  Shield,
  BadgeCheck,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
// import Input from "../../components/common/Input";
import { Label } from "../../components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "March 2023",
    bio: "Professional driver with 5+ years of experience. Providing safe and comfortable rides.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  });

  const stats = [
    {
      label: "Total Rides",
      value: "1,247",
      icon: <Package className="w-5 h-5" />,
      change: "+12%",
    },
    {
      label: "Rating",
      value: "4.9",
      icon: <Star className="w-5 h-5" />,
      change: "+0.1",
    },
    {
      label: "Hours Online",
      value: "1,850",
      icon: <Clock className="w-5 h-5" />,
      change: "+15%",
    },
    {
      label: "Efficiency",
      value: "98%",
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+2%",
    },
  ];

  const achievements = [
    {
      title: "Safety First",
      description: "1000 rides without incident",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: "Early Bird",
      description: "50 early morning rides",
      icon: <Award className="w-5 h-5" />,
    },
    {
      title: "Top Performer",
      description: "Top 5% of drivers",
      icon: <BadgeCheck className="w-5 h-5" />,
    },
  ];

  const recentActivities = [
    {
      time: "2 hours ago",
      activity: "Completed ride to JFK Airport",
      earnings: "$42.50",
    },
    {
      time: "Yesterday",
      activity: "Reached 100 rides this month",
      earnings: "+$100 bonus",
    },
    { time: "3 days ago", activity: "Received 5-star rating", earnings: "" },
    { time: "1 week ago", activity: "Profile updated", earnings: "" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and preferences
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600">Professional Driver</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-gray-700 font-medium">
                      4.9 (1.2k reviews)
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-4">
                  {[
                    {
                      icon: <Mail className="w-5 h-5" />,
                      label: "Email",
                      value: profile.email,
                    },
                    {
                      icon: <Phone className="w-5 h-5" />,
                      label: "Phone",
                      value: profile.phone,
                    },
                    {
                      icon: <MapPin className="w-5 h-5" />,
                      label: "Location",
                      value: profile.location,
                    },
                    {
                      icon: <Calendar className="w-5 h-5" />,
                      label: "Member Since",
                      value: profile.joinDate,
                    },
                  ].map((info) => (
                    <div key={info.label} className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <div className="text-gray-600">{info.icon}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{info.label}</p>
                        <p className="font-medium text-gray-900">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Connect with me
                  </h3>
                  <div className="flex gap-3">
                    {[
                      {
                        icon: <Instagram className="w-5 h-5" />,
                        color: "bg-pink-500 hover:bg-pink-600",
                      },
                      {
                        icon: <Facebook className="w-5 h-5" />,
                        color: "bg-blue-600 hover:bg-blue-700",
                      },
                      {
                        icon: <Twitter className="w-5 h-5" />,
                        color: "bg-sky-500 hover:bg-sky-600",
                      },
                      {
                        icon: <Linkedin className="w-5 h-5" />,
                        color: "bg-blue-700 hover:bg-blue-800",
                      },
                    ].map((social) => (
                      <button
                        key={social.color}
                        className={`p-2 text-white rounded-lg transition-colors ${social.color}`}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-blue-600">{stat.icon}</div>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-3">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) =>
                              setProfile({ ...profile, bio: e.target.value })
                            }
                            className="w-full min-h-30 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <Button className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                          Save Bio
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          About Me
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {profile.bio}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Vehicle Info
                            </h4>
                            <p className="text-gray-600">
                              2022 Toyota Camry Hybrid
                            </p>
                            <p className="text-gray-600">
                              License: NYC-789-ABC
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Preferences
                            </h4>
                            <p className="text-gray-600">
                              Music: Jazz, Classical
                            </p>
                            <p className="text-gray-600">Temperature: 72°F</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.title}
                          className="p-4 bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl"
                        >
                          <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg w-fit">
                            <div className="text-blue-600">
                              {achievement.icon}
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mt-3">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {activity.activity}
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                          {activity.earnings && (
                            <span className="font-medium text-green-600">
                              {activity.earnings}
                            </span>
                          )}
                        </motion.div>
                      ))}
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

export default ProfilePage;
