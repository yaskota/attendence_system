import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Add this

function ResetPassword() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email, otp, password: newPassword
      }
      const res = await axios.post('http://localhost:8080/api/authteacher/resetPassword', user, {
        withCredentials: true
      })
      toast.success(res.data.message);
      setTimeout(() => {
        navigate('/teacherlogin')
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the reset password");
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const user = { email }
      const res = await axios.post('http://localhost:8080/api/authteacher/resendOtp', user, {
        withCredentials: true
      })
      toast.success(res.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the resend otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-10">
          Reset Password
        </h2>

        <form className="space-y-6">
          {/* OTP Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="pl-4 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-4 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Resend OTP */}
          <div className="flex justify-end -mt-4">
            <p
              onClick={handleResendOtp}
              className="text-sm text-green-500 cursor-pointer hover:underline"
            >
              Resend OTP
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
