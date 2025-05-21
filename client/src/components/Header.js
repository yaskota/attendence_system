import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [activeLink, setActiveLink] = useState('');
  const { user,userRole,logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout()
    setTimeout(() => {
      navigate('/');
    }, 1000);
    
  };

  const handleSetActive = (to) => {
    setActiveLink(to);
  };

  const goToProfile = () => {
    
    if (userRole === 'student') {
      navigate('/studentprofile');
    } else {
      navigate('/teacherprofile');
    }
    
  }
  const goToHome = () => navigate('/');
  const goToStudent = () => navigate('/student');
  const goToFaculty = () => navigate('/faculty');
  const goToAdminBranch = () => navigate('/adminlogin');

  return (
    <header className="bg-indigo-600 text-white p-4 fixed w-full top-0 left-0 z-10 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={goToHome}>
          AMS
        </div>

        <div className="flex space-x-10 text-lg">
          <div
            className={`cursor-pointer transform transition-transform duration-300 ${
              activeLink === 'adminbranch' ? 'scale-110 text-yellow-300' : 'hover:scale-110 hover:text-yellow-300'
            }`}
            onClick={() => {
              setActiveLink('adminbranch');
              goToAdminBranch();
            }}
          >
            Admin
          </div>

          {['about', 'contact'].map((section) => (
            <Link
              key={section}
              to={section}
              smooth={true}
              duration={500}
              className={`cursor-pointer transform transition-transform duration-300 ${
                activeLink === section ? 'scale-110 text-yellow-300' : 'hover:scale-110 hover:text-yellow-300'
              }`}
              onClick={() => handleSetActive(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Link>
          ))}

          <div
            className={`cursor-pointer transform transition-transform duration-300 ${
              activeLink === 'student' ? 'scale-110 text-yellow-300' : 'hover:scale-110 hover:text-yellow-300'
            }`}
            onClick={() => {
              setActiveLink('student');
              goToStudent();
            }}
          >
            Student
          </div>

          <div
            className={`cursor-pointer transform transition-transform duration-300 ${
              activeLink === 'faculty' ? 'scale-110 text-yellow-300' : 'hover:scale-110 hover:text-yellow-300'
            }`}
            onClick={() => {
              setActiveLink('faculty');
              goToFaculty();
            }}
          >
            Faculty
          </div>
        </div>

        {/* Conditionally render Login or Profile + Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <img
              src={user.profile || "/images/profilephoto2.jpg"}
              alt="Profile"
              onClick={goToProfile}
              className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform"
            />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-400 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
