import React from "react";
import ApplicationList from "../../components/OfficeStaff/ApplicationList/ApplicationList.jsx";

const ReturnApplications = () => {
  const data = [
    {
      id: "00006MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Returned",
    },
  ];

  return <ApplicationList data={data} />;
};

export default ReturnApplications;
