// src/components/TechnicalAdmin/ApplicationReview/ApplicationReview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationList from './ApplicationList';
import ApplicationDetails from './ApplicationDetails';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: '', page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      params.append('page', filter.page);
      params.append('limit', filter.limit);
      
      const response = await axios.get(`${API_URL}/admin/applications?${params.toString()}`);
      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const handleStatusChange = (e) => {
    setFilter({ ...filter, status: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilter({ ...filter, page: newPage });
    }
  };

  const handleViewApplication = async (applicationId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/applications/${applicationId}`);
      setSelectedApplication(response.data);
    } catch (err) {
      setError('Failed to load application details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (applicationId, reviewData) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/applications/${applicationId}/review`, reviewData);
      fetchApplications();
      setSelectedApplication(null);
    } catch (err) {
      setError('Failed to submit review');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (applicationId, emailData) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/applications/${applicationId}/email`, emailData);
      alert('Email sent successfully');
    } catch (err) {
      setError('Failed to send email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      {selectedApplication ? (
        <div>
          <button 
            onClick={() => setSelectedApplication(null)}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to applications
          </button>
          <ApplicationDetails 
            application={selectedApplication} 
            onReview={handleReviewApplication}
            onSendEmail={handleSendEmail}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Application Review</h1>
            <div className="flex space-x-4">
              <select 
                value={filter.status} 
                onChange={handleStatusChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="DOCUMENT_CHECK">Document Check</option>
                <option value="PRELIMINARY_REVIEW">Preliminary Review</option>
                <option value="ERC_REVIEW">ERC Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <ApplicationList 
                applications={applications} 
                onViewApplication={handleViewApplication} 
              />
              
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePageChange(filter.page - 1)} 
                    disabled={filter.page === 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {filter.page} of {totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(filter.page + 1)} 
                    disabled={filter.page === totalPages}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationReview;