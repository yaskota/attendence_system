import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc"; // 👈 Google icon
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, setUserRole, userRole } = useAuth();

  useEffect(() => {
    if (user && userRole === "admin") {
      navigate("/adminmain");
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const Data = { email, password };
      const res = await axios.post(
        "http://localhost:8080/api/admin/login",
        Data,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      const { userRole, user } = res.data;
      setUser(user);
      setUserRole(userRole);
      setTimeout(() => navigate("/adminmain"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log("Error occurred in the admin login");
    }
  };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Welcome Admin
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/adminemail"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Login
            </button>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
