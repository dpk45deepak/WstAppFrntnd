// src/pages/admin/UsersManagementPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  MoreVertical,
  Sparkles,
  BarChart3,
  AlertCircle,
  ChevronRight,
  Zap,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "driver" | "admin";
  phone?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
  pickupCount?: number;
  totalSpent?: number;
  avgRating?: number;
  profileImage?: string;
}

const UsersManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToAction, setUserToAction] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "suspended" | "premium"
  >("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter, roleFilter, activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      // Simulate additional data
      const usersWithDetails = response.data.users.map((user: User) => ({
        ...user,
        pickupCount: Math.floor(Math.random() * 50),
        totalSpent: Math.floor(Math.random() * 5000),
        avgRating: Math.random() * 5,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      }));
      setUsers(usersWithDetails);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.phone?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (activeTab === "active") {
      filtered = filtered.filter((u) => u.status === "active");
    } else if (activeTab === "suspended") {
      filtered = filtered.filter((u) => u.status === "suspended");
    } else if (activeTab === "premium") {
      filtered = filtered.filter((u) => (u.totalSpent || 0) > 1000);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (
    action: "activate" | "suspend" | "delete",
    userId: string,
  ) => {
    try {
      switch (action) {
        case "activate":
          await api.put(`/admin/users/${userId}/activate`);
          showToast("User activated successfully", "success");
          break;
        case "suspend":
          await api.put(`/admin/users/${userId}/suspend`);
          showToast("User suspended successfully", "warning");
          break;
        case "delete":
          await api.delete(`/admin/users/${userId}`);
          showToast("User deleted successfully", "success");
          break;
      }
      fetchUsers();
      setSelectedUsers([]);
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} user`, "error");
    }
  };

  const handleBulkAction = async (
    action: "activate" | "suspend" | "delete",
  ) => {
    if (selectedUsers.length === 0) {
      showToast("Please select users first", "warning");
      return;
    }

    const confirmMessage = {
      activate: "Are you sure you want to activate selected users?",
      suspend: "Are you sure you want to suspend selected users?",
      delete:
        "Are you sure you want to delete selected users? This cannot be undone.",
    }[action];

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.post("/admin/users/bulk-action", {
        userIds: selectedUsers,
        action,
      });
      showToast(`Users ${action}d successfully`, "success");
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} users`, "error");
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleExportData = async () => {
    try {
      showToast("Generating user report...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("User report exported successfully", "success");
    } catch (error) {
      showToast("Failed to export report", "error");
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: {
        color: "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
        icon: <CheckCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-teal-500/30",
      },
      inactive: {
        color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
        icon: null,
        glow: "",
      },
      suspended: {
        color: "bg-gradient-to-r from-rose-500 to-rose-600 text-white",
        icon: <XCircle className="w-3 h-3" />,
        glow: "shadow-lg shadow-rose-500/30",
      },
    };
    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.glow} transition-all duration-300 hover:scale-105`}
      >
        {config.icon && (
          <span className="mr-1.5 animate-pulse">{config.icon}</span>
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: User["role"]) => {
    const roleConfig = {
      user: {
        color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
        icon: <Users className="w-3 h-3" />,
        glow: "shadow-lg shadow-blue-500/30",
      },
      driver: {
        color: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
        icon: <Shield className="w-3 h-3" />,
        glow: "shadow-lg shadow-indigo-500/30",
      },
      admin: {
        color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
        icon: <Shield className="w-3 h-3" />,
        glow: "shadow-lg shadow-yellow-500/30",
      },
    };
    const config = roleConfig[role];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.glow} transition-all duration-300 hover:scale-105`}
      >
        <span className="mr-1.5">{config.icon}</span>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-spin-slow"></div>
          <UserPlus className="absolute inset-0 m-auto w-10 h-10 text-white animate-bounce-slow" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Loading Users
          </h3>
          <p className="text-gray-500 mt-2">Fetching user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Animated Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-teal-50 to-blue-50 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Users Management
                  </h1>
                  <p className="text-gray-600">
                    Manage and monitor all platform users in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                // variant="gradient"
                // gradient="teal-blue"
                onClick={() => (window.location.href = "/admin/users/add")}
                className="group relative overflow-hidden"
              >
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                Add New User
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                className="group"
              >
                <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Users",
            value: users.length,
            change: "+8.2%",
            icon: <Users className="w-6 h-6" />,
            color: "from-teal-500 to-teal-600",
            metric: "All time",
          },
          {
            label: "Active Users",
            value: users.filter((u) => u.status === "active").length,
            change: "+12.5%",
            icon: <UserCheck className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            metric: "Currently active",
          },
          {
            label: "Total Revenue",
            value: `$${(users.reduce((acc, u) => acc + (u.totalSpent || 0), 0) / 1000).toFixed(1)}K`,
            change: "+18.3%",
            icon: <BarChart3 className="w-6 h-6" />,
            color: "from-rose-500 to-rose-600",
            metric: "From users",
          },
          {
            label: "Avg. Rating",
            value: `${(users.reduce((acc, u) => acc + (u.avgRating || 0), 0) / users.length || 0).toFixed(1)}`,
            change: "+2.1%",
            icon: <Sparkles className="w-6 h-6" />,
            color: "from-indigo-500 to-indigo-600",
            metric: "User satisfaction",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden"
          >
            <div className="relative">
              <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:scale-125 transition-transform duration-500`}
              ></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        stat.change.startsWith("+")
                          ? "text-teal-600 bg-teal-50"
                          : "text-rose-600 bg-rose-50"
                      }`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 inline mr-1 ${stat.change.startsWith("+") ? "" : "rotate-180"}`}
                      />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.metric}</p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs & Filters */}
      <Card className="overflow-hidden">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Users", count: users.length },
                {
                  id: "active",
                  label: "Active",
                  count: users.filter((u) => u.status === "active").length,
                },
                {
                  id: "suspended",
                  label: "Suspended",
                  count: users.filter((u) => u.status === "suspended").length,
                },
                {
                  id: "premium",
                  label: "Premium",
                  icon: <Sparkles className="w-3 h-3" />,
                  count: users.filter((u) => (u.totalSpent || 0) > 1000).length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-white/20" : "bg-gray-100"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.icon && <span>{tab.icon}</span>}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* View Toggle & Refresh */}
            <div className="flex items-center space-x-3">
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-teal-50 text-teal-600" : "text-gray-600"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-teal-50 text-teal-600" : "text-gray-600"}`}
                >
                  List
                </button>
              </div>
              <Button
              // variant="ghost"
              onClick={fetchUsers} className="group">
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="driver">Drivers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="border-2 border-teal-500 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedUsers.length} user
                  {selectedUsers.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-sm text-gray-600">
                  Perform bulk actions on selected users
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("activate")}
                className="group"
              >
                <CheckCircle className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("suspend")}
                className="group"
              >
                <Lock className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                Suspend
              </Button>
              <Button
                size="sm"
                // variant="gradient"
                // gradient="rose-rose"
                onClick={() => handleBulkAction("delete")}
                className="group relative overflow-hidden"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className={`group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border ${
                  selectedUsers.includes(user.id)
                    ? "border-teal-500 border-2"
                    : "border-gray-100"
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer transform scale-0 group-hover:scale-100 transition-transform"
                  />
                </div>

                {/* User Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg"
                      />
                      {user.status === "active" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                        {user.name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                  </div>
                  {(user.totalSpent || 0) > 1000 && (
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-medium rounded-full">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Premium
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <Mail className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-600 truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                        <Phone className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mr-3">
                      <Calendar className="w-3 h-3 text-rose-600" />
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {user.lastLogin && (
                        <div className="text-xs text-gray-500">
                          Last login:{" "}
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {user.pickupCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pickups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      ${(user.totalSpent || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {user.avgRating ? user.avgRating.toFixed(1) : "-"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Rating</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        // variant="ghost"
                        onClick={() =>
                          (window.location.href = `/admin/users/${user.id}`)
                        }
                        className="group"
                      >
                        <Eye className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      </Button>
                      <Button
                        size="sm"
                        // variant="ghost"
                        onClick={() =>
                          (window.location.href = `/admin/users/${user.id}/edit`)
                        }
                        className="group"
                      >
                        <Edit className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.id !== currentUser?.id && (
                        <>
                          {user.status === "suspended" ? (
                            <Button
                              size="sm"
                              // variant="gradient"
                              // gradient="teal-blue"
                              onClick={() =>
                                handleUserAction("activate", user.id)
                              }
                              className="group relative overflow-hidden"
                            >
                              <Unlock className="w-3 h-3 mr-1" />
                              Activate
                              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUserAction("suspend", user.id)
                              }
                              className="group"
                            >
                              <Lock className="w-3 h-3 mr-1 group-hover:scale-125 transition-transform" />
                              Suspend
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setUserToAction(user);
                              setShowDeleteModal(true);
                            }}
                            className="group"
                          >
                            <Trash2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
                  <Users className="relative w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "No users match your search criteria. Try different keywords or filters."
                    : "Start by adding your first user to the platform."}
                </p>
                <Button
                  // variant="gradient"
                  // gradient="teal-blue"
                  onClick={() => (window.location.href = "/admin/users/add")}
                  className="group"
                >
                  <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Add First User
                </Button>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Activity
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors group ${
                      selectedUsers.includes(user.id) ? "bg-teal-50" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl border-2 border-white shadow"
                          />
                          {user.status === "active" && (
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-2" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {user.pickupCount || 0} pickups
                        </div>
                        <div className="text-gray-500">
                          ${(user.totalSpent || 0).toLocaleString()} spent
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          // variant="ghost"
                          onClick={() =>
                            (window.location.href = `/admin/users/${user.id}`)
                          }
                          className="group"
                        >
                          <Eye className="w-3 h-3 group-hover:scale-125 transition-transform" />
                        </Button>
                        <Button
                          size="sm"
                          // variant="ghost"
                          onClick={() =>
                            (window.location.href = `/admin/users/${user.id}/edit`)
                          }
                          className="group"
                        >
                          <Edit className="w-3 h-3 group-hover:scale-125 transition-transform" />
                        </Button>
                        {user.id !== currentUser?.id && (
                          <>
                            {user.status === "suspended" ? (
                              <Button
                                size="sm"
                                // variant="gradient"
                                // gradient="teal-blue"
                                onClick={() =>
                                  handleUserAction("activate", user.id)
                                }
                              >
                                Activate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUserAction("suspend", user.id)
                                }
                              >
                                Suspend
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <Card className="w-full max-w-md transform scale-100 animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 mb-4">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {userToAction.name}
                </span>
                ? This action cannot be undone and will permanently remove all
                user data.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToAction(null);
                  }}
                  className="group"
                >
                  Cancel
                </Button>
                <Button
                  // variant="gradient"
                  // gradient="rose-rose"
                  onClick={() => {
                    handleUserAction("delete", userToAction.id);
                    setShowDeleteModal(false);
                    setUserToAction(null);
                  }}
                  className="group relative overflow-hidden"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => (window.location.href = "/admin/users/add")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-bounce-slow z-50 group"
      >
        <UserPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        <div className="absolute -inset-4 bg-teal-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
      </button>
    </div>
  );
};

export default UsersManagementPage;
