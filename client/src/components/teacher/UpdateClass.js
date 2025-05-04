import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateClass() {
  const [subjectName, setSubjectName] = useState('');
  const [branch, setBranch] = useState('');
  const [startYear, setStartYear] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { classDetails } = location.state;

  useEffect(() => {
    setSubjectName(classDetails.subject);
    setBranch(classDetails.branch);
    setStartYear(classDetails.start_year);
  }, [classDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classdata = {
        subject: subjectName,
        start_year: startYear,
        branch,
      };
      const res = await axios.post(
        `http://localhost:8080/api/class/update/${classDetails._id}`,
        classdata,
        { withCredentials: true }
      );
      console.log(res.data.message);
      setTimeout(() => {
        navigate('/teachermain');
      }, 2000);
    } catch (error) {
      console.log('error occur in update');
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 mt-20">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          Update Subject
        </h1>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter subject name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter branch"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Start Year</label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter start year"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-lg transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateClass;
