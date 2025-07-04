import { useEffect, useState } from "react";
import {
  FileText,
  ClipboardList,
  Upload,
  CreditCard,
  CheckCircle,
  X,
  File,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SubmitApplication = () => {
  // State to manage form data and current step
  const [formData, setFormData] = useState({
    applicant_id: "",
    downloadForm: true,
    application_type: "",
    documentsSelected: {}, // Changed from documentsUploaded to documentsSelected
    research_type: "",
    payment: null,
    is_extension: false,
    expiry_date: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    // Get applicant_id from auth context or localStorage
    const applicantId = localStorage.getItem("applicantId");
    setFormData((prev) => ({ ...prev, applicant_id: applicantId }));
  }, []);

  // Fetch required documents when application type changes
  // useEffect(() => {
  //   if (formData.application_type) {
  //     fetchRequiredDocuments(formData.application_type);
  //   }
  // }, [formData.application_type]);

  // const fetchRequiredDocuments = async (applicationType) => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/applications/required-documents?application_type=${applicationType}`
  //     );
  //     setRequiredDocuments(response.data.required_documents);
  //   } catch (error) {
  //     console.error("Error fetching required documents:", error);
  //   }
  // };

  // Document requirements based on application type
  const getDocumentRequirements = (applicationType) => {
    const requirements = {
      Human: [
        { type: "Identity Verification", mandatory: true },
        { type: "Medical Certificate", mandatory: true },
        { type: "Research Proposal", mandatory: true },
        { type: "Ethics Approval", mandatory: true },
        { type: "Additional Documents", mandatory: false },
      ],
      Animal: [
        { type: "Animal Ethics Approval", mandatory: true },
        { type: "Veterinary Certificate", mandatory: true },
        { type: "Animal Welfare Plan", mandatory: true },
        { type: "Research Protocol", mandatory: true },
        { type: "Additional Documents", mandatory: false },
      ],
      Observational: [
        { type: "Study Protocol", mandatory: true },
        { type: "Data Collection Plan", mandatory: true },
        { type: "Privacy Agreement", mandatory: true },
        { type: "Additional Documents", mandatory: false },
      ],
      Other: [
        { type: "Research Description", mandatory: true },
        { type: "Methodology Document", mandatory: true },
        { type: "Risk Assessment", mandatory: true },
        { type: "Additional Documents", mandatory: false },
      ],
    };
    return requirements[applicationType] || [];
  };

  // Fixed function to check if documents are completed
  function checkDocumentsCompleted() {
    // If no application type is selected, documents are not completed
    if (!formData.application_type) {
      return false;
    }

    const requirements = getDocumentRequirements(formData.application_type);
    const mandatoryDocs = requirements.filter((doc) => doc.mandatory);

    // If there are no mandatory documents, return false (shouldn't happen with current requirements)
    if (mandatoryDocs.length === 0) {
      return false;
    }

    return mandatoryDocs.every(
      (doc) =>
        formData.documentsSelected[doc.type] &&
        formData.documentsSelected[doc.type].length > 0
    );
  }

  // Steps configuration
  const steps = [
    {
      id: 1,
      title: "Download The Form",
      icon: <FileText />,
      isCompleted: formData.downloadForm,
    },
    {
      id: 2,
      title: "Choose Application Type",
      icon: <ClipboardList />,
      isActive: currentStep === 2,
      isCompleted: !!formData.application_type,
    },
    {
      id: 3,
      title: "Choose Research Type",
      icon: <ClipboardList />,
      isActive: currentStep === 3,
      isCompleted: !!formData.research_type,
    },
    {
      id: 4,
      title: "Upload Documents",
      icon: <Upload />,
      isActive: currentStep === 4,
      isCompleted: checkDocumentsCompleted(),
    },
    {
      id: 5,
      title: "Make Payment",
      icon: <CreditCard />,
      isActive: currentStep === 5,
      isCompleted: formData.payment !== null,
    },
    {
      id: 6,
      title: "Finish Submission",
      icon: <CheckCircle />,
      isActive: currentStep === 6,
      isCompleted: submissionStatus.success,
    },
  ];

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplicationTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      application_type: type,
      documentsSelected: {}, // Reset documents when type changes
    }));
  };

  const handleResearchTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      research_type: type,
    }));
  };

  // Handle file selection (store files locally, don't upload yet)
  const handleDocumentSelect = (documentType, files) => {
    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      documentsSelected: {
        ...prev.documentsSelected,
        [documentType]: fileArray,
      },
    }));
  };

  // Remove selected file
  const removeSelectedFile = (documentType, fileIndex) => {
    setFormData((prev) => ({
      ...prev,
      documentsSelected: {
        ...prev.documentsSelected,
        [documentType]: prev.documentsSelected[documentType].filter(
          (_, index) => index !== fileIndex
        ),
      },
    }));
  };

  // Upload all selected documents (called during submission)
  const uploadAllDocuments = async () => {
    const uploadedDocuments = {};
    const totalDocTypes = Object.keys(formData.documentsSelected).length;
    let uploadedCount = 0;

    for (const [documentType, files] of Object.entries(
      formData.documentsSelected
    )) {
      if (files && files.length > 0) {
        try {
          setUploadProgress((prev) => ({
            ...prev,
            [documentType]: 0,
            overall: Math.round((uploadedCount / totalDocTypes) * 100),
          }));

          const formDataUpload = new FormData();
          files.forEach((file) => {
            formDataUpload.append("documents", file);
          });

          const authToken = localStorage.getItem("authToken");
          const response = await axios.post(
            `${API_URL}/applications/upload/documents`,
            formDataUpload,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [documentType]: progress,
                }));
              },
            }
          );

          uploadedDocuments[documentType] = response.data.files;
          setUploadProgress((prev) => ({ ...prev, [documentType]: 100 }));
          uploadedCount++;

          setUploadProgress((prev) => ({
            ...prev,
            overall: Math.round((uploadedCount / totalDocTypes) * 100),
          }));
        } catch (error) {
          console.error(`Error uploading ${documentType}:`, error);
          setUploadProgress((prev) => ({ ...prev, [documentType]: -1 }));
          throw new Error(`Failed to upload ${documentType}`);
        }
      }
    }

    return uploadedDocuments;
  };

  const handlePaymentChange = (paymentData) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        amount: paymentData.amount || 100,
        payment_status: "Pending",
        payment_evidence: paymentData.file ? paymentData.file.name : null,
        payment_file: paymentData.file, // Store file separately for upload
        payment_date: new Date(),
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmissionStatus({ loading: true, error: null, success: false });

    try {
      // First upload all documents
      const uploadedDocuments = await uploadAllDocuments();

      // Upload payment evidence if exists
      let paymentEvidenceUrl = null;
      if (formData.payment?.payment_file) {
        try {
          const paymentFormData = new FormData();
          paymentFormData.append("documents", formData.payment.payment_file);

          const authToken = localStorage.getItem("authToken");
          const paymentResponse = await axios.post(
            `${API_URL}/applications/upload/documents`,
            paymentFormData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          paymentEvidenceUrl = paymentResponse.data.files[0]?.file_url;
        } catch (error) {
          console.error("Error uploading payment evidence:", error);
          throw new Error("Failed to upload payment evidence");
        }
      }

      // Prepare documents array for submission
      const documents = [];
      Object.entries(uploadedDocuments).forEach(([docType, files]) => {
        files.forEach((file) => {
          documents.push({
            document_type: docType,
            file_path: file.file_url,
            upload_date: new Date(),
            is_mandatory:
              getDocumentRequirements(formData.application_type).find(
                (req) => req.type === docType
              )?.mandatory || false,
          });
        });
      });

      const calculatedExpiryDate =
        formData.expiry_date ||
        (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        })();

      const submissionData = {
        applicant_id: formData.applicant_id,
        research_type: formData.research_type,
        application_type: formData.application_type,
        status: "Submitted",
        submission_date: new Date(),
        is_extension: formData.is_extension || false,
        expiry_date: calculatedExpiryDate,
        documents: documents,
        payment: {
          amount: formData.payment.amount,
          payment_status: formData.payment.payment_status,
          payment_evidence: paymentEvidenceUrl, // Now stores the uploaded file URL as string
          payment_date: formData.payment.payment_date,
        },
      };

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/applications`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Application submitted successfully:", response.data);
      setSubmissionStatus({ loading: false, error: null, success: true });

      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          applicant_id: formData.applicant_id,
          downloadForm: true,
          application_type: "",
          documentsSelected: {},
          research_type: "",
          payment: null,
          is_extension: false,
          expiry_date: null,
        });
        setSubmissionStatus({ loading: false, error: null, success: false });
        setUploadProgress({});
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmissionStatus({
        loading: false,
        error:
          error.message ||
          error.response?.data?.message ||
          "Failed to submit application",
        success: false,
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Component for choosing application type
  const ChooseApplicationType = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Choose Application Type
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {["Human", "Animal", "Observational", "Other"].map((type) => (
          <button
            key={type}
            onClick={() => handleApplicationTypeChange(type)}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              formData.application_type === type
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold">{type} Research</div>
            <div className="text-sm text-gray-600 mt-1">
              {type === "Human" && "Research involving human participants"}
              {type === "Animal" && "Research involving animal subjects"}
              {type === "Observational" &&
                "Observational studies and data collection"}
              {type === "Other" && "Other types of research activities"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Component for choosing research type
  const ChooseResearchType = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Choose Research Type
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {[
          "Basic Research",
          "Applied Research",
          "Clinical Trial",
          "Survey Study",
        ].map((type) => (
          <button
            key={type}
            onClick={() => handleResearchTypeChange(type)}
            className={`p-3 border-2 rounded-lg text-left transition-colors ${
              formData.research_type === type
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );

  // Component for uploading documents
  const UploadDocuments = () => {
    const requirements = getDocumentRequirements(formData.application_type);

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Select Required Documents
        </h3>
        <p className="text-sm text-gray-600">
          Files will be uploaded when you submit the application.
        </p>

        {requirements.map((docReq) => (
          <div
            key={docReq.type}
            className="border border-gray-300 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700">
                {docReq.type}
                {docReq.mandatory && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>
              {formData.documentsSelected[docReq.type] && (
                <span className="text-green-600 text-sm font-medium">
                  {formData.documentsSelected[docReq.type].length} file(s)
                  selected
                </span>
              )}
            </div>

            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleDocumentSelect(docReq.type, e.target.files)
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {/* Display selected files */}
            {formData.documentsSelected[docReq.type] &&
              formData.documentsSelected[docReq.type].length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected files:
                  </p>
                  {formData.documentsSelected[docReq.type].map(
                    (file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded border"
                      >
                        <div className="flex items-center space-x-2">
                          <File size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(docReq.type, index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

            {/* Upload progress during submission */}
            {uploadProgress[docReq.type] !== undefined &&
              uploadProgress[docReq.type] >= 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[docReq.type]}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    Uploading: {uploadProgress[docReq.type]}%
                  </span>
                </div>
              )}

            {uploadProgress[docReq.type] === -1 && (
              <div className="text-red-500 text-sm mt-2">
                Upload failed. Please try again.
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Component for payment
  const MakePayment = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Make Payment</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700 mb-3">Application Fee: $100</p>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            handlePaymentChange({ file: e.target.files[0], amount: 100 })
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        <p className="text-sm text-gray-600 mt-2">Upload payment receipt</p>

        {formData.payment?.payment_file && (
          <div className="mt-3 flex items-center space-x-2 bg-green-50 p-2 rounded border">
            <File size={16} className="text-green-600" />
            <span className="text-sm text-green-700">
              {formData.payment.payment_file.name} selected
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Component for download form
  const DownloadForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Download Application Form
      </h3>
      <p className="text-gray-600">
        Please download and review the application form before proceeding.
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Download Form
      </button>
    </div>
  );

  // Component for submission confirmation
  const ConfirmSubmission = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Confirm Submission
      </h3>

      {submissionStatus.loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Submitting application...</p>

          {/* Overall upload progress */}
          {uploadProgress.overall !== undefined && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.overall}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                Uploading documents: {uploadProgress.overall}%
              </span>
            </div>
          )}
        </div>
      )}

      {submissionStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {submissionStatus.error}</p>
        </div>
      )}

      {submissionStatus.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">Application submitted successfully!</p>
        </div>
      )}

      {!submissionStatus.loading && !submissionStatus.success && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Application Summary:</h4>
            <p>
              <strong>Application Type:</strong> {formData.application_type}
            </p>
            <p>
              <strong>Research Type:</strong> {formData.research_type}
            </p>
            <p>
              <strong>Documents:</strong>{" "}
              {Object.values(formData.documentsSelected).reduce(
                (total, files) => total + (files?.length || 0),
                0
              )}{" "}
              files selected across{" "}
              {Object.keys(formData.documentsSelected).length} categories
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {formData.payment ? "Receipt uploaded" : "Pending"}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            disabled={submissionStatus.loading}
          >
            Submit Application
          </button>
        </div>
      )}
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DownloadForm />;
      case 2:
        return <ChooseApplicationType />;
      case 3:
        return <ChooseResearchType />;
      case 4:
        return <UploadDocuments />;
      case 5:
        return <MakePayment />;
      case 6:
        return <ConfirmSubmission />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
        Submit Your Application
      </h2>
      <p className="text-blue-600 text-lg mt-2">
        {steps[currentStep - 1].title}
      </p>

      {/* Progress Steps */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mt-6">
        {/* Step Indicators */}
        <div className="flex justify-between items-center border-b pb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold 
                ${
                  step.isCompleted
                    ? "bg-green-500"
                    : step.isActive
                    ? "bg-blue-900"
                    : "bg-gray-300"
                }`}
              >
                {step.isCompleted ? "✔" : step.id}
              </div>
              <p
                className={`text-xs mt-2 text-center ${
                  step.isActive
                    ? "text-blue-900 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && currentStep < 6 && (
            <button
              onClick={handlePreviousStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg shadow-lg"
            >
              ← Back
            </button>
          )}

          {currentStep < 6 && (
            <button
              onClick={handleNextStep}
              disabled={
                (currentStep === 2 && !formData.application_type) ||
                (currentStep === 3 && !formData.research_type) ||
                (currentStep === 4 && !checkDocumentsCompleted()) ||
                (currentStep === 5 && !formData.payment)
              }
              className={`
                bg-gradient-to-r from-blue-500 to-blue-700 text-white 
                px-6 py-2 rounded-lg shadow-lg transition-transform duration-300 
                transform hover:scale-105 hover:from-blue-600 hover:to-blue-800
                ${currentStep === 1 && "mx-auto"}
                ${
                  (currentStep === 2 && !formData.application_type) ||
                  (currentStep === 3 && !formData.research_type) ||
                  (currentStep === 4 && !checkDocumentsCompleted()) ||
                  (currentStep === 5 && !formData.payment)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitApplication;
