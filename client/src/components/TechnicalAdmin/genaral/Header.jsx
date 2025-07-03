import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/Applicant/logo-menu.png";
import defaultProfile from "../../../assets/default-profile.png";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Mock user data - replace with props or state from your admin context later
  const [userData, setUserData] = useState({
    first_name: "Admin",
    last_name: "User",
    role: "ADMIN",
    profilePic: null
  });

  const navigate = useNavigate();

  // Sample Data for applicant search (you can replace with API call later)
  const applicants = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
    { id: 4, name: "Diana Williams", email: "diana@example.com" },
    { id: 5, name: "Edward Brown", email: "edward@example.com" },
  ];

  // Format user role for display
  const formatRole = (role) => {
    if (!role) return "Guest";
    
    // Convert roles like "ADMIN" or "ERC_TECHNICAL" to readable format
    return role
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
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

  // Handle Selecting an Applicant (Navigate to their Page)
  const handleSelectApplicant = (id) => {
    navigate(`/applicant/${id}`);
    setFilteredResults([]); // Clear results after selection
    setSearchQuery(""); // Clear search query
  };

  // Update user data when needed (example only)
  useEffect(() => {
    // You can fetch user data here if needed
    // For now we'll use the mock data
  }, []);

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
                  onClick={() => handleSelectApplicant(applicant.id)}
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

          {/* Profile Section - Dynamic User Data */}
          <div className="flex items-center gap-3">
            <img
              src={userData.profilePic || defaultProfile}
              alt="User Profile"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfile;
              }}
            />
            <div className="text-white hidden md:block">
              <p className="text-sm md:text-base font-semibold">
                {`${userData.first_name} ${userData.last_name}`}
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                {formatRole(userData.role)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="px-6 md:hidden mt-20 absolute left-0 right-0 z-40 bg-[#0F2E64] py-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Applicant..."
            className="w-full bg-transparent border border-gray-400 text-white px-4 py-2 rounded-full focus:outline-none focus:border-white placeholder-gray-300"
          />
          {/* Search Suggestions */}
          {filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 mx-6 bg-white text-black rounded-md shadow-lg overflow-hidden z-50">
              {filteredResults.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectApplicant(applicant.id)}
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