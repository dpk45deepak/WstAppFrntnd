// src/pages/driver/DriverProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Shield,
  Truck,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Edit2,
  Save,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Clock,
  ShieldCheck,
  BadgeCheck,
  FileText,
  Upload,
  CreditCard,
  Settings,
  Bell,
  Lock,
  ChevronRight,
  Globe,
  BatteryCharging,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import authService from "../../services/auth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const driverProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  licenseNumber: z.string().min(5, "License number is required"),
  vehicleType: z.string().min(2, "Vehicle type is required"),
  vehiclePlate: z.string().min(4, "Vehicle plate is required"),
  capacity: z.string().min(2, "Capacity is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
});

type DriverProfileFormData = z.infer<typeof driverProfileSchema>;

interface DriverStats {
  totalPickups: number;
  completedPickups: number;
  totalEarnings: number;
  averageRating: number;
  acceptanceRate: number;
  onTimeRate: number;
  joinedAt: string;
  lastActive: string;
  weeklyGoal: number;
  currentWeekEarnings: number;
  documents: {
    license: { verified: boolean; expiryDate: string };
    insurance: { verified: boolean; expiryDate: string };
    vehicle: { verified: boolean; expiryDate: string };
  };
}

const DriverProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(66);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<DriverProfileFormData>({
    resolver: zodResolver(driverProfileSchema),
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  useEffect(() => {
    if (stats?.documents) {
      const verifiedCount = Object.values(stats.documents).filter(
        (doc) => doc.verified,
      ).length;
      setVerificationProgress(Math.round((verifiedCount / 3) * 100));
    }
  }, [stats]);

  const fetchDriverProfile = async () => {
    setLoading(true);
    try {
      const profileData: any = await authService.getProfile();

      reset({
        name: profileData.name || "Driver Name",
        email: profileData.email || "driver@example.com",
        phone: profileData.phone || "+1 (555) 123-4567",
        licenseNumber: "DL12345678",
        vehicleType: "Pickup Truck",
        vehiclePlate: "ABC123",
        capacity: "2 tons",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94107",
      });

      // Mock stats for demonstration
      setStats({
        totalPickups: 156,
        completedPickups: 148,
        totalEarnings: 4560.5,
        averageRating: 4.8,
        acceptanceRate: 95,
        onTimeRate: 98,
        joinedAt: "2023-06-15",
        lastActive: new Date().toISOString(),
        weeklyGoal: 500,
        currentWeekEarnings: 325.75,
        documents: {
          license: { verified: true, expiryDate: "2025-12-31" },
          insurance: { verified: true, expiryDate: "2024-06-30" },
          vehicle: { verified: false, expiryDate: "2024-03-15" },
        },
      });

      setProfilePhoto(null);
    } catch (error: any) {
      showToast(error.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DriverProfileFormData) => {
    try {
      const updated = await authService.updateProfile(data as any);
      showToast("Profile updated successfully", "success");
      updateUser({ ...user, ...(updated || {}) });
      setEditing(false);
    } catch (error: any) {
      showToast(error.message || "Failed to update profile", "error");
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    setUploadingPhoto(true);
    try {
      // Create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
        showToast("Profile photo updated (local preview)", "success");
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      showToast(error.message || "Failed to upload photo", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-teal-100 text-green-800"
      >
        <BadgeCheck className="w-3 h-3 mr-1" />
        Verified
      </motion.span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your profile..." />
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
      {/* Header */}
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
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Profile
              </h1>
              <p className="text-gray-600">
                Manage your account, documents, and performance
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!editing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditing(false);
                  fetchDriverProfile();
                }}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-rose-200 text-rose-700 rounded-xl font-bold hover:bg-rose-50"
              >
                <X className="w-5 h-5" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <motion.div
        // variants={itemVariants}
        className="lg:col-span-2">
          <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <div className="space-y-8">
              {/* Profile Header with Photo */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>

                    {editing && (
                      <motion.label
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploadingPhoto}
                        />
                        {uploadingPhoto ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent"></div>
                        ) : (
                          <Camera className="w-5 h-5 text-gray-600" />
                        )}
                      </motion.label>
                    )}
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                      </h2>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 rounded-full text-sm font-bold"
                      >
                        <Sparkles className="w-3 h-3" />
                        Elite Driver
                      </motion.div>
                    </div>

                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-5 h-5 ${i < Math.floor(stats?.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          </motion.div>
                        ))}
                        <span className="ml-2 font-bold text-gray-900">
                          {stats?.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        {stats?.completedPickups || 0} trips
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Progress */}
                <div className="w-full md:w-auto">
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Verification Progress
                      </span>
                      <span className="text-lg font-bold text-teal-700">
                        {verificationProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationProgress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {verificationProgress === 100
                        ? "All documents verified! ✅"
                        : `${3 - Math.floor(verificationProgress / 33)} documents pending`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      icon={<User className="w-4 h-4" />}
                      error={errors.name?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("name")}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                      error={errors.email?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("email")}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      icon={<Phone className="w-4 h-4" />}
                      error={errors.phone?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("phone")}
                    />
                    <Input
                      label="Driver License"
                      icon={<Shield className="w-4 h-4" />}
                      error={errors.licenseNumber?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("licenseNumber")}
                    />
                  </div>
                </motion.div>

                {/* Vehicle Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Vehicle Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Vehicle Type"
                      icon={<Truck className="w-4 h-4" />}
                      error={errors.vehicleType?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("vehicleType")}
                    />
                    <Input
                      label="License Plate"
                      icon={<Truck className="w-4 h-4" />}
                      error={errors.vehiclePlate?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("vehiclePlate")}
                    />
                    <Input
                      label="Capacity"
                      placeholder="e.g., 2 tons"
                      icon={<Truck className="w-4 h-4" />}
                      error={errors.capacity?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("capacity")}
                    />
                  </div>
                </motion.div>

                {/* Address Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Address Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      label="Street Address"
                      icon={<MapPin className="w-4 h-4" />}
                      error={errors.address?.message}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      {...register("address")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Input
                        label="City"
                        icon={<MapPin className="w-4 h-4" />}
                        error={errors.city?.message}
                        disabled={!editing}
                        className={!editing ? "bg-gray-50" : ""}
                        {...register("city")}
                      />
                      <Input
                        label="State"
                        icon={<MapPin className="w-4 h-4" />}
                        error={errors.state?.message}
                        disabled={!editing}
                        className={!editing ? "bg-gray-50" : ""}
                        {...register("state")}
                      />
                      <Input
                        label="ZIP Code"
                        icon={<MapPin className="w-4 h-4" />}
                        error={errors.zipCode?.message}
                        disabled={!editing}
                        className={!editing ? "bg-gray-50" : ""}
                        {...register("zipCode")}
                      />
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:border-teal-500"
                          onClick={() =>
                            window.open("https://maps.google.com", "_blank")
                          }
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar - Stats & Actions */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <motion.div
          // variants={itemVariants}
          >
            <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Performance Stats
                </h3>
                <TrendingUp className="w-6 h-6 text-teal-500" />
              </div>

              <div className="space-y-6">
                {[
                  {
                    label: "Total Pickups",
                    value: stats?.totalPickups || 0,
                    icon: <Truck className="w-5 h-5" />,
                    color: "from-blue-500 to-teal-400",
                  },
                  {
                    label: "Completed",
                    value: stats?.completedPickups || 0,
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: "from-green-500 to-teal-400",
                    progress: stats?.completedPickups
                      ? (stats.completedPickups / stats.totalPickups) * 100
                      : 0,
                  },
                  {
                    label: "Total Earnings",
                    value: `$${(stats?.totalEarnings || 0).toLocaleString()}`,
                    icon: <DollarSign className="w-5 h-5" />,
                    color: "from-teal-500 to-blue-400",
                  },
                  {
                    label: "Acceptance Rate",
                    value: `${stats?.acceptanceRate || 0}%`,
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: "from-rose-500 to-indigo-400",
                  },
                  {
                    label: "On-time Rate",
                    value: `${stats?.onTimeRate || 0}%`,
                    icon: <Clock className="w-5 h-5" />,
                    color: "from-indigo-500 to-blue-400",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}
                        >
                          <div className="text-white">{stat.icon}</div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {stat.value}
                      </span>
                    </div>

                    {stat.progress !== undefined && (
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                          className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {stats?.joinedAt
                        ? new Date(stats.joinedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Active now</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Weekly Earnings Goal */}
          <motion.div
          // variants={itemVariants}
          transition={{ delay: 0.1 }}>
            <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Weekly Goal</h3>
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Earnings Target</span>
                  <span className="font-bold text-gray-900">
                    ${stats?.weeklyGoal || 500}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats ? (stats.currentWeekEarnings / stats.weeklyGoal) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ${stats?.currentWeekEarnings || 0}
                    </span>
                    <span className="font-bold text-teal-600">
                      {stats
                        ? (
                            (stats.currentWeekEarnings / stats.weeklyGoal) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-900">
                    Keep it up!
                  </p>
                  <p className="text-xs text-gray-600">
                    Complete 3 more pickups to reach your goal
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Document Verification */}
          <motion.div
          // variants={itemVariants}
          transition={{ delay: 0.2 }}>
            <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Documents</h3>
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Driver License",
                    status: stats?.documents.license.verified,
                    expiry: stats?.documents.license.expiryDate,
                    icon: <FileText className="w-4 h-4" />,
                  },
                  {
                    label: "Insurance",
                    status: stats?.documents.insurance.verified,
                    expiry: stats?.documents.insurance.expiryDate,
                    icon: <Shield className="w-4 h-4" />,
                  },
                  {
                    label: "Vehicle Registration",
                    status: stats?.documents.vehicle.verified,
                    expiry: stats?.documents.vehicle.expiryDate,
                    icon: <Truck className="w-4 h-4" />,
                  },
                ].map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {doc.icon}
                        <span className="font-medium text-gray-900">
                          {doc.label}
                        </span>
                      </div>
                      {getVerificationBadge(doc.status || false)}
                    </div>
                    {doc.expiry && (
                      <div className="text-xs text-gray-600">
                        Expires: {new Date(doc.expiry).toLocaleDateString()}
                      </div>
                    )}
                    {!doc.status && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-50"
                        onClick={() =>
                          (window.location.href = "/driver/documents")
                        }
                      >
                        <Upload className="w-4 h-4" />
                        Upload Document
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
          // variants={itemVariants}
          transition={{ delay: 0.3 }}>
            <Card className="border-2 border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "View Earnings",
                    icon: <CreditCard className="w-4 h-4" />,
                    href: "/driver/earnings",
                    color: "text-teal-600",
                  },
                  {
                    label: "My Pickups",
                    icon: <Truck className="w-4 h-4" />,
                    href: "/driver/pickups",
                    color: "text-blue-600",
                  },
                  {
                    label: "Notifications",
                    icon: <Bell className="w-4 h-4" />,
                    href: "/driver/notifications",
                    color: "text-rose-600",
                    badge: 3,
                  },
                  {
                    label: "Security",
                    icon: <Lock className="w-4 h-4" />,
                    href: "/driver/security",
                    color: "text-indigo-600",
                  },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    onClick={() => (window.location.href = action.href)}
                    className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gray-100 ${action.color}`}
                      >
                        {action.icon}
                      </div>
                      <span className="font-medium text-gray-900">
                        {action.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge && (
                        <span className="w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                          {action.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverProfilePage;
