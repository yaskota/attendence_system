import axios from 'axios';
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdBadge, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 New state for toggling

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        name,
        email,
        password,
        phno: phone,
        teacher_id: teacherId
      };

      const res = await axios.post('http://localhost:8080/api/authteacher/register', user, {
        withCredentials: true
      });

      toast.success(res.data.message);
      setTimeout(() => {
        navigate('/teacherotp' ,  { state: { email } });
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.log("Error occurred in the faculty register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg mt-16">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-10">
          Create Account
        </h2>

        <form className="space-y-6">

          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Email */}
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

          {/* Password with eye toggle */}
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

          {/* Phone Number */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Teacher ID */}
          <div className="relative">
            <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate('/teacherlogin')}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;
