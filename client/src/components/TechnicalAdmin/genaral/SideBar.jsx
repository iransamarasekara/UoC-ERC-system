import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for toggle
import All from "../../../assets/TechnicalAdmin/all.png";
import Approved from "../../../assets/TechnicalAdmin/approved.png";
import Help from "../../../assets/TechnicalAdmin/help.png";
import Logout from "../../../assets/TechnicalAdmin/logout.png";
import Returned from "../../../assets/TechnicalAdmin/returned.png";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("all");

  const menuItems = [
    { id: "all", label: "All Applications", icon: All, url: "/officestaff" },
    {
      id: "approved",
      label: "Approved Applications",
      icon: Approved,
      url: "/Technical-Admin/approved-applications",
    },
    {
      id: "returned",
      label: "Returned Applications",
      icon: Returned,
      url: "/Technical-Admin/returned-applications",
    },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help", icon: Help },
    { id: "logout", label: "Logout", icon: Logout },
  ];

  const handleNavigation = (pageId, url) => {
    setCurrentPage(pageId);
    navigate(url);
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
                onClick={() => handleNavigation(item.id, item.url)}
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
