import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";


function Email() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
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
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/studentresetpassword", { state: { email } });
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the email sending");
    }

    // You can handle the email submission here!
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Heading Styled Like the Register Page */}
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
          Email
        </h2>

        <form className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-4 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
      
    </div>
  );
}

export default Email;
