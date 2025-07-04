import React from 'react';
import Hero from "../../assets/Applicant/Hero.jpg";

const HeroSection = () => {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      {/* Background image */}
      <img src={Hero} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Content */}
      <div className="relative text-white text-left w-full px-4 md:px-20 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Streamlined Ethical Clearance
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          For <span className="text-blue-300">Medical Research</span>
        </h2>
        <button className="px-6 py-2 mt-4 text-white font-medium rounded-lg 
        bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
        transition-all duration-300 ease-in-out">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
