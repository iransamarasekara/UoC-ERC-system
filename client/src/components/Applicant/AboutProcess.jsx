import React from "react";
import { FaUserFriends, FaCheckCircle } from "react-icons/fa";
import { IoIosPaper, IoIosTime } from "react-icons/io";
import { FaLightbulb, FaNetworkWired, FaMicrophone, FaDna, FaThLarge } from "react-icons/fa";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";

const AboutProcess = () => {
  const steps = [
    { label: "Applicants", icon: <FaUserFriends /> },
    { label: "Submissions", icon: <IoIosPaper /> },
    { label: "Pendings", icon: <IoIosTime /> },
    { label: "Success Rate", icon: <FaCheckCircle /> },
  ];
  

  return (
    <div
      className="relative bg-cover bg-center py-16 px-6 md:px-20"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-90"></div>

      {/* About the Process Section */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 text-left">
          About the Process
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed text-left">
          The Ethical Research Clearance system is designed to ensure that all
          research conducted within our medical faculty adheres to the highest
          ethical standards. This system provides a streamlined and transparent
          process for researchers to submit their proposals for review,
          ensuring that research involving human participants, animals, or
          sensitive data is conducted responsibly and ethically. Through this
          platform, faculty members and researchers can easily submit their
          research protocols, track the progress of their applications, and
          receive approvals or feedback from the ethics review board. Our goal
          is to foster research that prioritizes the safety, privacy, and
          well-being of participants while maintaining scientific integrity and
          compliance with regulatory standards.
        </p>
      </div>

     {/* Process Steps Section with Full Shadow */}
     <div className="shadow-[0px_20px_50px_rgba(0,0,0,0.4)] rounded-lg p-10 mx-6 md:mx-20">
  <div className="flex flex-wrap justify-center items-center gap-12 mt-20 mb-20">
    {steps.map((step, index) => (
      <div
        key={index}
        className="flex-1 min-w-[180px] max-w-[220px] bg-blue-900 text-white px-6 py-4 flex items-center justify-center font-semibold text-lg rounded-md relative shadow-xl"
      >
        {/* Step Content */}
        <span className="flex flex-col items-center gap-2">
          {step.icon}
          {step.label}
        </span>
      </div>
    ))}
  </div>
</div>



      {/* Call to Action Section */}
      <div className="relative z-10 text-center mt-24 mb-24">
        <h3 className="text-4xl font-bold text-blue-900 cursor-pointer hover:text-blue-700 transition">
          Call To Action &gt;
        </h3>
      </div>
    </div>
  );
};

export default AboutProcess;
