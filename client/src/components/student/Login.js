import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom'; // <== import navigate
import axios from 'axios'
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
   const { setUser, setUserRole } = useAuth()
  const navigate = useNavigate(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const User={
        email,password
      }
      const res = await axios.post('http://localhost:8080/api/authstudent/login', User, {
        withCredentials: true
      })
      console.log(res.data.message)
      const{userRole,user}=res.data
      setUser(user);
      setUserRole(userRole)
      setTimeout(() => {
        navigate('/studentmain')
      }, 2000);
    } catch (error) {
      console.log(error)
    }
    
   
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In Clicked');
    // Add Google Sign-In logic here!
  };

  const goToRegister = () => {
    navigate('/studentregister'); // Navigate to register page
  };

  const goToForgotPassword = () => {
    navigate('/studentemail'); // Navigate to forgot password page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md mt-20">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-2 mb-4">
            <p
              className="text-sm text-pink-500 cursor-pointer hover:underline"
              onClick={goToForgotPassword} // add click event
            >
              Forgot Password?
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition text-lg font-semibold"
          >
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 font-semibold"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            className="text-pink-500 hover:underline cursor-pointer"
            onClick={goToRegister} // add click event
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
