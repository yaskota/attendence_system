import React, { useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Email() {
  const [email, setEmail] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const user = {
        email,
      };
      const res = await axios.post(
        "http://localhost:8080/api/admin/otp",
        user,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/adminresetpassword", { state: { email } });
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the email sending");
    }
    // Add your axios call here to send email to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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

export default Email;
