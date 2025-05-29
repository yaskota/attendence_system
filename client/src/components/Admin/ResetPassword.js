import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 Import eye icons

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 New state
  const navigate = useNavigate();
  const location = useLocation();
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
        "http://localhost:8080/api/admin/resetPassword",
        user,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/adminlogin");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
      console.log("error occur in reset password");
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/otp",
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
      console.log("error occur in resend otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-indigo-600 hover:underline"
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
