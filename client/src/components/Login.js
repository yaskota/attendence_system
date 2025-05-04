import React from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate=useNavigate();

  
  
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-8 relative"
      style={{
        backgroundImage: `url('/images/collegeimage.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row bg-white bg-opacity-100 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden mt-20 ">

        {/* Left Side - Students */}
        <div className="flex-1 flex flex-col justify-center items-center p-12 space-y-8">
          <h2 className="text-4xl font-bold text-indigo-700">Students</h2>
          <p className="text-black-1000 text-center text-1xl">
            Start your academic journey with us. Access resources, track your progress, and achieve your goals.
          </p>
          <button onClick={()=>{navigate('/studentlogin')}} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-base transition-all">
            Login
          </button>
          <p className="text-sm text-black-1000">
            Don't have an account? <span onClick={()=>{navigate('/studentregister')}} className="text-indigo-600 hover:underline cursor-pointer">Sign Up</span>
          </p>
        </div>

        {/* Vertical Line Divider */}
        <div className="hidden md:block w-px h-[80%] bg-gray-300 self-center"></div>
 {/* 👈 Vertical line */}

        {/* Right Side - Faculty */}
        <div className="flex-1 flex flex-col justify-center items-center p-12 space-y-8">
          <h2 className="text-4xl font-bold text-indigo-700">Faculty</h2>
          <p className="text-black-1000 text-center">
            Manage your classes, guide students, and contribute to shaping the future with our faculty portal.
          </p>
          <button onClick={()=>{navigate('/teacherlogin')}} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-base transition-all">
            Login
          </button>
          <p className="text-sm text-black-1000">
            Don't have an account? <span onClick={()=>{navigate('/teacherregister')}} className="text-indigo-600 hover:underline cursor-pointer">Sign Up</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
