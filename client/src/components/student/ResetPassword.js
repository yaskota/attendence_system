import axios from "axios";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email,
        otp,
        password: newPassword,
      };
      const res = await axios.post(
        "http://localhost:8080/api/authstudent/resetPassword",
        user,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/studentlogin");
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in reset password");
    }

    // Handle reset password logic here
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email,
      };
      const res = await axios.post(
        "http://localhost:8080/api/authstudent/resendOtp",
        user,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.message);
      toast.success(res.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in resend otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
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
              className="pl-4 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* New Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-4 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <div
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </div>
          </div>

          {/* Resend OTP Link */}
          <div className="flex justify-end -mt-2 mb-4">
            <p
              className="text-sm text-pink-500 cursor-pointer hover:underline"
              onClick={handleResendOtp}
            >
              Resend OTP
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
      
    </div>
  );
}

export default ResetPassword;
