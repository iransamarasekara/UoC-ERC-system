import { Link } from "react-router-dom";
import FooterLogo from "../../../assets/Applicant/FooterLogo.png";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0D1B40] to-[#1A3B70] text-white py-10 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Grid Layout with 4 Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left pb-20">
          
          {/* Section 1: Logo (Increased Size) */}
          <div className="flex justify-center md:justify-start">
            <img src={FooterLogo} alt="Faculty of Medicine Logo" className="w-40 h-40" /> {/* Logo Size Increased */}
          </div>

          {/* Section 2: Links */}
          <div>
            <ul className="space-y-2 text-base">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/guidelines" className="hover:underline">Guidelines</Link></li>
              <li><Link to="/application" className="hover:underline">Application Process</Link></li>
              <li><Link to="/support" className="hover:underline">Contact and Support</Link></li>
            </ul>
          </div>

          {/* Section 3: Address & Contact */}
          <div className="text-lg">
            <p>📍 The Faculty of Medicine, University of Colombo</p>
            <p>No. 25, Kynsey Road, Colombo 8, Sri Lanka.</p>
            <p className="mt-2">📞 +94 112 695 300</p>
          </div>

          {/* Section 4: Vision & Socials */}
          <div>
            <p className="italic text-md">
              "To be a global centre of excellence in the education of healthcare professionals, 
              building synergies between education, research, and clinical care in partnership 
              with stakeholders."
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" className="hover:text-gray-300"><Facebook size={24} /></a>
              <a href="#" className="hover:text-gray-300"><Instagram size={24} /></a>
              <a href="#" className="hover:text-gray-300"><Linkedin size={24} /></a>
              <a href="#" className="hover:text-gray-300"><Youtube size={24} /></a>
            </div>
          </div>
          
        </div>

        {/* Bottom Links */}
        <div className="mt-8 border-t border-gray-500 pt-4 text-center text-base">
          <a href="#" className="hover:underline mx-2">Privacy Policy</a> |
          <a href="#" className="hover:underline mx-2">Email Policy</a>
          <p className="mt-2">2024 © Faculty of Medicine, University of Colombo</p>
        </div>
      </div>
    </footer>
  );
}
