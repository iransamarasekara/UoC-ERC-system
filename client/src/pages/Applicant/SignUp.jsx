import { useState } from "react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";
import { useAuth } from "../../../context/auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    identity_number: "",
    applicant_category: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF or image files (JPEG, JPG, PNG)");
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        e.target.value = ""; // Clear the input
        return;
      }

      setEvidenceFile(file);
      setUploadProgress(0);
    }
  };

  // const uploadFileToBackend = async (file) => {
  //   const formData = new FormData();
  //   formData.append("evidence", file);
  //   formData.append("type", "occupation_evidence");

  //   try {
  //     const response = await fetch(`${API_URL}/auth/upload/evidence`, {
  //       method: "POST",
  //       body: formData,
  //       // Include auth headers if needed
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth system
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Upload failed");
  //     }

  //     const data = await response.json();
  //     return data.file_url; // Assuming backend returns the file URL
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     throw error;
  //   }
  // };

  // Alternative with upload progress tracking
  const uploadFileWithProgress = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("evidence", file);
      formData.append("type", "occupation_evidence");

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.file_url);
        } else {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || "Upload failed"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.open("POST", `${API_URL}/auth/upload/evidence`);

      // Include auth headers if needed
      const token = localStorage.getItem("token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Check if evidence is required
    const requiresEvidence = formData.applicant_category !== "students";

    if (requiresEvidence && !evidenceFile) {
      alert("Please upload evidence document for your occupation");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      let evidenceUrl = null;

      // Upload file if provided
      if (evidenceFile) {
        evidenceUrl = await uploadFileWithProgress(evidenceFile);
      }

      const submitData = {
        ...formData,
        evidence_url: evidenceUrl,
      };

      console.log("Form Data:", submitData);

      // Register user with evidence URL
      await register(submitData);

      // Reset form on success
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        identity_number: "",
        applicant_category: "",
        password: "",
        confirmPassword: "",
        address: "",
      });
      setEvidenceFile(null);
      setUploadProgress(0);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Registration error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Check if evidence is required based on selected occupation
  const requiresEvidence =
    formData.applicant_category && formData.applicant_category !== "students";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative overflow-hidden"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      <div className="relative z-10 bg-white shadow-2xl rounded-3xl w-2/3 max-w-4xl p-8">
        <h2 className="text-center text-3xl font-bold text-indigo-900 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your contact number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                NIC or Passport
              </label>
              <input
                type="text"
                name="identity_number"
                value={formData.identity_number}
                onChange={handleChange}
                placeholder="Enter your NIC or Passport Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Select Your Occupation
            </label>
            <select
              name="applicant_category"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.applicant_category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select --</option>
              <option value="academic_staff">
                Permanent academic staff or retired academic staff of University
                of Colombo
              </option>
              <option value="extended_faculty">
                Member of extended faculty of Faculty of Medicine, University of
                Colombo
              </option>
              <option value="students">
                Undergraduate or postgraduate student at University of Colombo
              </option>
              <option value="pgim_trainers">
                Trainer or trainee of PGIM, University of Colombo
              </option>
              <option value="researcher_mou">
                Researcher conducting a project under an MOU with UCFM
              </option>
              <option value="researcher_health">
                Researcher conducting a project on behalf of the Ministry of
                Health
              </option>
            </select>
          </div>

          {/* Evidence Upload Section */}
          {requiresEvidence && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Upload Evidence Document <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Please upload a PDF or image file (JPEG, JPG, PNG) as evidence
                for your occupation. Maximum file size: 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required={requiresEvidence}
              />

              {evidenceFile && (
                <div className="mt-3">
                  <p className="text-sm text-green-600">
                    Selected: {evidenceFile.name} (
                    {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>

                  {uploading && uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength="6"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-900 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Processing..."}
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>

      {/* Circle Animation - Behind Main Box */}
      <div className="absolute w-96 h-96 bg-indigo-500 opacity-20 rounded-full -top-10 left-10 animate-pulse z-0"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 rounded-full -bottom-10 right-20 animate-pulse z-0"></div>
    </div>
  );
};

export default SignUp;
