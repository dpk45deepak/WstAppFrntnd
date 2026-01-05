// src/pages/admin/PickupsManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  // Filter, 
  Package, 
  Calendar,
  MapPin,
  User,
  Truck,
  DollarSign,
//   MoreVertical,
  Eye,
  XCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

interface Pickup {
  id: string;
  userId: string;
  userName: string;
  driverId?: string;
  driverName?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  pickupDate: string;
  address: string;
  wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
  price?: number;
  createdAt: string;
}

const PickupsManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<Pickup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPickups();
  }, [currentPage]);

  useEffect(() => {
    filterPickups();
  }, [pickups, searchQuery, statusFilter, wasteTypeFilter, dateFilter]);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/pickups', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setPickups(response.data.pickups);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Failed to load pickups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.address.toLowerCase().includes(query) ||
        p.userName.toLowerCase().includes(query) ||
        (p.driverName && p.driverName.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.wasteType === wasteTypeFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(p => 
        new Date(p.pickupDate).toDateString() === filterDate
      );
    }

    setFilteredPickups(filtered);
  };

  const handleStatusUpdate = async (pickupId: string, newStatus: Pickup['status']) => {
    try {
      await api.put(`/admin/pickups/${pickupId}/status`, { status: newStatus });
      showToast(`Pickup ${newStatus} successfully`, 'success');
      fetchPickups();
    } catch (error: any) {
      showToast(error.message || 'Failed to update pickup', 'error');
    }
  };

  const getStatusBadge = (status: Pickup['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> }
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType: Pickup['wasteType']) => {
    const icons = {
      general: '🗑️',
      recyclable: '♻️',
      hazardous: '⚠️',
      organic: '🌿'
    };
    return icons[wasteType];
  };

  if (loading && pickups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading pickups..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pickups Management</h1>
          <p className="text-gray-600">Monitor and manage all platform pickups</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => window.location.href = '/admin/pickups/analytics'}
            className="flex items-center"
          >
            <Package className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by address, user, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <Input
              type="date"
              label="Filter by Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Status & Type Filters */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="recyclable">Recyclable</option>
                <option value="hazardous">Hazardous</option>
                <option value="organic">Organic</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pickups', value: pickups.length, color: 'bg-blue-50', icon: <Package className="w-5 h-5 text-blue-600" /> },
          { label: 'Scheduled', value: pickups.filter(p => p.status === 'scheduled').length, color: 'bg-yellow-50', icon: <Clock className="w-5 h-5 text-yellow-600" /> },
          { label: 'In Progress', value: pickups.filter(p => p.status === 'in_progress').length, color: 'bg-purple-50', icon: <Clock className="w-5 h-5 text-purple-600" /> },
          { label: 'Completed', value: pickups.filter(p => p.status === 'completed').length, color: 'bg-green-50', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
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

      {/* Pickups Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPickups.length > 0 ? (
                filteredPickups.map((pickup) => (
                  <tr key={pickup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getWasteTypeIcon(pickup.wasteType)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {pickup.wasteType} Waste
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(pickup.pickupDate).toLocaleDateString()} at{' '}
                            {new Date(pickup.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {pickup.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-2 text-gray-400" />
                          <span className="text-sm">{pickup.userName}</span>
                        </div>
                        {pickup.driverName ? (
                          <div className="flex items-center">
                            <Truck className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-sm">{pickup.driverName}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            No driver assigned
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(pickup.status)}
                    </td>
                    <td className="px-6 py-4">
                      {pickup.price ? (
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${pickup.price.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/admin/pickups/${pickup.id}`}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {pickup.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusUpdate(pickup.id, 'in_progress')}
                          >
                            Start
                          </Button>
                        )}
                        {pickup.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(pickup.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pickups found</p>
                      {searchQuery && (
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      </Card>
    </div>
  );
};

export default PickupsManagementPage;