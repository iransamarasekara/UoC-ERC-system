import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import logo from "../../../assets/Applicant/logo-menu.png";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const navigate = useNavigate(); // ✅ Initialize useNavigate()

  // Sample Data
  const applicants = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
    { id: 4, name: "Diana Williams", email: "diana@example.com" },
    { id: 5, name: "Edward Brown", email: "edward@example.com" },
  ];

  const user = {
    name: "John Doe",
    role: "ERC Office Staff",
    profilePic: "/profile.jpg",
  };

  // Handle Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredResults([]);
    } else {
      const results = applicants.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query.toLowerCase()) ||
          applicant.email.toLowerCase().includes(query.toLowerCase()) ||
          applicant.id.toString().includes(query)
      );
      setFilteredResults(results);
    }
  };

  // ✅ Handle Selecting an Applicant (Navigate to their Page)
  const handleSelectApplicant = (id) => {
    navigate(`/applicant/${id}`); // ✅ Navigate to the applicant's page
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0A1F44] to-[#0F2E64] px-6 md:px-16 lg:px-32 py-4 flex items-center justify-between z-50 fixed top-0 left-0 right-0">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Faculty Logo"
            className="h-10 md:h-12 object-contain"
          />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Applicant..."
            className="w-full max-w-xs md:max-w-md lg:max-w-lg bg-transparent border border-gray-400 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white placeholder-gray-300"
          />
          {/* Search Suggestions */}
          {filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full max-w-xs md:max-w-md lg:max-w-lg bg-white text-black rounded-md shadow-lg overflow-hidden z-50">
              {filteredResults.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectApplicant(applicant.id)} // ✅ Click to navigate
                >
                  {applicant.name} ({applicant.email})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Profile & Search Icon */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="block md:hidden text-white"
          >
            {showSearch ? (
              <X className="w-6 h-6" />
            ) : (
              <Search className="w-6 h-6" />
            )}
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <img
              src={user.profilePic}
              alt="User Profile"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full border-2 border-white object-cover"
            />
            <div className="text-white hidden md:block">
              <p className="text-sm md:text-lg font-semibold">{user.name}</p>
              <p className="text-xs md:text-sm text-gray-300">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="px-6 md:hidden mt-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Applicant..."
            className="w-full bg-[#0F2E64] border border-gray-400 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white placeholder-gray-300"
          />
          {/* Search Suggestions */}
          {filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white text-black rounded-md shadow-lg overflow-hidden z-50">
              {filteredResults.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectApplicant(applicant.id)} // ✅ Click to navigate
                >
                  {applicant.name} ({applicant.email})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
