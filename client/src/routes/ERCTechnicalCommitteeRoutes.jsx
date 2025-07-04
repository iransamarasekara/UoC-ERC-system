import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "../pages/TechnicalAdmin/Home.jsx";
import Header from "../components/TechnicalAdmin/genaral/Header.jsx";
import Sidebar from "../components/TechnicalAdmin/genaral/SideBar.jsx";
import ApplicationDetails from "../components/TechnicalAdmin/genaral/ApplicationDetails.jsx";
import ApprovedApplications from "../pages/TechnicalAdmin/ApprovedApplications.jsx";
import ReturendApplications from "../pages/TechnicalAdmin/ReturnApplication.jsx";
import Eval from "../pages/TechnicalAdmin/Evaluated.jsx";

const ERCTechnicalCommitteeRoutes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div className={`flex-grow bg-gray-100 transition-all duration-300`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<ApplicationDetails />} />
            <Route path="/eval/:id" element={<Eval />} />
            <Route
              path="/approved-applications"
              element={<ApprovedApplications />}
            />
            <Route
              path="/returned-applications"
              element={<ReturendApplications />}
            />
            <Route path="/evaluated" element={<Eval />} />

            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ERCTechnicalCommitteeRoutes;
