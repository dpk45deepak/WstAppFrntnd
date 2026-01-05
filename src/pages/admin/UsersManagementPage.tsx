// src/pages/admin/UsersManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  // MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'driver' | 'admin';
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  pickupCount?: number;
}

const UsersManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [userToAction, setUserToAction] = useState<User | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (action: 'activate' | 'suspend' | 'delete', userId: string) => {
    try {
      switch (action) {
        case 'activate':
          await api.put(`/admin/users/${userId}/activate`);
          showToast('User activated successfully', 'success');
          break;
        case 'suspend':
          await api.put(`/admin/users/${userId}/suspend`);
          showToast('User suspended successfully', 'warning');
          break;
        case 'delete':
          await api.delete(`/admin/users/${userId}`);
          showToast('User deleted successfully', 'success');
          break;
      }
      fetchUsers();
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} user`, 'error');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'delete') => {
    if (selectedUsers.length === 0) {
      showToast('Please select users first', 'warning');
      return;
    }

    const confirmMessage = {
      activate: 'Are you sure you want to activate selected users?',
      suspend: 'Are you sure you want to suspend selected users?',
      delete: 'Are you sure you want to delete selected users? This cannot be undone.'
    }[action];

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.post('/admin/users/bulk-action', {
        userIds: selectedUsers,
        action
      });
      showToast(`Users ${action}d successfully`, 'success');
      setSelectedUsers([]);
      fetchUsers();
    } catch (error: any) {
      showToast(error.message || `Failed to ${action} users`, 'error');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getStatusBadge = (status: User['status']) => {
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

  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      user: { color: 'bg-blue-100 text-blue-800', icon: <UserPlus className="w-3 h-3" /> },
      driver: { color: 'bg-purple-100 text-purple-800', icon: <Shield className="w-3 h-3" /> },
      admin: { color: 'bg-yellow-100 text-yellow-800', icon: <Shield className="w-3 h-3" /> }
    };
    const config = roleConfig[role];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage and monitor all platform users</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => window.location.href = '/admin/users/add'}
            className="flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
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
                  placeholder="Search users by name, email, or phone..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="driver">Drivers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm font-medium text-blue-900">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('suspend')}
                >
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        {user.status === 'suspended' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUserAction('activate', user.id)}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUserAction('suspend', user.id)}
                          >
                            Suspend
                          </Button>
                        )}
                        {user.id !== currentUser?.id && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setUserToAction(user);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No users found</p>
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

      {/* Delete Modal */}
      {showDeleteModal && userToAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold">{userToAction.name}</span>?
                This action cannot be undone and will permanently remove all user data.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToAction(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleUserAction('delete', userToAction.id);
                    setShowDeleteModal(false);
                    setUserToAction(null);
                  }}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;