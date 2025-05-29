import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaSchool,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [startYear, setStartYear] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      console.log("aa");
      const user = {
        name,
        rollNo,
        start_year: startYear,
        email,
        password,
        branch,
        phno: phone,
      };
      console.log("bb");
      const res = await axios.post(
        "http://localhost:8080/api/authstudent/register",
        user,
        {
          withCredentials: true,
        }
      );
      console.log("cc");
      toast.success(res.data.message);
      toast.success(res.data.msg);
      setTimeout(() => {
        navigate("/studentotp", { state: { email } });
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in student register");
    }
  };

  const handleLogin = () => {
    navigate("/studentlogin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-5xl mt-20">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
          Register
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side */}
          <div className="space-y-5">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Roll No */}
            <div className="relative">
              <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Roll No"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Start Year */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="Start Year"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Branch */}
            <div className="relative">
              <FaSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Branch"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-4 rounded-lg hover:bg-pink-600 transition text-lg font-semibold"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-pink-500 hover:underline cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </span>
        </p>
      </div>
      
    </div>
  );
}

export default Register;
