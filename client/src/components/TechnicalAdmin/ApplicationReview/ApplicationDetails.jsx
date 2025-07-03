// src/components/TechnicalAdmin/ApplicationReview/ApplicationDetails.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';

const ApplicationDetails = ({ application, onReview, onSendEmail }) => {
  const [reviewData, setReviewData] = useState({
    status: '',
    comments: ''
  });
  
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    onReview(application.application_id, reviewData);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    onSendEmail(application.application_id, emailData);
    setShowEmailForm(false);
    setEmailData({ subject: '', message: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6 pb-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Application #{application.application_id}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {application.status?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Applicant Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {application.applicant?.first_name} {application.applicant?.last_name}</p>
            <p><span className="font-medium">Email:</span> {application.applicant?.email}</p>
            <p><span className="font-medium">ID:</span> {application.applicant?.applicant_id}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Application Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Research Type:</span> {application.research_type}</p>
            <p><span className="font-medium">Application Type:</span> {application.application_type}</p>
            <p><span className="font-medium">Submitted:</span> {formatDate(application.submission_date)}</p>
            <p><span className="font-medium">Last Updated:</span> {formatDate(application.last_updated)}</p>
            <p><span className="font-medium">Expiry Date:</span> {formatDate(application.expiry_date)}</p>
          </div>
        </div>
      </div>
      
      {application.admin_comments && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-semibold mb-2">Admin Comments</h3>
          <p className="text-gray-700">{application.admin_comments}</p>
        </div>
      )}
      
      {application.documents && application.documents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {application.documents.map((doc, index) => (
                <li key={index} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{doc.document_type}</p>
                    <p className="text-sm text-gray-500">Uploaded: {formatDate(doc.upload_date)}</p>
                  </div>
                  <a 
                    href={doc.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Document
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {showEmailForm ? (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">Send Email to Applicant</h3>
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={emailData.subject}
                onChange={handleEmailChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={emailData.message}
                onChange={handleEmailChange}
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <Send size={16} className="mr-2" /> Send Email
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowEmailForm(true)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Send size={16} className="mr-1" /> Send Email to Applicant
        </button>
      )}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Review Application</h3>
        <form onSubmit={handleReviewSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={reviewData.status}
              onChange={handleReviewChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Status</option>
              <option value="DOCUMENT_CHECK">Document Check</option>
              <option value="PRELIMINARY_REVIEW">Preliminary Review</option>
              <option value="ERC_REVIEW">ERC Review</option>
              <option value="RETURNED_FOR_RESUBMISSION">Return for Resubmission</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={reviewData.comments}
              onChange={handleReviewChange}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className={`py-2 px-4 rounded font-bold flex items-center ${
                reviewData.status === 'APPROVED' ? 'bg-green-500 hover:bg-green-700 text-white' : 
                reviewData.status === 'REJECTED' ? 'bg-red-500 hover:bg-red-700 text-white' :
                'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              {reviewData.status === 'APPROVED' ? (
                <><CheckCircle size={16} className="mr-2" /> Approve</>
              ) : reviewData.status === 'REJECTED' ? (
                <><XCircle size={16} className="mr-2" /> Reject</>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationDetails;