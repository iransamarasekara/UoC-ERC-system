// Update components/TechnicalAdmin/genaral/SideBar.jsx
import React from "react";
import { ChevronLeft, ChevronRight, Users, Briefcase, ClipboardList, Settings, HelpCircle, LogOut } from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed, currentView, setCurrentView }) => {
  const menuItems = [
    { 
      id: "applications", 
      label: "Applications", 
      icon: <ClipboardList size={22} />, 
      url: "#applications" 
    },
    { 
      id: "committees", 
      label: "Committee Management", 
      icon: <Briefcase size={22} />, 
      url: "#committees" 
    },
    { 
      id: "users", 
      label: "User Management", 
      icon: <Users size={22} />, 
      url: "#users" 
    },
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: <Settings size={22} /> },
    { id: "help", label: "Help", icon: <HelpCircle size={22} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={22} /> },
  ];

  const handleNavigation = (pageId) => {
    setCurrentView(pageId);
  };

  return (
    <div className={`${isCollapsed ? "w-16" : "w-64"} bg-white shadow-md flex flex-col h-full transition-all duration-300 pt-3`}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 self-end">
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav className="flex-1 pt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 ${
                  currentView === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <span className="inline-flex items-center justify-center">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 pb-6 border-t border-gray-200">
        <ul>
          {bottomMenuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200`}>
                <span className="inline-flex items-center justify-center">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;