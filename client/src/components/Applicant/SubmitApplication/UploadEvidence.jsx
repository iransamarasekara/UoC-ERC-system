import { useState } from "react";
import { Upload } from "lucide-react";

const UploadEvidence = ({ onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    onSubmit(uploadedFile);
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* File Upload Section */}
      <div className="mt-6 text-center">
        <p className="text-gray-700">
          Upload supporting documents such as research protocols, informed
          consent forms, and any necessary evidence to support your ethical
          review.
        </p>

        {/* Upload Box */}
        <div className="mt-4 border-dashed border-2 border-gray-400 rounded-lg p-6 flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-gray-600 mt-2">
            Choose a file or drag & drop it here
          </p>
          <p className="text-sm text-gray-500">
            JPEG, PNG, PDF, and MP4 formats, up to 50MB
          </p>

          {/* File Input */}
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer shadow-lg"
          >
            Browse File
          </label>

          {/* Show Uploaded File Name */}
          {file && (
            <p className="mt-3 text-sm text-gray-700">
              Selected File: {file.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadEvidence;
