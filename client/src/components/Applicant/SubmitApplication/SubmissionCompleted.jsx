import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import BuildingSketch from "../../../assets/Applicant/Building-Sketch.png"; // Importing background image

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 md:px-8"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      <div className="bg-opacity-90 p-6 md:p-10 rounded-2xl shadow-[0px_20px_50px_rgba(0,0,0,0.4)] text-center w-full max-w-2xl">
        {/* Success Icon */}
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />

        {/* Success Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-4">SUCCESS</h2>
        <p className="text-gray-700 mt-2 text-sm md:text-base">
          Thank you for your request. <br />
          We are working hard to find the best service and deals for you.
        </p>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Shortly, you will receive a confirmation in your email.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-100 transition w-full md:w-auto"
          >
            &larr; Back to Home
          </button>
          <button
            onClick={() => navigate("/track-application")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full md:w-auto"
          >
            Track Application &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
