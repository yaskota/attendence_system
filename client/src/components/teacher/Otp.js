import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Otp() {
  const [otp, setOtp] = useState('');
  const navigate=useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const user={
        OTP:otp
      }
      console.log(otp);
      const res=await axios.post('http://localhost:8080/api/authteacher/verifyOtp', user, {
        withCredentials: true
      });
      console.log(res.data.message)
      setTimeout(() => {
        navigate('/teacherlogin')
      }, 2000);
    } catch (error) {
      console.log("error occur in otp")
      if (error.response) {
        console.log("Response error:", error.response.data);
      }
    }
    
    // Handle OTP verification logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-10">
          OTP
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

export default Otp;
