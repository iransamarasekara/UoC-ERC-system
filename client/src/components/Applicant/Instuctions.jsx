import React from "react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";

// Array containing instruction sections with their respective steps
const instructionSections = [
  {
    title: "Instructions To Researchers",
    steps: [
      "Create an Account/Log in",
      "- Sign up or log in using your institutional credentials.",
      "Prepare Your Proposal",
      "- Ensure your research includes all necessary documents like objectives, methodology, and consent forms.",
      "Fill Out the Application",
      "- Complete the online form with your research details.",
      "Upload Documents",
      "- Attach required supporting documents.",
      "Submit Your Proposal",
      "- Review your application and submit it for ethical review."
    ]
  },
  {
    title: "ERC Standard Operation Guidelines",
    steps: [
      "Create an Account/Log in",
      "- Sign up or log in using your institutional credentials.",
      "Prepare Your Proposal",
      "- Ensure your research includes all necessary documents like objectives, methodology, and consent forms.",
      "Fill Out the Application",
      "- Complete the online form with your research details.",
      "Upload Documents",
      "- Attach required supporting documents.",
      "Submit Your Proposal",
      "- Review your application and submit it for ethical review."
    ]
  }
];

// Component for displaying research instructions
const ResearchInstructions = () => {
  return (
    <div 
      className="min-h-screen p-8 bg-no-repeat bg-cover bg-center pt-20 pb-20"
      style={{ backgroundImage: `url(${BuildingSketch})` }} // Applying background image
    >
      <div className="max-w-3xl mx-auto space-y-8 ">
        {instructionSections.map((section, index) => (
          // Rendering each instruction section
          <div key={index} className=" bg-opacity-95 rounded-lg p-6 shadow-[0px_20px_50px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 underline">{section.title}</h2>
              <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-3xl hover:bg-gray-800 text-bold hover:text-white">
                Download PDF
              </button>
            </div>
            
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                // Rendering each step within the section
                <div key={stepIndex} className={`${step.startsWith('-') ? 'ml-6 text-gray-600' : 'font-medium text-gray-800'}`}>
                  {step}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button className="text-blue-600 hover:text-blue-800">
                See More...
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchInstructions;
