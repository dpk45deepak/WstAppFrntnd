// src/pages/driver/AvailablePickupsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  User,
  Package,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import pickupService from '../../services/pickup';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

interface AvailablePickup {
  id: string;
  userId: string;
  userName: string;
  address: string;
  city: string;
  distance: number;
  pickupTime: string;
  wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
  quantity: string;
  estimatedDuration: number;
  price: number;
  priority: 'low' | 'medium' | 'high';
  specialInstructions?: string;
  createdAt: string;
}

const AvailablePickupsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState<AvailablePickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<AvailablePickup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(10);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'time'>('distance');
  const [selectedPickup, setSelectedPickup] = useState<AvailablePickup | null>(null);
  const [acceptingPickup, setAcceptingPickup] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAvailablePickups();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortPickups();
  }, [pickups, searchQuery, wasteTypeFilter, distanceFilter, sortBy]);

  const { user } = useAuth();

  const fetchAvailablePickups = async () => {
    setLoading(true);
    try {
      // Fetch pickups with status 'pending' to represent available pickups
      const response = await pickupService.getAllPickups({ status: 'pending' });
      // backend returns { success: true, data: pickups }
      setPickups(response.data || []);
      setTotalPages(1);
    } catch (error: any) {
      showToast(error.message || 'Failed to load available pickups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPickups = () => {
    let filtered = [...pickups];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.userName.toLowerCase().includes(query)
      );
    }

    // Waste type filter
    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.wasteType === wasteTypeFilter);
    }

    // Distance filter
    filtered = filtered.filter(p => p.distance <= distanceFilter);

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'price':
          return b.price - a.price;
        case 'time':
          return new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime();
        default:
          return 0;
      }
    });

    setFilteredPickups(filtered);
  };

  const handleAcceptPickup = async (pickupId: string) => {
    setAcceptingPickup(pickupId);
    try {
      if (!user) throw new Error('Not authenticated');
      await pickupService.assignDriver(pickupId, user.id);
      showToast('Pickup accepted successfully!', 'success');
      fetchAvailablePickups();
      setSelectedPickup(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to accept pickup', 'error');
    } finally {
      setAcceptingPickup(null);
    }
  };

  const getPriorityBadge = (priority: AvailablePickup['priority']) => {
    const config = {
      low: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-3 h-3" /> },
      high: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-3 h-3" /> }
    };
    const { color, icon } = config[priority];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <span className="mr-1">{icon}</span>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  const getWasteTypeIcon = (wasteType: AvailablePickup['wasteType']) => {
    const icons = {
      general: { icon: '🗑️', color: 'bg-gray-100 text-gray-800' },
      recyclable: { icon: '♻️', color: 'bg-green-100 text-green-800' },
      hazardous: { icon: '⚠️', color: 'bg-red-100 text-red-800' },
      organic: { icon: '🌿', color: 'bg-yellow-100 text-yellow-800' }
    };
    return icons[wasteType];
  };

  if (loading && pickups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading available pickups..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Pickups</h1>
          <p className="text-gray-600">Find and accept new pickup jobs in your area</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={fetchAvailablePickups}
            className="flex items-center"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Refresh
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
                  placeholder="Search by address, city, or customer name..."
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
                  value={wasteTypeFilter}
                  onChange={(e) => setWasteTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Waste Types</option>
                  <option value="general">General</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Sort by Distance</option>
                <option value="price">Sort by Price</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Maximum Distance: <span className="font-bold">{distanceFilter} miles</span>
              </label>
              <span className="text-sm text-gray-500">
                {pickups.filter(p => p.distance <= distanceFilter).length} pickups available
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 mi</span>
              <span>10 mi</span>
              <span>25 mi</span>
              <span>50 mi</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available Now', value: pickups.length, color: 'bg-blue-50', icon: <Package className="w-5 h-5 text-blue-600" /> },
          { label: 'Within 5 miles', value: pickups.filter(p => p.distance <= 5).length, color: 'bg-green-50', icon: <MapPin className="w-5 h-5 text-green-600" /> },
          { label: 'High Priority', value: pickups.filter(p => p.priority === 'high').length, color: 'bg-red-50', icon: <AlertCircle className="w-5 h-5 text-red-600" /> },
          { label: 'Avg. Price', value: `$${pickups.length > 0 ? (pickups.reduce((acc, p) => acc + p.price, 0) / pickups.length).toFixed(2) : '0.00'}`, color: 'bg-yellow-50', icon: <DollarSign className="w-5 h-5 text-yellow-600" /> },
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

      {/* Pickups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPickups.length > 0 ? (
          filteredPickups.map((pickup) => {
            const wasteType = getWasteTypeIcon(pickup.wasteType);
            
            return (
              <Card 
                key={pickup.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedPickup?.id === pickup.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPickup(pickup)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{wasteType.icon}</span>
                        <span className="text-sm font-medium capitalize">{pickup.wasteType}</span>
                      </div>
                      {getPriorityBadge(pickup.priority)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${pickup.price}</p>
                      <p className="text-xs text-gray-500">Estimated earnings</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{pickup.userName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{pickup.distance.toFixed(1)} miles away</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(pickup.pickupTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{pickup.quantity} • {pickup.estimatedDuration} min</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Address:</p>
                    <p className="text-sm text-gray-600 truncate" title={pickup.address}>
                      {pickup.address}, {pickup.city}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptPickup(pickup.id);
                    }}
                    loading={acceptingPickup === pickup.id}
                    disabled={!!acceptingPickup}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Pickup
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pickups available</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || wasteTypeFilter !== 'all' || distanceFilter < 50
                    ? 'Try adjusting your filters or search criteria'
                    : 'No pickups are currently available in your area'
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setWasteTypeFilter('all');
                    setDistanceFilter(50);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Selected Pickup Details Modal */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Pickup Details</h3>
              <button
                onClick={() => setSelectedPickup(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">
                      {getWasteTypeIcon(selectedPickup.wasteType).icon}
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold capitalize">{selectedPickup.wasteType} Waste</h4>
                      {getPriorityBadge(selectedPickup.priority)}
                    </div>
                  </div>
                  <p className="text-gray-600">Quantity: {selectedPickup.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">${selectedPickup.price}</p>
                  <p className="text-sm text-gray-500">Estimated earnings</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Customer Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPickup.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested Time</p>
                    <p className="font-medium">
                      {new Date(selectedPickup.pickupTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h5 className="font-semibold mb-2">Location Details</h5>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{selectedPickup.address}</p>
                      <p className="text-sm text-gray-600">{selectedPickup.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Navigation className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="font-medium">{selectedPickup.distance.toFixed(1)} miles</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Estimated Duration</p>
                        <p className="font-medium">{selectedPickup.estimatedDuration} minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedPickup.specialInstructions && (
                <div>
                  <h5 className="font-semibold mb-2">Special Instructions</h5>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{selectedPickup.specialInstructions}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedPickup(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleAcceptPickup(selectedPickup.id)}
                  loading={acceptingPickup === selectedPickup.id}
                  disabled={!!acceptingPickup}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept This Pickup
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

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

export default AvailablePickupsPage;