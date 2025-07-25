import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Student() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userRole === 'student') {
      navigate('/studentmain');
    }
  }, [user, userRole, navigate]);

  // ❌ Otherwise, show the default Get Started page
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 bg-gray-50">
      {/* Left Content */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <h1 className="text-5xl font-bold text-indigo-700">Welcome Students</h1>
<p className="text-lg text-gray-700">
  Access your personal profile and attendance records easily with AMS. Stay informed, track your progress, and take charge of your academic journey.
</p>

        <button
          onClick={() => navigate('/studentlogin')}
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg transition-all"
        >
          Get Started
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <img
          src="/images/front2.jpg"
          alt="Student Learning"
          className="w-full max-w-md rounded-3xl shadow-lg object-cover"
        />
      </div>
    </div>
  );
}

export default Student;
