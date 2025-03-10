import { useEffect, useState } from "react";
import {
  FileText,
  ClipboardList,
  Upload,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";
import DownloadForm from "../../components/Applicant/SubmitApplication/DownloadForm";
import ChooseCategory from "../../components/Applicant/SubmitApplication/ChooseApplicationCategory";
import UploadEvidence from "../../components/Applicant/SubmitApplication/UploadEvidence";
import ChooseResearchType from "../../components/Applicant/SubmitApplication/ChooseResearchType";
import MakePayment from "../../components/Applicant/SubmitApplication/MakePayment";
import ConfirmSubmission from "../../components/Applicant/SubmitApplication/ConfirmSubmission";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SubmitApplication = () => {
  // State to manage form data and current step
  const [formData, setFormData] = useState({
    applicant_id: "",
    downloadForm: true,
    application_type: "",
    evidenceUploaded: null,
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

  useEffect(() => {
    // Get applicant_id from auth context or localStorage
    const applicantId = localStorage.getItem("applicantId") || "1"; // Default for testing
    setFormData((prev) => ({ ...prev, applicant_id: applicantId }));
  }, []);

  // Logging effect for development
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

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
      title: "Application Category",
      icon: <ClipboardList />,
      isActive: currentStep === 2,
      isCompleted: !!formData.application_type,
    },
    {
      id: 3,
      title: "Upload Evidence",
      icon: <Upload />,
      isActive: currentStep === 3,
      isCompleted: formData.evidenceUploaded !== null,
    },
    {
      id: 4,
      title: "Choose Research Type",
      icon: <ClipboardList />,
      isActive: currentStep === 4,
      isCompleted: !!formData.research_type,
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

  // Form data handlers
  const handleChooseCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      application_type: category,
    }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      evidenceUploaded: file,
    }));
  };

  const handleResearchTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      research_type: type,
    }));
  };

  const handlePaymentChange = (paymentData) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        amount: paymentData.amount || 100,
        payment_status: "Pending",
        payment_evidence: paymentData.file,
        payment_date: new Date(),
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmissionStatus({ loading: true, error: null, success: false });

    try {
      // Prepare documents array according to backend structure
      const documents = formData.evidenceUploaded
        ? [
            {
              document_type: "Evidence",
              file_path: formData.evidenceUploaded.name,
              upload_date: new Date(),
              is_mandatory: true,
            },
          ]
        : [];

      // Calculate expiry date (1 year from now) if not provided
      const calculatedExpiryDate =
        formData.expiry_date ||
        (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        })();

      // Prepare submission data according to backend API structure
      const submissionData = {
        applicant_id: formData.applicant_id,
        research_type: formData.research_type,
        application_type: formData.application_type,
        status: "Submitted",
        submission_date: new Date(),
        is_extension: formData.is_extension || false,
        expiry_date: calculatedExpiryDate,
        documents: documents,
        payment: formData.payment,
      };

      // Get auth token
      const authToken = localStorage.getItem("authToken");

      // Make API request
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

      // Reset form after successful submission
      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          applicant_id: formData.applicant_id,
          downloadForm: true,
          application_type: "",
          evidenceUploaded: null,
          research_type: "",
          payment: null,
          is_extension: false,
          expiry_date: null,
        });
        setSubmissionStatus({ loading: false, error: null, success: false });
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmissionStatus({
        loading: false,
        error: error.response?.data?.message || "Failed to submit application",
        success: false,
      });
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DownloadForm />;

      case 2:
        return <ChooseCategory onSubmit={handleChooseCategory} />;

      case 3:
        return <UploadEvidence onSubmit={handleFileChange} />;

      case 4:
        return <ChooseResearchType onSubmit={handleResearchTypeChange} />;

      case 5:
        return <MakePayment onSubmit={handlePaymentChange} />;

      case 6:
        return (
          <ConfirmSubmission
            onSubmit={handleSubmit}
            loading={submissionStatus.loading}
            error={submissionStatus.error}
            success={submissionStatus.success}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
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
                (currentStep === 3 && !formData.evidenceUploaded) ||
                (currentStep === 4 && !formData.research_type) ||
                (currentStep === 5 && !formData.payment)
              }
              className={`
                bg-gradient-to-r from-blue-500 to-blue-700 text-white 
                px-6 py-2 rounded-lg shadow-lg transition-transform duration-300 
                transform hover:scale-105 hover:from-blue-600 hover:to-blue-800
                ${currentStep === 1 && "mx-auto"}
                ${
                  (currentStep === 2 && !formData.application_type) ||
                  (currentStep === 3 && !formData.evidenceUploaded) ||
                  (currentStep === 4 && !formData.research_type) ||
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
