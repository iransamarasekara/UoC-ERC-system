import React from "react";
import ApplicationList from "../../components/TechnicalAdmin/ApplicationList/ApplicationList.jsx";

const ApprovedApplications = () => {
  const data = [
    {
      id: "00004MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Forwarded",
    },
    {
      id: "00005MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Forwarded",
    },
  ];

  return <ApplicationList data={data} />;
};

export default ApprovedApplications;
