import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicantRoutes from "./routes/ApplicantRoutes";
import CTSCorARWSChairRoutes from "./routes/CTSCorARWSChairRoutes";
import ERCmainRoutes from "./routes/ERCmainRoutes";
import ERCTechnicalCommitteeRoutes from "./routes/ERCTechnicalCommitteeRoutes";
import OfficeStaffRoutes from "./routes/OfficeStaffRoutes";
import { AuthContextProvider } from "../context/auth/AuthContext";
import AdminDashboard from "./pages/TechnicalAdmin/Dashboard";

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          {/* Applicant Routes */}
          <Route path="/*" element={<ApplicantRoutes />} />

          {/* Technical Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* CTSC/ARWS Chair Routes */}
          <Route path="/chair/*" element={<CTSCorARWSChairRoutes />} />

          {/* ERC main committee/ CTSC/ARWS members Routes */}
          <Route path="/ercmain/*" element={<ERCmainRoutes />} />

          {/* ERC Technical Committee Member Routes */}
          <Route
            path="/Technical-Admin/*"
            element={<ERCTechnicalCommitteeRoutes />}
          />

          {/* Office Staff Routes */}
          <Route path="/officestaff/*" element={<OfficeStaffRoutes />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
