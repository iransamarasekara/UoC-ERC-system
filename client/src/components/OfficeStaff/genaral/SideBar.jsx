import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for toggle
import All from "../../../assets/OfficeStaff/all.png";
import Approved from "../../../assets/OfficeStaff/approved.png";
import Help from "../../../assets/OfficeStaff/help.png";
import Logout from "../../../assets/OfficeStaff/logout.png";
import Returned from "../../../assets/OfficeStaff/returned.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("all");

  const menuItems = [
    { id: "all", label: "All Applications", icon: All },
    { id: "approved", label: "Approved Applications", icon: Approved },
    { id: "returned", label: "Returned Applications", icon: Returned },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help", icon: Help },
    { id: "logout", label: "Logout", icon: Logout },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white border-r-gray-600 flex flex-col h-full transition-all duration-300 pt-3`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 self-end"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 pt-6 border-t-1 border-t-gray-400">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm transition-colors
                  ${
                    currentPage === item.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-7 h-7 mr-3"
                />
                {!isCollapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t-1 border-t-gray-400">
        <ul className="py-4">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm transition-colors
                  ${
                    currentPage === item.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-7 h-7 mr-3"
                />
                {!isCollapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
