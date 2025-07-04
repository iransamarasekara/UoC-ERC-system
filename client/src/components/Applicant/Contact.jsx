import React from "react";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";
import { Mail, MapPin, Phone, Facebook, Youtube } from "lucide-react";

const ContactSupport = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-8 bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      {/* Floating Decorative Circles */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-800 rounded-full opacity-30 animate-pulse" />
      <div className="absolute -bottom-10 right-4 w-60 h-60 bg-blue-700 rounded-full opacity-40 animate-bounce" />
      <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-50 animate-spin" />

      <div className="flex flex-col md:flex-row shadow-[0px_20px_50px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden w-full max-w-6xl relative z-10">
        {/* Contact Information Section */}
        <div className="bg-gradient-to-b from-blue-950 to-blue-800 text-white p-8 w-full md:w-1/3 flex flex-col justify-between rounded-t-lg md:rounded-t-none md:rounded-l-lg">
          <div>
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <p className="mt-2">Contact Us</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Phone />
                <span>+94 112 695 300</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail />
                <span>demo@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin />
                <span>The Faculty of Medicine, University of Colombo, No. 25, Kynsey Road, Colombo 8, Sri Lanka.</span>
              </div>
            </div>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-6">
            <Facebook className="cursor-pointer hover:text-blue-400 transition" />
            <Youtube className="cursor-pointer hover:text-red-500 transition" />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="p-8 w-full md:w-2/3 rounded-b-lg md:rounded-b-none md:rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800">Submit Below Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition" type="text" placeholder="First Name" />
            <input className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition" type="text" placeholder="Last Name" />
            <input className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition" type="email" placeholder="Email" />
            <input className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition" type="tel" placeholder="Phone Number" />
          </div>
          <div className="mt-4">
            <label className="block font-semibold">Select Subject?</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="subject" className="accent-blue-500" /> <span>General Inquiry</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="subject" className="accent-blue-500" /> <span>Support</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="subject" className="accent-blue-500" /> <span>Feedback</span>
              </label>
            </div>
          </div>
          <textarea className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" rows="4" placeholder="Write your message..."></textarea>
          <button className="mt-4 bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform">Submit &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;