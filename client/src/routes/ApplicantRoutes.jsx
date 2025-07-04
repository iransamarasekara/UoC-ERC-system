import { Routes, Route } from "react-router-dom";
import Header from "../components/Applicant/general/Header";
import Footer from "../components/Applicant/general/Footer";
import Home from "../pages/Applicant/Home";
import Guidelines from "../pages/Applicant/Guidelines";
import ApplicationProcess from "../pages/Applicant/AplicationProcess";
import ContactSupport from "../pages/Applicant/ContactSupport";
import Login from "../pages/Applicant/Login";
import SignUp from "../pages/Applicant/SignUp";
import SubmitApplication from "../pages/Applicant/SubmitApplication";
import TrackApplication from "../pages/Applicant/TrackApplication";
import ChooseApplicationCategory from "../components/Applicant/SubmitApplication/ChooseApplicationCategory";
import ChooseResearchType from "../components/Applicant/SubmitApplication/ChooseResearchType";
import ConfirmSubmission from "../components/Applicant/SubmitApplication/ConfirmSubmission";
import DownloadForm from "../components/Applicant/SubmitApplication/DownloadForm";
import MakePayment from "../components/Applicant/SubmitApplication/MakePayment";
import UploadEvidence from "../components/Applicant/SubmitApplication/UploadEvidence";
import SubmissionCompleted from "../components/Applicant/SubmitApplication/SubmissionCompleted";
import ForgotPassword from "../pages/Applicant/ForgotPassword";

const ApplicantRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* route: general */}
        <Route path="/" element={<Home />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/application" element={<ApplicationProcess />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/submit-application" element={<SubmitApplication />} />
        <Route path="/track-application" element={<TrackApplication />} />
        <Route path="/submit-application" element={<SubmitApplication />} />
        <Route
          path="/submit-application/choose-category"
          element={<ChooseApplicationCategory />}
        />
        <Route
          path="/submit-application/upload-evidence"
          element={<UploadEvidence />}
        />
        <Route
          path="/submit-application/choose-research-type"
          element={<ChooseResearchType />}
        />
        <Route
          path="/submit-application/make-payment"
          element={<MakePayment />}
        />
        <Route
          path="/submit-application/confirm-submission"
          element={<ConfirmSubmission />}
        />
        <Route
          path="/submit-application/submission-completed"
          element={<SubmissionCompleted />}
        />

        {/* add other routes below */}
      </Routes>
      <Footer />
    </>
  );
};

export default ApplicantRoutes;
