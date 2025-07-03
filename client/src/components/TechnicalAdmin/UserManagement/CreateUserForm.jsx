import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader, CheckCircle, Mail, AlertTriangle } from 'lucide-react';

const CreateUserForm = ({ onSubmit, committees }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    committeeId: '',
    userType: ''
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog instead of immediate submission
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      
      // Show success notification
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500" size={18} />
          <div>
            <p className="font-semibold">User created successfully!</p>
            <p className="text-sm">An email has been sent with login credentials.</p>
          </div>
        </div>
      );
      
      // Reset form after successful creation
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        committeeId: '',
        userType: ''
      });
    } catch (error) {
      // Show error notification
      toast.error(
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <div>
            <p className="font-semibold">Failed to create user</p>
            <p className="text-sm">{error.message || 'Please try again'}</p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-3">Confirm User Creation</h3>
            <p className="mb-4">
              Are you sure you want to create an account for <strong>{formData.firstName} {formData.lastName}</strong>?
            </p>
            <p className="mb-4 text-sm flex items-center gap-2">
              <Mail size={16} className="text-blue-500" />
              An email with login credentials will be sent to <strong>{formData.email}</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Confirm & Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="COMMITTEE_MEMBER">Committee Member</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
        
        {formData.role === 'COMMITTEE_MEMBER' && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="committeeId">
              Committee
            </label>
            <select
              id="committeeId"
              name="committeeId"
              value={formData.committeeId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Committee</option>
              {committees.map(committee => (
                <option key={committee.committee_id} value={committee.committee_id}>
                  {committee.committee_name} ({committee.committee_type})
                </option>
              ))}
            </select>
          </div>
        )}
        
        {formData.role === 'ADMIN' && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
              Admin Type
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Admin Type</option>
              <option value="ERC_TECHNICAL">ERC Technical</option>
              <option value="ERC_ADMINISTRATIVE">ERC Administrative</option>
            </select>
          </div>
        )}
        
        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;