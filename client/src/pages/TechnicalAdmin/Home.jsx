import React from "react";
import ApplicationList from "../../components/TechnicalAdmin/ApplicationList/ApplicationList.jsx";

const Home = () => {
  const data = [
    {
      id: "00003MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Pending",
    },
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
    {
      id: "00006MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Returned",
    },
    {
      id: "00007MS",
      name: "Name here",
      date: "2024/12/12 10.00",
      category: "Clinical",
      status: "Pending",
    },
  ];

  return <ApplicationList data={data} />;
};

export default Home;
