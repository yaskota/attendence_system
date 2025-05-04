import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Otp() {
  const [otp, setOtp] = useState('');
  const navigate=useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const user={
        OTP:otp
      }
      console.log(otp);
      const res=await axios.post('http://localhost:8080/api/authstudent/verifyEmail', user, {
        withCredentials: true
      });
      console.log(res.data.message)
      setTimeout(() => {
        navigate('/studentlogin')
      }, 2000);
    } catch (error) {
      console.log("error occur in otp")
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
          OTP
        </h2>

        <form  className="space-y-6">

          {/* OTP Input */}
          <div className="relative">
            <label 
              htmlFor="otp" 
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all ${otp ? 'text-sm top-1' : 'text-lg'}`}
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-lg"
              required
            />
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

export default Otp;
