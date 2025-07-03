// src/components/TechnicalAdmin/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import CreateUserForm from './CreateUserForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommittees = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/committees`);
      setCommittees(response.data);
    } catch (err) {
      console.error('Failed to load committees:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCommittees();
  }, []);

    const handleCreateUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/users`, userData);
        
        // Refresh the users list after creating a new user
        fetchUsers();
        
        // Return the response for the form component to handle
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Re-throw the error so the form component can handle it
        throw error.response?.data || error;
    }
    };

    const handleDeleteUser = async (userId) => {
    try {
        setLoading(true);
        await axios.delete(`${API_URL}/admin/users/${userId}`);
        
        // Refresh users list after deletion
        fetchUsers();
        
        toast.success('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user: ' + (err.response?.data?.error || err.message));
        toast.error('Failed to delete user');
    } finally {
        setLoading(false);
    }
    };


    const handleUpdateUserStatus = async (userId, action) => {
        try {
        await axios.patch(`${API_URL}/admin/users/status`, { userId, action });
        fetchUsers();
        } catch (err) {
        setError('Failed to update user status');
        console.error(err);
        }
    };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showCreateForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateUserForm 
          onSubmit={handleCreateUser} 
          committees={committees} 
        />
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UserList 
          users={users} 
          onUpdateStatus={handleUpdateUserStatus} 
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;