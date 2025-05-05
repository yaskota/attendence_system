import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

function ResetPassword() {
  const navigate=useNavigate()
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const location=useLocation()
  const email=location.state?.email
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const user={
        email,otp,password:newPassword
      }
      const res = await axios.post('http://localhost:8080/api/authteacher/resetPassword', user, {
        withCredentials: true
      })
      toast.success(res.data.message);
      setTimeout(() => {
        navigate('/teacherlogin')
      },2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the deleting student data");


    }
   
    // Handle reset password logic here
  };

  const handleResendOtp = async(e) => {
    e.preventDefault();
    try {
      const user={
        email
      }
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
      console.log("error occur in the deleting student data");


    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-10">
          Reset Password
        </h2>

        <form  className="space-y-6">

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

          {/* New Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-4 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
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
      <ToastContainer /> 
    </div>
  );
}

export default ResetPassword;
