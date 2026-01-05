// src/pages/driver/DriverPickupsPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Package,
    MapPin,
    Clock,
    User,
    CheckCircle,
    XCircle,
    Eye,
    Navigation,
    Calendar
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import pickupService from '../../services/pickup';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

interface DriverPickup {
    id: string;
    userId: string;
    userName: string;
    address: string;
    pickupTime: string;
    wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
    quantity: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    price: number;
    completedAt?: string;
    rating?: number;
    feedback?: string;
    specialInstructions?: string;
}

const DriverPickupsPage: React.FC = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [pickups, setPickups] = useState<DriverPickup[]>([]);
    const [filteredPickups, setFilteredPickups] = useState<DriverPickup[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const itemsPerPage = 10;

    useEffect(() => {
        fetchDriverPickups();
    }, [currentPage]);

    useEffect(() => {
        filterPickups();
    }, [pickups, searchQuery, statusFilter, dateFilter]);

    const { user } = useAuth();

    const fetchDriverPickups = async () => {
        setLoading(true);
        try {
            if (!user) throw new Error('Not authenticated');
            const response: any = await pickupService.getDriverPickups(user.id);
            // backend returns { success: true, data: pickups }
            setPickups(response.data || []);
            setTotalPages(1);
        } catch (error: any) {
            showToast(error.message || 'Failed to load your pickups', 'error');
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
                p.userName.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter).toDateString();
            filtered = filtered.filter(p =>
                new Date(p.pickupTime).toDateString() === filterDate
            );
        }

        setFilteredPickups(filtered);
    };

    const handleStatusUpdate = async (pickupId: string, action: 'start' | 'complete' | 'cancel') => {
        try {
            let endpoint = '';
            switch (action) {
                case 'start':
                    endpoint = 'start';
                    break;
                case 'complete':
                    endpoint = 'complete';
                    break;
                case 'cancel':
                    endpoint = 'cancel';
                    break;
            }

            if (endpoint === 'start') await pickupService.startPickup(pickupId);
            if (endpoint === 'complete') await pickupService.completePickup(pickupId);
            if (endpoint === 'cancel') await pickupService.cancelPickup(pickupId);
            showToast(`Pickup ${action}ed successfully`, 'success');
            fetchDriverPickups();
        } catch (error: any) {
            showToast(error.message || `Failed to ${action} pickup`, 'error');
        }
    };

    const getStatusBadge = (status: DriverPickup['status']) => {
        const statusConfig = {
            scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: <Navigation className="w-3 h-3" /> },
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

    const getWasteTypeIcon = (wasteType: DriverPickup['wasteType']) => {
        const icons = {
            general: { icon: '🗑️', color: 'text-gray-600' },
            recyclable: { icon: '♻️', color: 'text-green-600' },
            hazardous: { icon: '⚠️', color: 'text-red-600' },
            organic: { icon: '🌿', color: 'text-yellow-600' }
        };
        return icons[wasteType];
    };

    const getTimeRemaining = (pickupTime: string) => {
        const now = new Date();
        const pickupDate = new Date(pickupTime);
        const diffMs = pickupDate.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffMs < 0) return 'Overdue';
        if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`;
        return `${diffMinutes}m`;
    };

    if (loading && pickups.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" text="Loading your pickups..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Pickups</h1>
                    <p className="text-gray-600">Manage your assigned pickup jobs</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/driver/available'}
                        className="flex items-center"
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Find New Pickups
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by address or customer..."
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

                    {/* Status Filter */}
                    <div>
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-gray-400 mr-2" />
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
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: pickups.length, color: 'bg-blue-50', icon: <Package className="w-5 h-5 text-blue-600" /> },
                    { label: 'Scheduled', value: pickups.filter(p => p.status === 'scheduled').length, color: 'bg-yellow-50', icon: <Clock className="w-5 h-5 text-yellow-600" /> },
                    { label: 'In Progress', value: pickups.filter(p => p.status === 'in_progress').length, color: 'bg-purple-50', icon: <Navigation className="w-5 h-5 text-purple-600" /> },
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

            {/* Pickups List */}
            <div className="space-y-4">
                {filteredPickups.length > 0 ? (
                    filteredPickups.map((pickup) => {
                        const wasteType = getWasteTypeIcon(pickup.wasteType);
                        const timeRemaining = getTimeRemaining(pickup.pickupTime);

                        return (
                            <Card key={pickup.id} className="hover:shadow-lg transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Pickup Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start mb-4">
                                            <div className="text-3xl mr-3">{wasteType.icon}</div>
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-semibold text-gray-900 capitalize">{pickup.wasteType} Waste</h3>
                                                    {getStatusBadge(pickup.status)}
                                                    {pickup.status === 'scheduled' && (
                                                        <span className={`text-sm px-2 py-1 rounded-full ${timeRemaining === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                            {timeRemaining}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mt-1">Quantity: {pickup.quantity}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                                <div>
                                                    <p className="text-sm font-medium">Customer</p>
                                                    <p className="text-sm text-gray-600">{pickup.userName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                                <div>
                                                    <p className="text-sm font-medium">Address</p>
                                                    <p className="text-sm text-gray-600 truncate">{pickup.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <div>
                                                    <p className="text-sm font-medium">Pickup Time</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(pickup.pickupTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Special Instructions */}
                                        {pickup.specialInstructions && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
                                                <p className="text-sm text-gray-600">{pickup.specialInstructions}</p>
                                            </div>
                                        )}

                                        {/* Rating for completed pickups */}
                                        {pickup.status === 'completed' && pickup.rating && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-4 h-4 ${i < pickup.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                        >
                                                            ★
                                                        </div>
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">({pickup.rating.toFixed(1)})</span>
                                                    {pickup.feedback && (
                                                        <span className="ml-4 text-sm text-gray-600 italic">"{pickup.feedback}"</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions & Price */}
                                    <div className="lg:w-48 space-y-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">${pickup.price}</p>
                                            <p className="text-sm text-gray-500">Earnings</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => window.location.href = `/driver/pickup/${pickup.id}`}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>

                                            {pickup.status === 'scheduled' && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => handleStatusUpdate(pickup.id, 'start')}
                                                >
                                                    <Navigation className="w-4 h-4 mr-2" />
                                                    Start Pickup
                                                </Button>
                                            )}

                                            {pickup.status === 'in_progress' && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => handleStatusUpdate(pickup.id, 'complete')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Complete Pickup
                                                </Button>
                                            )}

                                            {(pickup.status === 'scheduled' || pickup.status === 'in_progress') && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to cancel this pickup?')) {
                                                            handleStatusUpdate(pickup.id, 'cancel');
                                                        }
                                                    }}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancel Pickup
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <Card>
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pickups found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || statusFilter !== 'all' || dateFilter
                                    ? 'Try adjusting your filters or search criteria'
                                    : 'You don\'t have any pickups assigned yet'
                                }
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/driver/available'}
                            >
                                Find Available Pickups
                            </Button>
                        </div>
                    </Card>
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

export default DriverPickupsPage;