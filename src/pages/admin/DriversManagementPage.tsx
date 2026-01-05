// src/pages/admin/DriversManagementPage.tsx
import React, { useState, useEffect } from 'react';
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
//   DollarSign,
  Calendar
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

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
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  lastActive?: string;
}

const DriversManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDrivers();
  }, [currentPage]);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchQuery, statusFilter, availabilityFilter]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/drivers', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setDrivers(response.data.drivers);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Failed to load drivers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = [...drivers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query) ||
        d.phone.toLowerCase().includes(query) ||
        d.vehiclePlate.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(d => 
        availabilityFilter === 'available' ? d.availability : !d.availability
      );
    }

    setFilteredDrivers(filtered);
  };

  // const handleStatusUpdate = async (driverId: string, newStatus: Driver['status']) => {
  //   try {
  //     await api.put(`/admin/drivers/${driverId}/status`, { status: newStatus });
  //     showToast(`Driver ${newStatus} successfully`, 'success');
  //     fetchDrivers();
  //   } catch (error: any) {
  //     showToast(error.message || 'Failed to update driver', 'error');
  //   }
  // };

  const handleAvailabilityToggle = async (driverId: string, available: boolean) => {
    try {
      await api.put(`/admin/drivers/${driverId}/availability`, { available });
      showToast(`Driver ${available ? 'marked as available' : 'marked as unavailable'}`, 'success');
      fetchDrivers();
    } catch (error: any) {
      showToast(error.message || 'Failed to update availability', 'error');
    }
  };

  const getStatusBadge = (status: Driver['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: null },
      suspended: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> }
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon && <span className="mr-1">{config.icon}</span>}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <MapPin className="w-3 h-3 mr-1" />
        Available
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <MapPin className="w-3 h-3 mr-1" />
        Unavailable
      </span>
    );
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading && drivers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading drivers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
          <p className="text-gray-600">Manage and monitor all platform drivers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => window.location.href = '/admin/drivers/add'}
            className="flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search drivers by name, email, phone, or vehicle plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Drivers', value: drivers.length, color: 'bg-blue-50', icon: <Truck className="w-5 h-5 text-blue-600" /> },
          { label: 'Active Drivers', value: drivers.filter(d => d.status === 'active').length, color: 'bg-green-50', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
          { label: 'Available Now', value: drivers.filter(d => d.availability).length, color: 'bg-purple-50', icon: <MapPin className="w-5 h-5 text-purple-600" /> },
          { label: 'Avg. Rating', value: (drivers.reduce((acc, d) => acc + (d.rating || 0), 0) / drivers.length || 0).toFixed(1), color: 'bg-yellow-50', icon: <Star className="w-5 h-5 text-yellow-600" /> },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(driver.status)}
                      <span className="mx-2">•</span>
                      {getAvailabilityBadge(driver.availability)}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Driver Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{driver.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{driver.licenseNumber || 'No license'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{driver.vehicleType} • {driver.vehiclePlate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{driver.totalPickups}</p>
                  <p className="text-xs text-gray-600">Pickups</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ${driver.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Earnings</p>
                </div>
                <div className="text-center">
                  {getRatingStars(driver.rating)}
                  <p className="text-xs text-gray-600 mt-1">Rating</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Joined {new Date(driver.joinedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/admin/drivers/${driver.id}/edit`}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={driver.availability ? 'danger' : 'primary'}
                      onClick={() => handleAvailabilityToggle(driver.id, !driver.availability)}
                    >
                      {driver.availability ? 'Make Unavailable' : 'Make Available'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'No drivers are registered yet'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/drivers/add'}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Driver
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default DriversManagementPage;