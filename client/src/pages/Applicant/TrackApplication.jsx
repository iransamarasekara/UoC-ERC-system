import { useState, useEffect } from "react";
import {
  CheckCircle,
  FileText,
  Share2,
  Clock,
  XCircle,
  Eye,
  Download,
  CreditCard,
  MessageSquare,
  RefreshCw,
  Calendar,
  User,
  AlertCircle,
  Search,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

const steps = [
  {
    id: 1,
    title: "Submitted",
    subtitle: "Application submitted",
    icon: <FileText />,
  },
  {
    id: 2,
    title: "Review",
    subtitle: "Under Reviewing Process",
    icon: <Share2 />,
  },
  {
    id: 3,
    title: "Revisions",
    subtitle: "Revision requested or not",
    icon: <Clock />,
  },
  {
    id: 4,
    title: "Decision",
    subtitle: "Application approved or rejected",
    icon: <CheckCircle />,
  },
];

const TrackApplication = ({ applicationId: propApplicationId }) => {
  const [applicationId, setApplicationId] = useState(propApplicationId || "");
  const [inputApplicationId, setInputApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSearch, setShowSearch] = useState(!propApplicationId);

  // Get application ID from URL parameters if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlApplicationId =
      urlParams.get("applicationId") || urlParams.get("id");

    if (urlApplicationId && !propApplicationId) {
      setApplicationId(urlApplicationId);
      setShowSearch(false);
    }
  }, [propApplicationId]);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationStatus();
    }
  }, [applicationId]);

  const fetchApplicationStatus = async () => {
    if (!applicationId) {
      setError("Please enter an application ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/applications/applications/${applicationId}/status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Application not found. Please check your application ID."
          );
        } else if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to view this application");
        } else {
          throw new Error(
            `Failed to fetch application status (${response.status})`
          );
        }
      }

      const data = await response.json();
      if (data.success && data.application) {
        setApplication(data.application);
        setCurrentStep(getStepFromStatus(data.application.status));
        setShowSearch(false);
      } else {
        throw new Error(data.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/applications/applications/${applicationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.application) {
          setApplication(data.application);
        }
      }
    } catch (err) {
      console.error("Error fetching detailed application:", err);
    }
  };

  const getToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  const getStepFromStatus = (status) => {
    const statusMap = {
      submitted: 1,
      review: 2,
      revisions: 3,
      approved: 4,
      rejected: 4,
    };
    return statusMap[status?.toLowerCase()] || 1;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      submitted: "text-blue-600",
      review: "text-yellow-600",
      revisions: "text-orange-600",
      approved: "text-green-600",
      rejected: "text-red-600",
    };
    return colorMap[status?.toLowerCase()] || "text-gray-600";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      submitted: <FileText className="w-4 h-4" />,
      review: <Share2 className="w-4 h-4" />,
      revisions: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    return iconMap[status?.toLowerCase()] || <FileText className="w-4 h-4" />;
  };

  const getStepDescription = (stepId, status) => {
    const descriptions = {
      1: "Your proposal has been successfully submitted and is now awaiting initial review.",
      2: "The ethics review board is currently assessing your submission to ensure it meets all guidelines and requirements.",
      3:
        status === "revisions"
          ? "Revisions have been requested. Please check your email for detailed feedback and resubmit your application."
          : "Your application is being evaluated for any potential revision requirements.",
      4:
        status === "approved"
          ? "Congratulations! Your application has been approved and you can proceed with your research."
          : status === "rejected"
          ? "Unfortunately, your application has been rejected. Please check your email for feedback."
          : "Final decision is being processed for your application.",
    };
    return descriptions[stepId] || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleViewDetails = () => {
    setActiveTab("details");
    if (!application?.reviews) {
      fetchApplicationDetails();
    }
  };

  const handleDownload = (filePath, fileName) => {
    console.log(`Downloading file: ${fileName} from ${filePath}`);
    // Implement actual download logic here
  };

  const handleSearch = () => {
    if (inputApplicationId.trim()) {
      setApplicationId(inputApplicationId.trim());
      setInputApplicationId("");
    }
  };

  const handleSearchAnother = () => {
    setApplicationId("");
    setApplication(null);
    setError(null);
    setShowSearch(true);
    setActiveTab("overview");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (showSearch || (!applicationId && !loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Search className="w-16 h-16 text-blue-900 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-blue-900 mb-2">
                Track Your Application
              </h1>
              <p className="text-gray-600">
                Enter your application ID to check its status
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="applicationId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Application ID
                </label>
                <input
                  id="applicationId"
                  type="text"
                  value={inputApplicationId}
                  onChange={(e) => setInputApplicationId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your application ID (e.g., APP-2024-001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!inputApplicationId.trim() || loading}
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Track Application
                  </>
                )}
              </button>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Don't have your application ID?</p>
              <p>Check your confirmation email or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error && !showSearch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Application
          </h2>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={fetchApplicationStatus}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={handleSearchAnother}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 mx-auto"
            >
              <Search className="w-4 h-4" />
              Search Another Application
            </button>
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support or check your
              internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No application data available</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={fetchApplicationStatus}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Reload
            </button>
            <button
              onClick={handleSearchAnother}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Search Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-2">
            Track Your Application
          </h1>
          <button
            onClick={handleSearchAnother}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Another
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Application Summary Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Application #{application.application_id}
              </h2>
              <p className="text-gray-600">
                {application.research_type} - {application.application_type}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Submitted: {formatDate(application.submission_date)}
                </span>
                {application.expiry_date && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Expires: {formatDate(application.expiry_date)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center gap-2 ${getStatusColor(
                  application.status
                )}`}
              >
                {getStatusIcon(application.status)}
                <span className="font-semibold capitalize text-lg">
                  {application.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last Updated: {formatDate(application.last_updated)}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {application.documents_count || 0} Documents
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    application.payment_status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Payment: {application.payment_status || "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Progress Overview
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Full Details
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payment"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    {steps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-colors
                          ${
                            step.id <= currentStep
                              ? "bg-blue-900"
                              : "bg-gray-300"
                          }`}
                        >
                          {step.id}
                        </div>
                        <p
                          className={`text-sm mt-2 text-center max-w-20 ${
                            step.id <= currentStep
                              ? "text-blue-900 font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Line */}
                  <div className="relative mb-6">
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200"></div>
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-blue-900 transition-all duration-500"
                      style={{
                        width: `${
                          ((currentStep - 1) / (steps.length - 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  {/* Step Details */}
                  <div className="space-y-6">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-start ${
                          step.id <= currentStep
                            ? "text-blue-900"
                            : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors mr-4 ${
                            step.id <= currentStep
                              ? "border-blue-900 bg-blue-900 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold ${
                              step.id <= currentStep
                                ? "text-blue-900"
                                : "text-gray-500"
                            }`}
                          >
                            {step.subtitle}
                          </h3>
                          <p className="text-sm mt-1">
                            {getStepDescription(step.id, application.status)}
                          </p>
                          {step.id === currentStep && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Current Status:</strong>{" "}
                                {application.status.charAt(0).toUpperCase() +
                                  application.status.slice(1)}
                              </p>
                              {application.latest_review?.comments && (
                                <p className="text-sm text-blue-700 mt-1">
                                  <strong>Latest Comment:</strong>{" "}
                                  {application.latest_review.comments}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Application Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">ID:</span>{" "}
                        {application.application_id}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {application.application_type}
                      </div>
                      <div>
                        <span className="font-medium">Research Type:</span>{" "}
                        {application.research_type}
                      </div>
                      <div>
                        <span className="font-medium">Extension:</span>{" "}
                        {application.is_extension ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Important Dates
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Submitted:</span>{" "}
                        {formatDate(application.submission_date)}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(application.last_updated)}
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span>{" "}
                        {formatDate(application.expiry_date)}
                      </div>
                    </div>
                  </div>
                </div>

                {application.latest_review && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      Latest Review
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">
                          {application.latest_review.reviewer?.first_name}{" "}
                          {application.latest_review.reviewer?.last_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          on {formatDate(application.latest_review.review_date)}
                        </span>
                      </div>
                      <p className="text-sm">
                        {application.latest_review.comments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Documents
                  </h3>
                  <span className="text-sm text-gray-500">
                    {application.documents_count || 0} total documents
                  </span>
                </div>

                {application.documents && application.documents.length > 0 ? (
                  <div className="space-y-3">
                    {application.documents.map((doc) => (
                      <div
                        key={doc.document_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {doc.document_type}
                            </div>
                            <div className="text-sm text-gray-500">
                              Uploaded: {formatDate(doc.upload_date)}
                              {doc.is_mandatory && (
                                <span className="ml-2 text-red-500">
                                  *Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDownload(doc.file_path, doc.document_type)
                          }
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No documents uploaded yet
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Review History
                </h3>

                {application.reviews && application.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {application.reviews.map((review) => (
                      <div
                        key={review.review_id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">
                              {review.reviewer?.first_name}{" "}
                              {review.reviewer?.last_name}
                            </span>
                            {review.reviewer?.email && (
                              <span className="text-sm text-gray-500">
                                {review.reviewer.email}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${getStatusColor(
                                review.outcome
                              )}`}
                            >
                              {review.outcome?.charAt(0).toUpperCase() +
                                review.outcome?.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(review.review_date)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {review.comments}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No reviews available yet
                  </div>
                )}
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Payment Information
                </h3>

                {application.payment ? (
                  <div className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">Payment Details</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Amount:</span> £
                            {application.payment.amount}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 ${
                                application.payment.payment_status ===
                                "completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {application.payment.payment_status
                                ?.charAt(0)
                                .toUpperCase() +
                                application.payment.payment_status?.slice(1)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {formatDate(application.payment.payment_date)}
                          </div>
                        </div>
                      </div>
                      {application.payment.payment_evidence && (
                        <div>
                          <div className="font-medium mb-2">
                            Payment Evidence
                          </div>
                          <button
                            onClick={() =>
                              handleDownload(
                                application.payment.payment_evidence,
                                "Payment Receipt"
                              )
                            }
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No payment information available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleViewDetails}
            className="bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg 
                     transition-transform duration-300 transform hover:scale-105 hover:from-blue-800 hover:to-blue-950
                     flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Full Details
          </button>
          <button
            onClick={fetchApplicationStatus}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-lg 
                     transition-transform duration-300 transform hover:scale-105 hover:bg-gray-300
                     flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;
