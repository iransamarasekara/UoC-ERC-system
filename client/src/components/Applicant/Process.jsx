import React from "react"; 
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png"; 
import Submit from "../../assets/Applicant/Submit.png"; 
import Track from "../../assets/Applicant/Track.png"; 
import { ArrowRight } from "lucide-react"; 

const ApplicationProcess = () => {
  const options = [
    { image: Submit, title: "Submit An Application" }, 
    { image: Track, title: "Track Your Application" }   
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }} 
    >
      {/* Heading for the section */}
      <h2 className="text-4xl font-bold text-blue-900 mb-2 text-center">Application Process</h2>

      {/* Description text for the section */}
      <p className="text-blue-600 mb-6 text-center">Choose one to proceed &gt;</p>
      
      {/* Container for the options */}
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-5xl">
        {/* Mapping through the options array and rendering each option */}
        {options.map((option, index) => (
          <div
            key={index} 
            className="relative w-full md:w-[30rem] h-[20rem] rounded-lg overflow-hidden group cursor-pointer"
          >
            {/* Option image */}
            <img
              src={option.image} 
              alt={option.title}  
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
            {/* Overlay content */}
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
              {/* Title and arrow icon */}
              <h3 className="text-white text-lg font-semibold flex items-center">
                {option.title} <ArrowRight className="ml-2" /> {/* Displaying the title and an arrow icon */}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationProcess; // Exporting the component
