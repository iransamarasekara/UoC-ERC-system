// src/components/TechnicalAdmin/CommitteeManagement/CommitteeManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommitteeList from './CommitteeList';
import CreateCommitteeForm from './CreateCommitteeForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CommitteeManagement = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/committees`);
      setCommittees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load committees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const handleCreateCommittee = async (committeeData) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/committees`, committeeData);
      fetchCommittees();
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create committee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Committee Management</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showCreateForm ? 'Cancel' : 'Create Committee'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateCommitteeForm onSubmit={handleCreateCommittee} />
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <CommitteeList committees={committees} />
      )}
    </div>
  );
};

export default CommitteeManagement;