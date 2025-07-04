import { Routes, Route } from "react-router-dom";
import Header from "../components/CTS/genaral/CTS_Header.jsx";
import Home from "../pages/CTS/CTS_Home.jsx";

const CTSCorARWSChairRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* route: general */}
        <Route path="/" element={<Home />} />

        {/* add other routes below */}
      </Routes>
    </>
  );
};

export default CTSCorARWSChairRoutes;
