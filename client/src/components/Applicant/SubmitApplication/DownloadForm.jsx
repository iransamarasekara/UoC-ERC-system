const SubmitApplication = () => {
  return (
    <div className="w-full max-w-4xl p-6 mt-6">
      {/* Instruction Box */}
      <div className="text-center">
        <p className="text-gray-700">
          Start by downloading the application form to begin the submission
          process. Ensure you have the correct version for your research type.
        </p>

        {/* Download PDF Button */}
        <div className="mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitApplication;
