import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

const MakePayment = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onSubmit(file);
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Main Content: Payment Summary & Upload Section */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Summary Box - Moved to Left */}
        <div className="w-full md:w-1/3">
          <h4 className="text-lg font-semibold text-gray-800">
            Payment Summary
          </h4>
          <div className="mt-2 text-gray-700">
            <p className="flex justify-between">
              <span>Application Submission Fee</span>
              <span>Rs. 10,000.00</span>
            </p>
            <p className="flex justify-between">
              <span>Application Review Fee</span>
              <span>Rs. 15,000.00</span>
            </p>
            <hr className="my-2 border-gray-400" />
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. 25,000.00</span>
            </p>
            <p className="flex justify-between">
              <span>Other Fee</span>
              <span>Rs. 550.00</span>
            </p>
            <hr className="my-2 border-gray-400" />
            <p className="flex justify-between font-bold text-blue-900">
              <span>Total</span>
              <span>Rs. 25,550.00</span>
            </p>
          </div>
        </div>

        {/* Upload Section - Right Side */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Upload the Receipt of the Payment
          </h3>

          <label className="mt-4 flex flex-col items-center border-2 border-dashed border-gray-400 bg-white rounded-lg p-6 cursor-pointer">
            <UploadCloud className="text-blue-500 w-10 h-10" />
            <p className="text-gray-700 mt-2">Browse Files to upload</p>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {selectedFile && (
            <div className="mt-4 flex justify-center items-center bg-gray-200 p-2 rounded-lg">
              <FileText className="text-gray-600 w-5 h-5 mr-2" />
              <p className="text-gray-700">{selectedFile.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
