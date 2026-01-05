import { useState, useEffect } from 'react';
import { usePickup } from '../../hooks/usePickup';
import { useToast } from '../../hooks/useToast';
import type { Pickup } from '../../types';
import PickupCard from './PickupCard';
// import Button from '../common/Button';
import { Filter, Search } from 'lucide-react';

const PickupList = ({ userId, role = 'user' }: { userId?: string; role?: string }) => {
  const { getPickups, updatePickupStatus } = usePickup();
  const { showToast } = useToast();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPickups();
  }, [userId]);

  useEffect(() => {
    filterPickups();
  }, [pickups, statusFilter, searchQuery]);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const data = await getPickups(userId as any);
      setPickups(data);
    } catch (error) {
      showToast('Failed to fetch pickups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterPickups = () => {
    let filtered = [...pickups];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.address!.toLowerCase().includes(query) ||
        p.wasteType.toLowerCase().includes(query) ||
        p.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredPickups(filtered);
  };

  const handleStatusUpdate = async (pickupId: string, newStatus: string) => {
    try {
      await updatePickupStatus(pickupId, newStatus as any);
      showToast(`Pickup ${newStatus} successfully`, 'success');
      fetchPickups();
    } catch (error) {
      showToast('Failed to update pickup', 'error');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by address, waste type, or notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4">
          {statusOptions.slice(1).map(option => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label} ({pickups.filter(p => p.status === option.value).length})
            </button>
          ))}
        </div>
      </div>

      {/* Pickup List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pickups...</p>
        </div>
      ) : filteredPickups.length > 0 ? (
        <div className="space-y-4">
          {filteredPickups.map(pickup => (
            <PickupCard
              key={pickup.id}
              pickup={pickup}
              showActions={role === 'driver'}
              onAction={(action, pickupId) => {
                const statusMap: Record<string, string> = {
                  start: 'in_progress',
                  complete: 'completed',
                  cancel: 'cancelled',
                };
                if (statusMap[action]) {
                  handleStatusUpdate(pickupId, statusMap[action]);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pickups found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search or filter criteria'
              : 'No pickups scheduled yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PickupList;