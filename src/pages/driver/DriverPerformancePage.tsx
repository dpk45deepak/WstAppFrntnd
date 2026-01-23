// src/pages/driver/DriverPerformancePage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Star,
    Target,
    Clock,
    DollarSign,
    CheckCircle,
    Package,
    Shield,
    Zap,
    Sparkles,
    Trophy,
    Medal,
    Crown,
    BarChart3,
    Activity,
    RefreshCw,
    ChevronRight,
    Download,
    Share2,
    Eye,
    EyeOff,
    Target as TargetIcon,
    Leaf,
} from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface PerformanceStats {
    totalPickups: number;
    completedPickups: number;
    totalEarnings: number;
    averageRating: number;
    acceptanceRate: number;
    onTimeRate: number;
    safetyScore: number;
    efficiencyScore: number;
    weeklyGoal: number;
    currentWeekProgress: number;
    peakHours: string[];
    topAreas: { area: string; count: number }[];
}

interface PerformanceHistory {
    date: string;
    pickups: number;
    earnings: number;
    rating: number;
    onTimeRate: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    achieved: boolean;
    progress: number;
    target: number;
    reward: string;
    color: string;
}

interface PerformanceTip {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    category: 'earnings' | 'rating' | 'efficiency' | 'safety';
}

const DriverPerformancePage: React.FC = () => {
    //   const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<PerformanceStats | null>(null);
    const [history, setHistory] = useState<PerformanceHistory[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
    const [selectedMetric, setSelectedMetric] = useState<'pickups' | 'earnings' | 'rating'>('pickups');
    const [showDetails, setShowDetails] = useState(false);
    const [animatedValues, setAnimatedValues] = useState({
        pickups: 0,
        earnings: 0,
        rating: 0,
        onTimeRate: 0
    });

    useEffect(() => {
        fetchPerformanceData();
    }, [timeRange]);

    useEffect(() => {
        if (stats) {
            animateValues();
        }
    }, [stats]);

    const fetchPerformanceData = async () => {
        setLoading(true);
        try {
            // Mock data for demonstration
            const mockStats: PerformanceStats = {
                totalPickups: 456,
                completedPickups: 450,
                totalEarnings: 12450.75,
                averageRating: 4.8,
                acceptanceRate: 96,
                onTimeRate: 98,
                safetyScore: 95,
                efficiencyScore: 92,
                weeklyGoal: 25,
                currentWeekProgress: 18,
                peakHours: ['09:00-11:00', '14:00-16:00', '18:00-20:00'],
                topAreas: [
                    { area: 'Downtown', count: 156 },
                    { area: 'Northside', count: 98 },
                    { area: 'East Bay', count: 87 },
                    { area: 'West District', count: 65 },
                    { area: 'South Park', count: 50 }
                ]
            };

            const mockHistory: PerformanceHistory[] = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return {
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    pickups: Math.floor(Math.random() * 10) + 15,
                    earnings: Math.floor(Math.random() * 500) + 300,
                    rating: 4.5 + Math.random() * 0.5,
                    onTimeRate: 90 + Math.random() * 10
                };
            });

            setStats(mockStats);
            setHistory(mockHistory);
        } catch (error: any) {
            showToast(error.message || 'Failed to load performance data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await fetchPerformanceData();
        setRefreshing(false);
        showToast('Performance data refreshed', 'success');
    };

    const animateValues = () => {
        if (!stats) return;

        setTimeout(() => setAnimatedValues(v => ({ ...v, pickups: stats.completedPickups })), 300);
        setTimeout(() => setAnimatedValues(v => ({ ...v, earnings: stats.totalEarnings })), 600);
        setTimeout(() => setAnimatedValues(v => ({ ...v, rating: stats.averageRating })), 900);
        setTimeout(() => setAnimatedValues(v => ({ ...v, onTimeRate: stats.onTimeRate })), 1200);
    };

    const achievements: Achievement[] = [
        {
            id: 'first_100',
            title: 'Centurion',
            description: 'Complete 100 pickups',
            icon: <Trophy className="w-6 h-6" />,
            achieved: true,
            progress: 100,
            target: 100,
            reward: 'Elite Badge',
            color: 'from-amber-500 to-yellow-400'
        },
        {
            id: 'perfect_week',
            title: 'Perfect Week',
            description: '100% on-time rate for a week',
            icon: <Medal className="w-6 h-6" />,
            achieved: true,
            progress: 100,
            target: 100,
            reward: 'Bonus $100',
            color: 'from-teal-500 to-blue-400'
        },
        {
            id: 'safety_streak',
            title: 'Safety Streak',
            description: '30 days without incidents',
            icon: <Shield className="w-6 h-6" />,
            achieved: false,
            progress: 85,
            target: 100,
            reward: 'Safety Award',
            color: 'from-green-500 to-teal-400'
        },
        {
            id: 'rating_star',
            title: '5-Star Rating',
            description: 'Maintain 5.0 rating for a month',
            icon: <Star className="w-6 h-6" />,
            achieved: false,
            progress: 60,
            target: 100,
            reward: 'Premium Status',
            color: 'from-rose-500 to-indigo-400'
        },
        {
            id: 'peak_performer',
            title: 'Peak Performer',
            description: 'Complete 50 pickups in peak hours',
            icon: <Zap className="w-6 h-6" />,
            achieved: false,
            progress: 42,
            target: 50,
            reward: '15% Bonus Rate',
            color: 'from-purple-500 to-pink-400'
        },
        {
            id: 'eco_champion',
            title: 'Eco Champion',
            description: 'Divert 5000kg from landfills',
            icon: <Leaf className="w-6 h-6" />,
            achieved: true,
            progress: 100,
            target: 100,
            reward: 'Eco Badge',
            color: 'from-green-600 to-emerald-400'
        }
    ];

    const performanceTips: PerformanceTip[] = [
        {
            title: 'Early Arrival',
            description: 'Arrive 5 minutes early for pickups to improve on-time rate',
            impact: 'high',
            category: 'rating'
        },
        {
            title: 'Route Optimization',
            description: 'Group nearby pickups to reduce travel time',
            impact: 'high',
            category: 'efficiency'
        },
        {
            title: 'Customer Communication',
            description: 'Send arrival notifications 5 minutes before pickup',
            impact: 'medium',
            category: 'rating'
        },
        {
            title: 'Peak Hour Focus',
            description: 'Schedule pickups during 2-4 PM when demand is highest',
            impact: 'high',
            category: 'earnings'
        },
        {
            title: 'Safety Checks',
            description: 'Perform daily vehicle safety inspections',
            impact: 'medium',
            category: 'safety'
        },
        {
            title: 'Weekend Premium',
            description: 'Work weekends for 25% higher earnings',
            impact: 'medium',
            category: 'earnings'
        }
    ];

    const metricCards = [
        {
            title: 'Completed Pickups',
            value: animatedValues.pickups,
            icon: <Package className="w-6 h-6" />,
            color: 'from-blue-500 to-teal-400',
            change: '+12%',
            trend: 'up' as const,
            description: 'Total successful pickups'
        },
        {
            title: 'Total Earnings',
            value: `$${animatedValues.earnings.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'from-green-500 to-teal-400',
            change: '+18%',
            trend: 'up' as const,
            description: 'Lifetime earnings'
        },
        {
            title: 'Average Rating',
            value: animatedValues.rating.toFixed(1),
            icon: <Star className="w-6 h-6" />,
            color: 'from-amber-500 to-yellow-400',
            change: '+0.2',
            trend: 'up' as const,
            description: 'Customer satisfaction'
        },
        {
            title: 'On-time Rate',
            value: `${animatedValues.onTimeRate}%`,
            icon: <Clock className="w-6 h-6" />,
            color: 'from-teal-500 to-blue-400',
            change: '+3%',
            trend: 'up' as const,
            description: 'Punctuality performance'
        }
    ];

    const efficiencyCards = [
        {
            title: 'Acceptance Rate',
            value: `${stats?.acceptanceRate || 0}%`,
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'from-green-500 to-teal-400',
            target: '98%',
            description: 'Pickup requests accepted'
        },
        {
            title: 'Safety Score',
            value: `${stats?.safetyScore || 0}%`,
            icon: <Shield className="w-6 h-6" />,
            color: 'from-blue-500 to-indigo-400',
            target: '100%',
            description: 'Safety compliance rating'
        },
        {
            title: 'Efficiency Score',
            value: `${stats?.efficiencyScore || 0}%`,
            icon: <Zap className="w-6 h-6" />,
            color: 'from-purple-500 to-pink-400',
            target: '95%',
            description: 'Route optimization rating'
        },
        {
            title: 'Weekly Progress',
            value: `${stats?.currentWeekProgress || 0}/${stats?.weeklyGoal || 0}`,
            icon: <Target className="w-6 h-6" />,
            color: 'from-rose-500 to-indigo-400',
            target: `${stats?.weeklyGoal || 0}`,
            description: 'Pickups this week'
        }
    ];

    // Chart data
    const lineChartData = {
        labels: history.map(h => h.date),
        datasets: [
            {
                label: selectedMetric === 'pickups' ? 'Pickups' : selectedMetric === 'earnings' ? 'Earnings ($)' : 'Rating',
                data: history.map(h =>
                    selectedMetric === 'pickups' ? h.pickups :
                        selectedMetric === 'earnings' ? h.earnings : h.rating
                ),
                borderColor: 'rgb(20, 184, 166)',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }
        ]
    };

    const areaChartData = {
        labels: stats?.topAreas.map(a => a.area) || [],
        datasets: [{
            data: stats?.topAreas.map(a => a.count) || [],
            backgroundColor: [
                'rgba(20, 184, 166, 0.8)',
                'rgba(6, 182, 212, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
                'rgb(20, 184, 166)',
                'rgb(6, 182, 212)',
                'rgb(59, 130, 246)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)'
            ],
            borderWidth: 2
        }]
    };

    const doughnutData = {
        labels: ['On-time', 'Late (<15min)', 'Late (>15min)'],
        datasets: [{
            data: [stats?.onTimeRate || 0, 2, 0],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)'
            ],
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" text="Loading performance analytics..." />
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
                            <BarChart3 className="w-8 h-8 text-teal-600" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                            <p className="text-gray-600">Track your progress, earnings, and improvement opportunities</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refreshData}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </motion.button>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        {(['week', 'month', 'quarter'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                        ? 'bg-white text-teal-700 shadow'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-teal-500 to-blue-500 text-white rounded-xl font-medium shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </motion.button>
                </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {metricCards.map((card, index) => (
                    <motion.div
                        key={index}
                        // variants={itemVariants}
                        custom={index * 0.1}
                        whileHover={{
                            y: -8,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                    >
                        <Card
                            className={`h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50 overflow-hidden group hover:shadow-xl transition-all duration-300`}
                        >
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-xl bg-linear-to-br ${card.color} shadow-md`}>
                                        {card.icon}
                                    </div>
                                    <div className="flex items-center">
                                        {card.trend === 'up' ? (
                                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-rose-500 mr-1" />
                                        )}
                                        <span className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-700' : 'text-rose-700'}`}>
                                            {card.change}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-gray-500 mb-2">{card.title}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                </div>

                                <p className="text-sm text-gray-500 mt-2">{card.description}</p>

                                <motion.div
                                    className="h-1 w-full bg-linear-to-r from-gray-200 to-gray-200 rounded-full mt-4 overflow-hidden"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                >
                                    <div className={`h-full bg-linear-to-r ${card.color} rounded-full`} />
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Performance Trend</h2>
                                <p className="text-gray-600">Your progress over the last 7 days</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {(['pickups', 'earnings', 'rating'] as const).map((metric) => (
                                    <button
                                        key={metric}
                                        onClick={() => setSelectedMetric(metric)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedMetric === metric
                                                ? 'bg-linear-to-r from-teal-500 to-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-64">
                            <Line data={lineChartData} options={chartOptions} />
                        </div>

                        <div className="mt-6 grid grid-cols-4 gap-4">
                            {history.slice(-4).map((day, index) => (
                                <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm font-medium text-gray-900">{day.date}</p>
                                    <p className="text-lg font-bold text-teal-600">
                                        {selectedMetric === 'pickups' ? day.pickups :
                                            selectedMetric === 'earnings' ? `$${day.earnings}` : day.rating.toFixed(1)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Efficiency Metrics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Efficiency Metrics</h2>
                                <p className="text-gray-600">Key performance indicators</p>
                            </div>
                            <Activity className="w-6 h-6 text-teal-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {efficiencyCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-teal-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-linear-to-br ${card.color}`}>
                                            {card.icon}
                                        </div>
                                        <div className="text-sm text-gray-500">Target: {card.target}</div>
                                    </div>

                                    <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>

                                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${parseInt(card.value) || 0}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                                            className={`h-full rounded-full bg-linear-to-r ${card.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Service Areas */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Service Areas</h3>
                            <div className="h-48">
                                <Bar data={areaChartData} options={chartOptions} />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Achievements & Performance Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Achievements & Goals</h2>
                                <p className="text-gray-600">Track your progress and earn rewards</p>
                            </div>
                            <Crown className="w-6 h-6 text-amber-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-xl border-2 ${achievement.achieved
                                            ? 'border-teal-300 bg-linear-to-br from-teal-50 to-white'
                                            : 'border-gray-100 bg-white'
                                        } hover:shadow-lg transition-all duration-300`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-lg bg-linear-to-br ${achievement.color}`}>
                                            {achievement.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${achievement.achieved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {achievement.reward}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-bold text-gray-900">
                                                {achievement.progress}/{achievement.target}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                                className={`h-full rounded-full bg-linear-to-r ${achievement.color}`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Overall Achievement Score</p>
                                    <p className="text-xs text-gray-600">Based on completed goals</p>
                                </div>
                                <div className="text-2xl font-bold text-teal-600">68%</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Performance Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card className="h-full border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Performance Tips</h2>
                                <p className="text-gray-600">Actionable insights to improve your metrics</p>
                            </div>
                            <TargetIcon className="w-6 h-6 text-rose-500" />
                        </div>

                        <div className="space-y-4">
                            {performanceTips.map((tip, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-teal-300 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-gray-900">{tip.title}</h3>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${tip.impact === 'high' ? 'bg-green-100 text-green-800' :
                                                tip.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {tip.impact === 'high' ? 'High Impact' : tip.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{tip.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${tip.category === 'earnings' ? 'bg-teal-100 text-teal-800' :
                                                tip.category === 'rating' ? 'bg-amber-100 text-amber-800' :
                                                    tip.category === 'efficiency' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {tip.category === 'earnings' ? <DollarSign className="w-4 h-4" /> :
                                                tip.category === 'rating' ? <Star className="w-4 h-4" /> :
                                                    tip.category === 'efficiency' ? <Zap className="w-4 h-4" /> :
                                                        <Shield className="w-4 h-4" />}
                                            {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                                        </div>

                                        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Apply Tip
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600">Peak Hours</p>
                                    <p className="font-bold text-gray-900">2-4 PM</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600">Best Day</p>
                                    <p className="font-bold text-gray-900">Saturday</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600">Avg Time/Pickup</p>
                                    <p className="font-bold text-gray-900">28 min</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600">Customer Rating</p>
                                    <p className="font-bold text-gray-900">4.8/5.0</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Detailed Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="border-2 border-gray-100 bg-linear-to-b from-white to-gray-50/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Detailed Analytics</h2>
                            <p className="text-gray-600">In-depth performance breakdown</p>
                        </div>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8"
                            >
                                {/* On-time Performance */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">On-time Performance Breakdown</h3>
                                        <div className="h-64">
                                            <Doughnut data={doughnutData} options={chartOptions} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-green-800">On-time Pickups</span>
                                                <span className="font-bold text-green-800">{stats?.onTimeRate || 0}%</span>
                                            </div>
                                            <p className="text-sm text-green-700">
                                                Excellent! You're consistently on time for pickups.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-amber-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-amber-800">Slightly Late less then (15min)</span>
                                                <span className="font-bold text-amber-800">2%</span>
                                            </div>
                                            <p className="text-sm text-amber-700">
                                                Try to leave 5 minutes earlier to avoid traffic delays.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-rose-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-rose-800">Significantly Late</span>
                                                <span className="font-bold text-rose-800">0%</span>
                                            </div>
                                            <p className="text-sm text-rose-700">
                                                Perfect record! Keep up the excellent punctuality.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Peak Hours Analysis */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Peak Hours Analysis</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {stats?.peakHours.map((hours, index) => (
                                            <div key={index} className="p-4 bg-linear-to-br from-blue-50 to-teal-50 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="font-bold text-gray-900">{hours}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    High demand period - 35% more pickups available
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Environmental Impact */}
                                <div className="p-6 bg-linear-to-r from-teal-50 to-green-50 rounded-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Environmental Impact</h3>
                                            <p className="text-gray-600">Your contribution to sustainability</p>
                                        </div>
                                        <Leaf className="w-8 h-8 text-green-600" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center p-6 bg-white rounded-xl">
                                            <div className="text-3xl font-bold text-teal-600 mb-2">12,450</div>
                                            <div className="text-sm text-gray-600">KG Waste Diverted</div>
                                        </div>
                                        <div className="text-center p-6 bg-white rounded-xl">
                                            <div className="text-3xl font-bold text-green-600 mb-2">6,225</div>
                                            <div className="text-sm text-gray-600">KG CO₂ Saved</div>
                                        </div>
                                        <div className="text-center p-6 bg-white rounded-xl">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">31</div>
                                            <div className="text-sm text-gray-600">Tree Equivalents</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-600">
                                            Your efforts have prevented 12.5 tons of waste from reaching landfills
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
            >
                <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-500" />
                        <span>Performance score: <span className="font-bold text-teal-600">92/100</span></span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                        Share Report
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DriverPerformancePage;