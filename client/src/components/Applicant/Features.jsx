import React from "react";
import SubmitIcon from "../../assets/Applicant/submit-application.png";
import TrackIcon from "../../assets/Applicant/track-status.png";
import PaymentsIcon from "../../assets/Applicant/payments.png";
import SupportIcon from "../../assets/Applicant/help-support.png";

const Features = () => {
  const features = [
    {
      icon: SubmitIcon,
      title: "Submit an Application",
      background: "bg-gray-800",
    },
    {
      icon: TrackIcon,
      title: "Track Application Status",
      background: "bg-gray-800",
    },
    {
      icon: PaymentsIcon,
      title: "Payments",
      background: "bg-gray-800",
    },
    {
      icon: SupportIcon,
      title: "Help & Support",
      background: "bg-gray-800",
    },
  ];

  return (
    <div className="bg-blue-900 py-12 px-4 pb-28 pt-20 md:px-20">
      <h2 className="text-white text-3xl font-bold text-left mb-8">
        Key Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.background} rounded-lg p-4 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300 relative overflow-hidden h-44`}
            style={{
              backgroundImage: `url(${feature.icon})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <p className="relative z-10 text-white font-semibold text-xl">
              {feature.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
