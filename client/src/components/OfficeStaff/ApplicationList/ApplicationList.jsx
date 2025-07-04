import { useNavigate } from "react-router-dom";
import eye from "../../../assets/OfficeStaff/Eye.png";

const ApplicationsTable = ({ data }) => {
  const navigate = useNavigate();

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

  const handleViewClick = (id, status) => {
    if (status === "Pending") {
      navigate(`/officestaff/${id}`);
    } else {
      navigate(`/officestaff/Eval/${id}`);
    }
  };

  return (
    <div className="bg-[#D9D9D9] min-h-screen flex justify-center w-full px-2 py-2">
      <div className="w-full overflow-hidden rounded-lg shadow-lg bg-[#D9D9D9] py-4">
        <div className="grid grid-cols-6 bg-white text-gray-700 font-semibold p-5 rounded-2xl mb-3">
          <div className="flex justify-center items-center">User ID</div>
          <div className="flex justify-center items-center">User Name</div>
          <div className="flex justify-center items-center">Date / Time</div>
          <div className="flex justify-center items-center">Category</div>
          <div className="flex justify-center items-center">Status</div>
          <div className="flex justify-center items-center">View Details</div>
        </div>

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
                onClick={() => handleViewClick(row.id, row.status)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsTable;
