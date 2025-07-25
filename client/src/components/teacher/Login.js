import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // 👈 Added Eye Icons
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Password visibility state
  const navigate = useNavigate();
  const { setUser, setUserRole } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const User = {
        email,
        password
      };
      const res = await axios.post('http://localhost:8080/api/authteacher/login', User, {
        withCredentials: true
      });

      toast.success(res.data.message);
      
      const { userRole, user } = res.data;
      setUser(user);
      setUserRole(userRole);
      setTimeout(() => {
        navigate('/teachermain');
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.log("Error occurred faculty login");
    }
  };

   const handleGoogleSignIn = () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md mt-20">
        
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-10">
          Login
        </h2>

        <form className="space-y-6">

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Password Input with toggle icon */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-4">
            <p
              className="text-sm text-green-500 cursor-pointer hover:underline"
              onClick={() => navigate('/teacheremail')}
            >
              Forgot Password?
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
          >
            Login
          </button>
        </form>

        {/* Sign in with Google */}
        <div className="mt-6 text-center">
          <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition text-lg font-semibold">
            <FcGoogle className="text-2xl" /> 
            Sign in with Google
          </button>
        </div>

        {/* Don't have an account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate('/teacherregister')}
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
