import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";
import Logo from "../../assets/Applicant/logo-menu.png";
import { useAuth } from "../../../context/auth/AuthContext";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Email:", email);
    console.log("Password:", password);

    const isAuthenticated = await login(email, password);
    if (isAuthenticated) {
      toast.success("Login successful");
      setTimeout(() => {
        if (isAuthenticated.data.user_role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        setIsLoading(false);
      }, 3000);
    } else {
      setTimeout(() => {
        toast.error("Login failed");
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BuildingSketch})` }}
    >
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-center mb-4 bg-gradient-to-b from-blue-950 to-indigo-800 p-6 rounded-xl">
          <img src={Logo} alt="Faculty of Medicine Logo" className="h-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Login</label>
            <input
              type="text"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-indigo-800 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner size={20} color="white" className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up now
            </a>
          </p>
        </form>
        <ToastContainer autoClose={3000} />
      </div>
    </div>
  );
}

export default Login;
