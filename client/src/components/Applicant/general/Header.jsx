import React, { useState } from 'react';
import Logo from '../../../assets/Applicant/logo-menu.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Guidelines', href: '/guidelines' },
    { name: 'Application Process', href: '/application' },
    { name: 'Contact Support', href: '/support' }
  ];

  return (
    <nav className="font-sans bg-gradient-to-r from-[#112951] via-[#1c4384] to-[#1c4384] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-13" />
        </div>

        <div className="flex space-x-6 ml-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.name)}
              className={`relative px-4 py-2 transition-all duration-300 text-white/80 hover:text-white group 
                ${activeLink === link.name ? 'font-semibold text-white' : ''}`}
            >
              {link.name}
              {/* Underline effect with left-to-right animation, staying when active */}
              <span
                className={`absolute top-15 left-0 h-0.5 bg-white transition-all duration-300 ease-in-out 
                  ${activeLink === link.name ? 'w-full' : 'w-0 group-hover:w-full'}`}
              ></span>
            </a>
          ))}
        </div>


        {/* Login Button - Capsule Style with Border */}
        <div className="flex items-center">
          <button className="border border-white text-white px-7 py-2 rounded-full 
                            shadow-lg hover:shadow-xl transition-all duration-200 
                            hover:scale-100 flex items-center cursor-pointer">
            <span>Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="white">
              <path fill="white" d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z"/>
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

