// src/pages/driver/DriverProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import authService from '../../services/auth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const driverProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  licenseNumber: z.string().min(5, 'License number is required'),
  vehicleType: z.string().min(2, 'Vehicle type is required'),
  vehiclePlate: z.string().min(4, 'Vehicle plate is required'),
  capacity: z.string().min(2, 'Capacity is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
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

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<DriverProfileFormData>({
    resolver: zodResolver(driverProfileSchema),
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    setLoading(true);
    try {
      const profileData: any = await authService.getProfile();

      // Set form values with available fields (backend user model is minimal)
      reset({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        licenseNumber: '',
        vehicleType: '',
        vehiclePlate: '',
        capacity: '',
        address: profileData.address ? profileData.address.street || '' : '',
        city: profileData.address ? profileData.address.city || '' : '',
        state: profileData.address ? profileData.address.state || '' : '',
        zipCode: profileData.address ? profileData.address.zipCode || '' : '',
      });

      setStats(null);
      setProfilePhoto(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DriverProfileFormData) => {
    try {
      const updated = await authService.updateProfile(data as any);
      showToast('Profile updated successfully', 'success');
      updateUser({ ...user, ...(updated || {}) });
      setEditing(false);
    } catch (error: any) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      // Backend does not expose driver profile photo upload. Inform user.
      showToast('Profile photo upload is not supported by the backend.', 'warning');
    } catch (error: any) {
      showToast(error.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleToggleAvailability = async () => {
    // Backend does not support availability toggle endpoint
    showToast('Driver availability toggle is not supported by backend.', 'warning');
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600">Manage your driver account and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {!editing ? (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  fetchDriverProfile();
                }}
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-blue-600" />
                    )}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                      {uploadingPhoto ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-gray-600" />
                      )}
                    </label>
                  )}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(stats?.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </div>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({stats?.averageRating?.toFixed(1) || '0.0'})
                      </span>
                    </div>
                    <span className="mx-3 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">
                      {stats?.completedPickups || 0} completed pickups
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Availability Status</p>
                <p className="text-sm text-gray-600">
                  Toggle your availability for new pickups
                </p>
              </div>
              <Button
                variant={stats?.documents.license.verified ? "primary" : "outline"}
                onClick={handleToggleAvailability}
                disabled={!stats?.documents.license.verified}
              >
                {stats?.documents.license.verified ? 'Go Online' : 'Complete Verification'}
              </Button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <Input
                    label="Full Name"
                    icon={<User className="w-4 h-4" />}
                    error={errors.name?.message}
                    disabled={!editing}
                    {...register('name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    disabled={!editing}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    icon={<Phone className="w-4 h-4" />}
                    error={errors.phone?.message}
                    disabled={!editing}
                    {...register('phone')}
                  />
                </div>

                {/* Driver Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Driver Information</h3>
                  <Input
                    label="License Number"
                    icon={<Shield className="w-4 h-4" />}
                    error={errors.licenseNumber?.message}
                    disabled={!editing}
                    {...register('licenseNumber')}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Vehicle Type"
                      icon={<Truck className="w-4 h-4" />}
                      error={errors.vehicleType?.message}
                      disabled={!editing}
                      {...register('vehicleType')}
                    />
                    <Input
                      label="Vehicle Plate"
                      icon={<Truck className="w-4 h-4" />}
                      error={errors.vehiclePlate?.message}
                      disabled={!editing}
                      {...register('vehiclePlate')}
                    />
                  </div>
                  <Input
                    label="Capacity"
                    placeholder="e.g., 2 tons, 5 cubic yards"
                    icon={<Truck className="w-4 h-4" />}
                    error={errors.capacity?.message}
                    disabled={!editing}
                    {...register('capacity')}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Street Address"
                    icon={<MapPin className="w-4 h-4" />}
                    error={errors.address?.message}
                    disabled={!editing}
                    {...register('address')}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="City"
                      icon={<MapPin className="w-4 h-4" />}
                      error={errors.city?.message}
                      disabled={!editing}
                      {...register('city')}
                    />
                    <Input
                      label="State"
                      icon={<MapPin className="w-4 h-4" />}
                      error={errors.state?.message}
                      disabled={!editing}
                      {...register('state')}
                    />
                    <Input
                      label="ZIP Code"
                      icon={<MapPin className="w-4 h-4" />}
                      error={errors.zipCode?.message}
                      disabled={!editing}
                      {...register('zipCode')}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Stats & Verification Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Pickups', value: stats?.totalPickups || 0, icon: <Truck className="w-4 h-4" /> },
                { label: 'Completed', value: stats?.completedPickups || 0, icon: <CheckCircle className="w-4 h-4" /> },
                { label: 'Total Earnings', value: `$${(stats?.totalEarnings || 0).toLocaleString()}`, icon: <Star className="w-4 h-4" /> },
                { label: 'Acceptance Rate', value: `${stats?.acceptanceRate || 0}%`, icon: <CheckCircle className="w-4 h-4" /> },
                { label: 'On-time Rate', value: `${stats?.onTimeRate || 0}%`, icon: <Calendar className="w-4 h-4" /> },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <div className="text-gray-600">{stat.icon}</div>
                    </div>
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-2" />
                Joined {stats?.joinedAt ? new Date(stats.joinedAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Last active {stats?.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </Card>

          {/* Verification Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
            <div className="space-y-4">
              {[
                { 
                  label: 'Driver License', 
                  status: stats?.documents.license.verified, 
                  expiry: stats?.documents.license.expiryDate,
                  color: stats?.documents.license.verified ? 'text-green-600' : 'text-yellow-600'
                },
                { 
                  label: 'Insurance', 
                  status: stats?.documents.insurance.verified, 
                  expiry: stats?.documents.insurance.expiryDate,
                  color: stats?.documents.insurance.verified ? 'text-green-600' : 'text-yellow-600'
                },
                { 
                  label: 'Vehicle Registration', 
                  status: stats?.documents.vehicle.verified, 
                  expiry: stats?.documents.vehicle.expiryDate,
                  color: stats?.documents.vehicle.verified ? 'text-green-600' : 'text-yellow-600'
                },
              ].map((doc, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{doc.label}</span>
                    {getVerificationBadge(doc.status || false)}
                  </div>
                  {doc.expiry && (
                    <div className="text-xs text-gray-500">
                      Expires: {new Date(doc.expiry).toLocaleDateString()}
                    </div>
                  )}
                  {!doc.status && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.href = `/driver/documents/upload`}
                    >
                      Upload Document
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/driver/earnings'}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                View Earnings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/driver/pickups'}
              >
                <Truck className="w-4 h-4 mr-2" />
                My Pickups
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/driver/settings'}
              >
                <Shield className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverProfilePage;