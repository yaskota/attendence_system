import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 import useAuth

function Faculty() {
  const { user, userRole } = useAuth(); // 👈 get user and role from context
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userRole === 'faculty') {
      navigate('/teachermain');
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Section - Text Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-10 text-center md:text-left bg-white">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-6">
  Empower the Future with Us
</h1>
<p className="text-lg text-gray-600 mb-8">
  As a faculty member, you can efficiently record and monitor student attendance, ensuring accuracy and accountability. Join us in fostering a culture of discipline and academic excellence.
</p>

          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-lg transition-all"
            onClick={() => navigate('/teacherlogin')} // 👈 fallback login
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <img
          src="/images/fornt.jpg"
          alt="Faculty"
          className="w-full max-w-md rounded-2xl shadow-lg object-cover"
        />
      </div>
    </div>
  );
}

export default Faculty;
