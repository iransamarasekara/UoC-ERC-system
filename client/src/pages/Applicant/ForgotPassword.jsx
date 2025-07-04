import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png"; // Import background image

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    alert(`Password reset link sent to ${email}`);
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 md:px-8"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 md:p-10 rounded-2xl shadow-lg text-center w-full max-w-md">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-blue-950">Forgot Password</h2>
        <p className="text-gray-700 mt-2 text-sm md:text-base">
          Enter your email address below and we’ll send you a reset link.
        </p>

        {/* Email Input Field */}
        <div className="mt-6">
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <Mail className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700"
            />
          </div>
        </div>

        {/* Reset Password Button */}
        <button
          onClick={handleResetPassword}
          className="mt-4 bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-950 transition w-full"
          >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-600 flex items-center justify-center hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
