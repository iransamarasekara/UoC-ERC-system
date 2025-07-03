// src/pages/TechnicalAdmin/Dashboard.jsx
import React, { useState } from 'react';
import Header from "../../components/TechnicalAdmin/genaral/Header";
import Sidebar from "../../components/TechnicalAdmin/genaral/SideBar";
import CommitteeManagement from "../../components/TechnicalAdmin/CommitteeManagement/CommitteeManagement";
import UserManagement from "../../components/TechnicalAdmin/UserManagement/UserManagement";
import ApplicationReview from "../../components/TechnicalAdmin/ApplicationReview/ApplicationReview";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('applications');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch(currentView) {
      case 'committees':
        return <CommitteeManagement />;
      case 'users':
        return <UserManagement />;
      case 'applications':
      default:
        return <ApplicationReview />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      
      <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <div className={`flex-grow bg-gray-100 transition-all duration-300 p-6 overflow-y-auto`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;