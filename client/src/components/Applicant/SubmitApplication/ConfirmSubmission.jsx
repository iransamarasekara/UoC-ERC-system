import React from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const ConfirmSubmission = ({ onSubmit, loading, error, success }) => {
  return (
    <div className="flex flex-col items-center p-4">
      {/* Confirmation Message */}
      <div className="w-full bg-white border rounded-lg shadow-sm p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Your Application Submission
        </h3>

        <p className="text-gray-600 mb-6">
          Please review all the information you&apos;ve provided before final
          submission. Once submitted, you cannot make changes to this
          application.
        </p>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center justify-center mb-6 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex flex-col items-center justify-center mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
            <CheckCircle className="mb-2 h-8 w-8" />
            <h4 className="text-lg font-bold mb-2">
              Application Submitted Successfully!
            </h4>
            <p className="text-gray-700">
              Thank you for submitting your research application. We will review
              your submission and get back to you soon.
            </p>
          </div>
        )}

        {/* Submit Button - Disabled when loading or after success */}
        <button
          onClick={onSubmit}
          disabled={loading || success}
          className={`flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-lg text-white font-medium mx-auto
            ${
              loading || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 transition-colors"
            }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2 h-5 w-5" />
              Submitting...
            </>
          ) : success ? (
            "Submitted"
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSubmission;
