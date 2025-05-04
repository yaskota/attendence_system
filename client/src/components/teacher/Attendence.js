import React, { useState } from "react";
import { FaIdCard } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Attendence() {
  const [rollNo, setRollNo] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [periods, setPeriods] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { classDetails } = location.state;

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const Data = {
        rollNo,
        subject: classDetails.subject,
        branch: classDetails.branch,
        periods,
        startTime,
        endTime,
      };
      const res = await axios.post(
        "http://localhost:8080/api/attendence/attend",
        Data,
        { withCredentials: true }
      );
      console.log(res.data);
      handledata();
    } catch (error) {
      console.log("error occur in attendence");
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handledata = async () => {
    try {
      const Data = {
        start_year: classDetails.start_year,
        branch: classDetails.branch,
        subject: classDetails.subject,
        startTime,
        endTime,
      };
      const res = await axios.post(
        "http://localhost:8080/api/attendence/getdata",
        Data,
        { withCredentials: true }
      );
      setAttendanceList(res.data);
    } catch (error) {
      console.log("error occur in attendencedata");
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const Data = {
        periods,
      };
      const res = await axios.post(
        `http://localhost:8080/api/attendence/delete/${id}`,
        Data,
        { withCredentials: true }
      );
      console.log(res.data.message);
      handledata();
    } catch (error) {
      console.log("error occur in deleteattendence");
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handleStartReading = () => {
    setIsReading(true);
  };

  const handleStopReading = () => {
    setIsReading(false);
  };

  const handleSaveAttendance = async () => {
    try {
      const Data = {
        start_year: classDetails.start_year,
        branch: classDetails.branch,
        subject: classDetails.subject,
        startTime,
        endTime,
      };
      const res = await axios.post(
        `http://localhost:8080/api/attendence/complete`,
        Data,
        { withCredentials: true }
      );
      console.log(res.data.message);
      setTimeout(() => {
        navigate("/teachermain");
      }, 2000);
    } catch (error) {
      console.log("error occur in completeattendence");
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className="p-8 min-h-screen mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Take Attendance</h2>

      {/* Top Section - Class Details and Time Inputs */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2 max-w-sm">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            Class Details
          </h3>
          <p>
            <strong>Subject:</strong> {classDetails.subject}
          </p>
          <p>
            <strong>Branch:</strong> {classDetails.branch}
          </p>
          <p>
            <strong>Start Year:</strong> {classDetails.start_year}
          </p>
        </div>

        {/* Time Slot + Periods */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2 max-w-sm">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            Time Slot & Periods
          </h3>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Periods
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter number of periods"
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roll No Entry and RFID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-6 text-indigo-600 text-center">
            Enter Roll No
          </h3>
          <form className="flex flex-col items-center space-y-6">
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter Roll Number"
              className="w-64 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-md hover:bg-indigo-500 transition w-28"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center space-y-6">
          <h3 className="text-xl font-semibold text-indigo-600">RFID Reader</h3>
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
            {isReading ? (
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            ) : (
              <FaIdCard className="text-5xl text-indigo-600" />
            )}
          </div>
          {!isReading ? (
            <button
              onClick={handleStartReading}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm transition w-32"
            >
              Start Reading
            </button>
          ) : (
            <button
              onClick={handleStopReading}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm transition w-32"
            >
              Stop Reading
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mt-10 bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-xl font-semibold text-center text-indigo-600 mb-6">
          Attendance List
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-indigo-100">
                <th className="py-2 px-4 border">Roll No</th>
                <th className="py-2 px-4 border">Student</th>
                <th className="py-2 px-4 border">Hours</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((record) => (
                  <tr key={record.id} className="text-center">
                    <td className="py-2 px-4 border">{record.rollNo}</td>
                    <td className="py-2 px-4 border">{record.studentname}</td>
                    <td className="py-2 px-4 border">
                      {record.todayCount*Number(periods)}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-500 hover:bg-red-400 text-white text-xs px-2 py-1 rounded-md transition w-20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-gray-500 py-6">
                    No attendance recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 font-semibold">
            Students Present: {attendanceList.length}
          </p>
          <button
            onClick={handleSaveAttendance}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md text-sm mt-4 md:mt-0"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

export default Attendence;
