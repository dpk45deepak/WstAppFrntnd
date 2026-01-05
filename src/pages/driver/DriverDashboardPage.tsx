// src/pages/driver/DriverDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Package,
    MapPin,
    DollarSign,
    Clock,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    AlertCircle,
    Calendar,
    Navigation,
    Battery,
    Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import pickupService from '../../services/pickup';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface DriverStats {
    totalPickups: number;
    completedToday: number;
    pendingPickups: number;
    totalEarnings: number;
    todayEarnings: number;
    rating: number;
    activeHours: number;
}

interface ActivePickup {
    id: string;
    userId: string;
    userName: string;
    address: string;
    pickupTime: string;
    wasteType: string;
    estimatedDuration: number;
    distance: number;
}

const DriverDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DriverStats | null>(null);
    const [activePickup, setActivePickup] = useState<ActivePickup | null>(null);
    const [nextPickup, setNextPickup] = useState<ActivePickup | null>(null);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(85);

    useEffect(() => {
        fetchDashboardData();
        checkLocationPermission();
        updateBatteryLevel();

        // Simulate real-time updates
        const interval = setInterval(() => {
            updateBatteryLevel();
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (!user) throw new Error('Not authenticated');
            // Use pickupService to fetch stats and driver pickups
            const statsResponse: any = await pickupService.getPickupStats(user.id);
            const driverPickupsResponse: any = await pickupService.getDriverPickups(user.id);

            const statsData = statsResponse.data || {};
            setStats({
                totalPickups: statsData.total || 0,
                completedToday: statsData.completed || 0,
                pendingPickups: statsData.scheduled || 0,
                totalEarnings: statsData.revenue || 0,
                todayEarnings: 0,
                rating: 0,
                activeHours: 0,
            });

            const pickups: any[] = driverPickupsResponse.data || [];
            const inProgress = pickups.find(p => p.status === 'in_progress') || null;
            const next = pickups.find(p => p.status === 'scheduled') || null;
            setActivePickup(inProgress);
            setNextPickup(next);
        } catch (error: any) {
            showToast(error.message || 'Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const checkLocationPermission = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationEnabled(true),
                () => setLocationEnabled(false)
            );
        }
    };

    const updateBatteryLevel = () => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(Math.round(battery.level * 100));
            });
        }
    };

    const handleStartPickup = async (pickupId: string) => {
        try {
            await pickupService.startPickup(pickupId);
            showToast('Pickup started successfully', 'success');
            fetchDashboardData();
        } catch (error: any) {
            showToast(error.message || 'Failed to start pickup', 'error');
        }
    };

    const handleCompletePickup = async (pickupId: string) => {
        try {
            await pickupService.completePickup(pickupId);
            showToast('Pickup completed successfully', 'success');
            fetchDashboardData();
        } catch (error: any) {
            showToast(error.message || 'Failed to complete pickup', 'error');
        }
    };

    const handleGoOnline = async () => {
        // Backend doesn't provide a direct availability toggle endpoint.
        showToast('Driver availability toggle is not supported by backend.', 'warning');
    };

    const statCards = [
        {
            title: 'Today\'s Pickups',
            value: stats?.completedToday || 0,
            icon: <Package className="w-6 h-6 text-blue-600" />,
            color: 'bg-blue-50',
            change: '+2 from yesterday',
            trend: 'up' as const,
            to: '/driver/pickups'
        },
        {
            title: 'Active Pickups',
            value: stats?.pendingPickups || 0,
            icon: <Clock className="w-6 h-6 text-yellow-600" />,
            color: 'bg-yellow-50',
            subValue: `${activePickup ? '1 active' : 'None'}`,
            to: '/driver/available'
        },
        {
            title: 'Today\'s Earnings',
            value: `$${(stats?.todayEarnings || 0).toFixed(2)}`,
            icon: <DollarSign className="w-6 h-6 text-green-600" />,
            color: 'bg-green-50',
            change: `$${(stats?.totalEarnings || 0).toFixed(2)} total`,
            to: '/driver/earnings'
        },
        {
            title: 'Driver Rating',
            value: (stats?.rating || 0).toFixed(1),
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
            color: 'bg-purple-50',
            subValue: `${stats?.totalPickups || 0} trips`,
            to: '/driver/profile'
        }
    ];

    const quickActions = [
        {
            title: 'View Available Pickups',
            description: 'Find new pickup opportunities',
            icon: <MapPin className="w-5 h-5" />,
            action: '/driver/available',
            variant: 'primary' as const
        },
        {
            title: 'My Schedule',
            description: 'View upcoming pickups',
            icon: <Calendar className="w-5 h-5" />,
            action: '/driver/pickups',
            variant: 'outline' as const
        },
        {
            title: 'Update Availability',
            description: 'Go online/offline',
            icon: <Shield className="w-5 h-5" />,
            action: () => handleGoOnline(),
            variant: 'outline' as const
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" text="Loading your dashboard..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome back, {user?.name}. Ready for your next pickup?
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Status Indicators */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <Battery className="w-4 h-4 mr-1" />
                            {batteryLevel}%
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${locationEnabled ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            <Navigation className="w-4 h-4 mr-1" />
                            {locationEnabled ? 'GPS Active' : 'GPS Off'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                {stat.subValue && (
                                    <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
                                )}
                                {stat.change && (
                                    <div className="flex items-center mt-2">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => window.location.href = stat.to}
                        >
                            View Details
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Active Pickup Section */}
            {activePickup ? (
                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Active Pickup</h3>
                                    <p className="text-sm text-gray-600">In progress - {activePickup.estimatedDuration} min remaining</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium">Customer</p>
                                        <p className="text-sm text-gray-600">{activePickup.userName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Navigation className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium">Distance</p>
                                        <p className="text-sm text-gray-600">{activePickup.distance.toFixed(1)} miles</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium">Scheduled Time</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(activePickup.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Pickup Address</p>
                                <p className="text-gray-700">{activePickup.address}</p>
                            </div>
                        </div>

                        <div className="lg:w-48 space-y-3">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={() => handleCompletePickup(activePickup.id)}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Complete Pickup
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={() => window.location.href = `/driver/pickup/${activePickup.id}`}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">No Active Pickup</h3>
                                <p className="text-sm text-gray-600">You're currently not on any pickup job</p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => window.location.href = '/driver/available'}
                        >
                            Find Pickups
                        </Button>
                    </div>
                </Card>
            )}

            {/* Quick Actions & Next Pickup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => typeof action.action === 'function' ? action.action() : window.location.href = action.action}
                                className={`
                  w-full p-4 rounded-lg border text-left transition-colors
                  ${action.variant === 'primary'
                                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }
                `}
                            >
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${action.variant === 'primary' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                        <div className={action.variant === 'primary' ? 'text-blue-600' : 'text-gray-600'}>
                                            {action.icon}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">{action.title}</p>
                                        <p className="text-sm text-gray-600">{action.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Next Pickup */}
                {nextPickup && (
                    <Card className="lg:col-span-2 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Next Scheduled Pickup</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartPickup(nextPickup.id)}
                            >
                                Start Pickup
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="shrink-0 mt-1">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{nextPickup.userName}</p>
                                        <span className="text-sm text-gray-500">
                                            {new Date(nextPickup.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{nextPickup.address}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            {nextPickup.wasteType}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {nextPickup.estimatedDuration} min • {nextPickup.distance.toFixed(1)} miles
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        <span>ETA: 15 minutes</span>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => window.location.href = `/driver/pickup/${nextPickup.id}`}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Performance Tips */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">Performance Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="font-semibold text-blue-900">Higher Ratings</h3>
                        </div>
                        <p className="text-sm text-blue-800">
                            Arrive 5 minutes early and communicate with customers for better ratings
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-green-900">Earn More</h3>
                        </div>
                        <p className="text-sm text-green-800">
                            Complete 3+ pickups during peak hours (10 AM - 2 PM) for bonus earnings
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Shield className="w-5 h-5 text-purple-600 mr-2" />
                            <h3 className="font-semibold text-purple-900">Safety First</h3>
                        </div>
                        <p className="text-sm text-purple-800">
                            Always wear PPE when handling waste and follow safety guidelines
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DriverDashboardPage;