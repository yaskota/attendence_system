import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Teachermain() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState({});
  const { user, setUser, setUserRole } = useAuth();
  const [loading, setLoading] = useState(true); // ✅ loading control

  // ✅ Step 1: Get user profile
  useEffect(() => {
  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/auth/profile', {
        withCredentials: true,
      });

      const fetchedUser = res.data;
      console.log("Fetched user:", fetchedUser);

      // Check directly before setting state
      if (!fetchedUser || Object.keys(fetchedUser).length === 0) {
        navigate("/");
        return;
      }

      // If valid user
      setUser(fetchedUser);
      setUserRole("faculty");
    } catch (err) {
      console.error("Error fetching profile", err);
      navigate("/"); // redirect on error
    } finally {
      setLoading(false);
    }
  };

  getData();
}, []);

  // ✅ Step 2: Redirect if user is null
  useEffect(() => {
    console.log("navigate")
    if (!loading && user === null) {
      navigate("/");
    }
  }, [loading]);

  // ✅ Step 3: Fetch teacher data and class data only after auth
  useEffect(() => {
    if (!loading && user) {
      fetchProfile();
      handledata();
    }
  }, [loading, user]);

  const fetchProfile = async () => {
    console.log("fetchprofile")
    try {
      const res = await axios.get('http://localhost:8080/api/authteacher/teacherdetails', { withCredentials: true });
      setTeacher(res.data);
    } catch (error) {
      console.error("Error fetching teacher profile");
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handledata = async () => {
    console.log("handledata")
    try {
      const res = await axios.get('http://localhost:8080/api/class/gather', { withCredentials: true });
      setClasses(res.data);
    } catch (error) {
      console.log("Error fetching class data");
      if (error.response) {
        console.log("Response error:", error.response.data);
      }
    }
  };

  const handleDelete = async (index) => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/class/delete/${index}`);
      console.log(res.data);
      handledata();
    } catch (error) {
      console.log("Error deleting class");
      if (error.response) {
        console.log('Response error:', error.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-screen text-indigo-600 text-2xl font-bold">
          Loading...
        </div>
      ) : (
        <>
          {/* Teacher Profile */}
          <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row p-8 mb-10">
            <div className="flex justify-center md:justify-start mb-6 md:mb-0 md:mr-10">
              <img
                src={teacher.profile || "/images/profilephoto2.jpg"}
                alt="Teacher"
                className="w-40 h-40 object-cover rounded-full border-4 border-indigo-500"
              />
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-indigo-700">{teacher.name}</h2>
              <div className="text-gray-600 space-y-1">
                <p><strong>Name:</strong> {teacher.name}</p>
                <p><strong>Email:</strong> {teacher.email}</p>
                <p><strong>Faculty Id:</strong> {teacher.teacher_id}</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            Faculty Dashboard
          </h1>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 bg-white rounded-xl shadow-md p-6 flex flex-col space-y-6">
              <button onClick={() => navigate('/subject')} className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
                Add Subject
              </button>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
                Assignments
              </button>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
                Marks
              </button>
              <button onClick={() => navigate('/attendencefilter')} className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition">
                Attendance Filter
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {classes.length === 0 ? (
                <div className="flex justify-center items-center h-full bg-white p-10 rounded-xl shadow-md">
                  <p className="text-gray-500 text-xl">No Classes Created Yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {classes.map((cls, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-2xl font-bold text-indigo-700 mb-4">{cls.subject}</h3>
                        <p className="text-gray-600"><strong>Branch:</strong> {cls.branch}</p>
                        <p className="text-gray-600"><strong>Start Year:</strong> {cls.start_year}</p>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <button
                          onClick={() => navigate('/updatesubject', { state: { classDetails: cls } })}
                          className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg text-sm transition"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm transition"
                        >
                          <FaTrash />
                          Delete
                        </button>
                        <button
                          onClick={() => navigate('/attendence', { state: { classDetails: cls } })}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition"
                        >
                          <FaArrowRight />
                          Enter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Teachermain;
