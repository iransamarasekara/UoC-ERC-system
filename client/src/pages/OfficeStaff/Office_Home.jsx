import { useNavigate } from "react-router-dom";
import eye from "../../assets/OfficeStaff/Eye.png";

const Table = () => {
  const navigate = useNavigate(); // Initialize navigate function

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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-300 text-gray-800 px-4 py-1 rounded-md text-sm";
      case "Forwarded":
        return "bg-green-100 text-green-600 px-4 py-1 rounded-md text-sm";
      case "Returned":
        return "bg-red-100 text-red-600 px-4 py-1 rounded-md text-sm";
      default:
        return "";
    }
  };

  // Function to handle navigation
  const handleViewClick = (id) => {
    navigate(`/officestaff/${id}`);
  };

  return (
    <div className="bg-[#D9D9D9] min-h-screen flex justify-center w-full px-2 py-2">
      <div className="w-full overflow-hidden rounded-lg shadow-lg bg-[#D9D9D9] py-4">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-white text-gray-700 font-semibold p-5 rounded-2xl mb-3">
          <div className="flex justify-center items-center">User ID</div>
          <div className="flex justify-center items-center">User Name</div>
          <div className="flex justify-center items-center">Date / Time</div>
          <div className="flex justify-center items-center">Category</div>
          <div className="flex justify-center items-center">Status</div>
          <div className="flex justify-center items-center">View Details</div>
        </div>

        {/* Table Rows */}
        {data.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-6 border-t border-gray-300 p-6 items-center ${
              index % 2 === 0 ? "bg-white" : "bg-[#D9D9D9]"
            }`}
          >
            <div className="text-gray-800 flex justify-center items-center">
              {row.id}
            </div>
            <div className="text-gray-800 flex justify-center items-center">
              {row.name}
            </div>
            <div className="text-gray-800 flex justify-center items-center">
              {row.date}
            </div>
            <div className="text-gray-800 flex justify-center items-center">
              {row.category}
            </div>
            <div className="flex justify-center items-center">
              <span
                className={`font-medium ${getStatusStyles(
                  row.status
                )} flex justify-center items-center`}
              >
                {row.status}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={eye}
                className="w-6 h-6 cursor-pointer"
                alt="View"
                onClick={() => handleViewClick(row.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
