import React, { useState, useMemo } from 'react';
import { Eye, CheckCircle, XCircle, Trash2, AlertTriangle, Search, Filter, X, ListFilter, List } from 'lucide-react';

const UserList = ({ users, onUpdateStatus, onDeleteUser }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ type: null, userId: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [groupByRole, setGroupByRole] = useState(true); // Toggle for grouping

    // Handle confirmation dialog showing
    const handleConfirmationShow = (actionType, userId) => {
        setConfirmAction({ type: actionType, userId });
        setShowConfirmation(true);
    };

    // Execute the confirmed action
    const handleConfirmedAction = () => {
        if (confirmAction.type === 'delete') {
            onDeleteUser(confirmAction.userId);
        } else if (confirmAction.type === 'block') {
            onUpdateStatus(confirmAction.userId, 'block');
        } else if (confirmAction.type === 'unblock') {
            onUpdateStatus(confirmAction.userId, 'unblock');
        }
        setShowConfirmation(false);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setFilterRole('');
        setFilterStatus('');
    };

    // Get unique roles from users array
    const uniqueRoles = useMemo(() => {
        const roles = [...new Set(users.map(user => user.role))];
        return roles.sort();
    }, [users]);

    // Filter users based on search query and filters
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Search query filter
            const matchesSearch = searchQuery === '' || 
                user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.user_id.toString().includes(searchQuery);
            
            // Role filter
            const matchesRole = filterRole === '' || user.role === filterRole;
            
            // Status filter
            const matchesStatus = filterStatus === '' || 
                (filterStatus === 'active' && user.validity) ||
                (filterStatus === 'blocked' && !user.validity);
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, filterRole, filterStatus]);

    // Group users by role
    const usersByRole = useMemo(() => {
        const grouped = {};
        
        if (filterRole) {
            // If filtering by role, don't group
            return { [filterRole]: filteredUsers };
        }
        
        filteredUsers.forEach(user => {
            if (!grouped[user.role]) {
                grouped[user.role] = [];
            }
            grouped[user.role].push(user);
        });
        
        // Sort roles alphabetically
        return Object.keys(grouped)
            .sort()
            .reduce((acc, role) => {
                acc[role] = grouped[role];
                return acc;
            }, {});
    }, [filteredUsers, filterRole]);

    // Cancel the confirmation dialog
    const handleCancelAction = () => {
        setShowConfirmation(false);
    };

    // Get the confirmation message based on action type
    const getConfirmationMessage = () => {
        const user = users.find(u => u.user_id === confirmAction.userId);
        const name = user ? `${user.first_name} ${user.last_name}` : 'this user';
        
        switch (confirmAction.type) {
            case 'delete':
                return {
                    title: 'Confirm User Deletion',
                    message: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
                    actionText: 'Delete User',
                    icon: <Trash2 className="text-red-500" size={24} />,
                    buttonClass: 'bg-red-500 hover:bg-red-600'
                };
            case 'block':
                return {
                    title: 'Confirm User Block',
                    message: `Are you sure you want to block ${name}? They will not be able to log in until unblocked.`,
                    actionText: 'Block User',
                    icon: <XCircle className="text-orange-500" size={24} />,
                    buttonClass: 'bg-orange-500 hover:bg-orange-600'
                };
            case 'unblock':
                return {
                    title: 'Confirm User Activation',
                    message: `Are you sure you want to activate ${name}? They will regain access to the system.`,
                    actionText: 'Activate User',
                    icon: <CheckCircle className="text-green-500" size={24} />,
                    buttonClass: 'bg-green-500 hover:bg-green-600'
                };
            default:
                return {
                    title: 'Confirm Action',
                    message: 'Are you sure you want to perform this action?',
                    actionText: 'Confirm',
                    icon: <AlertTriangle className="text-yellow-500" size={24} />,
                    buttonClass: 'bg-blue-500 hover:bg-blue-600'
                };
        }
    };

    // Tooltip component for action buttons
    const Tooltip = ({ children, label }) => {
        return (
            <div className="group relative inline-block">
                {children}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {label}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-800"></div>
                </div>
            </div>
        );
    };

    const confirmationDetails = getConfirmationMessage();
    const hasActiveFilters = searchQuery || filterRole || filterStatus;

    // Render a single user table row
    const renderUserRow = (user) => (
        <tr key={user.user_id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.user_id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.first_name} {user.last_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
            </td>
            {!groupByRole && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role.replace(/_/g, ' ')}
                </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap">
                {user.validity ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Blocked
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                    <Tooltip label="View User Details">
                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            <Eye size={18} />
                        </button>
                    </Tooltip>
                    
                    {user.validity ? (
                        <Tooltip label="Block User Access">
                            <button
                                onClick={() => handleConfirmationShow('block', user.user_id)}
                                className="text-orange-600 hover:text-orange-800 cursor-pointer"
                            >
                                <XCircle size={18} />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip label="Activate User Access">
                            <button
                                onClick={() => handleConfirmationShow('unblock', user.user_id)}
                                className="text-green-600 hover:text-green-800 cursor-pointer"
                            >
                                <CheckCircle size={18} />
                            </button>
                        </Tooltip>
                    )}
                    
                    <Tooltip label="Permanently Delete User">
                        <button
                            onClick={() => handleConfirmationShow('delete', user.user_id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                            <Trash2 size={18} />
                        </button>
                    </Tooltip>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            {confirmationDetails.icon}
                            <h3 className="text-xl font-semibold">{confirmationDetails.title}</h3>
                        </div>
                        
                        <p className="mb-6 text-gray-600">
                            {confirmationDetails.message}
                        </p>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelAction}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmedAction}
                                className={`px-4 py-2 text-white rounded-md ${confirmationDetails.buttonClass}`}
                            >
                                {confirmationDetails.actionText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Role Filter */}
                    <div className="w-full md:w-48">
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>
                                    {role.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-48">
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    {/* Group By Toggle */}
                    <div className="w-full md:w-auto">
                        {/* <Tooltip label={groupByRole ? "Show as flat list" : "Group by role"}> */}
                            <button
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setGroupByRole(!groupByRole)}
                            >
                                {groupByRole ? (
                                    <>
                                        <List size={16} className="mr-2" />
                                        Flat View
                                    </>
                                ) : (
                                    <>
                                        <ListFilter size={16} className="mr-2" />
                                        Group by Role
                                    </>
                                )}
                            </button>
                        {/* </Tooltip> */}
                    </div>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <button
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={resetFilters}
                        >
                            <X size={16} className="mr-2" />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Filter Stats */}
                <div className="mt-2 text-sm text-gray-500">
                    {filteredUsers.length === 0 ? (
                        <p>No users match your search criteria</p>
                    ) : (
                        <p>
                            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                            {hasActiveFilters ? ' with applied filters' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                    No users found. {!hasActiveFilters ? 'Create one to get started.' : 'Try changing your filters.'}
                </div>
            )}

            {/* Grouped View */}
            {filteredUsers.length > 0 && groupByRole && (
                <div>
                    {Object.entries(usersByRole).map(([role, users]) => (
                        <div key={role} className="mb-6">
                            {/* Role Section Header */}
                            <div className="bg-gray-100 px-6 py-3 border-y border-gray-200">
                                <h3 className="font-semibold text-gray-700">
                                    {role.replace(/_/g, ' ')} ({users.length})
                                </h3>
                            </div>
                            
                            {/* Role Users Table */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => renderUserRow(user))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            {/* Non-Grouped View */}
            {filteredUsers.length > 0 && !groupByRole && (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => renderUserRow(user))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;