import { useNavigate } from "react-router-dom";
import BuildingSketch from "../../assets/Applicant/Building-Sketch.png";
import Logo from "../../assets/Applicant/logo-menu.png";

const SignIn = () => {
  const navigate = useNavigate();

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
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Login</label>
            <input
              type="text"
              placeholder="Email or phone number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-2 text-gray-500 cursor-pointer">
                👁
              </span>
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
            className="w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-indigo-800"
          >
            Sign in
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
      </div>
    </div>
  );
};

export default SignIn;
