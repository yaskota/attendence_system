import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Main() {
  const [teacherId, setTeacherId] = useState("");
  const [teacherData, setTeacherData] = useState(null);

  const [studentRoll, setStudentRoll] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [searchTeacherId, setSearchTeacherId] = useState("");

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      const Data = { id: teacherId };
      const res = await axios.post(
        "http://localhost:8080/api/teacher_id",
        Data,
        { withCredentials: true }
      );
      console.log(res.data.message);
      toast.success(res.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the faculty id sending");
    }
  };

  const handleSendToRFID = () => {
    console.log("Sending data to student RFID cards...");
    // Your logic here
  };

  // 🔽 Additional Features Start Here 🔽

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const user={rollNo:studentRoll}
      console.log(user)
      const res = await axios.post(
        'http://localhost:8080/api/authstudent/detailsByRollNo',user,
        { withCredentials: true }
      );
      setStudentData(res.data);
      toast.success("Student details fetched!");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error at fetching student details")
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/authstudent/deleteById/${studentRoll}`, {
        withCredentials: true,
      });
      setStudentData(null);
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  

  const handleSearchTeacher = async (e) => {
    e.preventDefault();
  
    try {
      const user={teacher_id:searchTeacherId}
      console.log(user)
      const res = await axios.post(
        `http://localhost:8080/api/authteacher/detailsById`,user,
        { withCredentials: true }
      );
      setTeacherData(res.data);
      toast.success("Teacher details fetched!");
    } catch (error) {
      toast.error("Failed to fetch teacher");
    }
  };

  const handleDeleteTeacher = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/authteacher/deleteById/${searchTeacherId}`, {
        withCredentials: true,
      });
      setTeacherData(null);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-start p-4 pt-24 pb-16 space-y-10">

      {/* 🔒 Original Layout - Don't Touch */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card 1: Teacher ID Submission */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Submit Teacher ID
          </h2>
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Card 2: Send to RFID */}
        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              Send Data to Student RFID
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button below to transfer today's data to all student RFID cards.
            </p>
          </div>
          <button
            onClick={handleSendToRFID}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-200"
          >
            Send to RFID
          </button>
        </div>
      </div>

      {/* 🔄 Extra: Fetch Student by Roll No */}
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-green-600">Get Student Details</h2>
        <form onSubmit={handleStudentSubmit} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={studentRoll}
            onChange={(e) => setStudentRoll(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>

        {studentData && (
          <div className="p-4 bg-gray-100 rounded shadow">
            <p><strong>Roll No:</strong> {studentData.rollNo}</p>
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Phone:</strong> {studentData.phno}</p>
            <button
              onClick={handleDeleteStudent}
              className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Delete Student
            </button>
          </div>
        )}
      </div>

      {/* 🔄 Extra: Fetch Teacher by Teacher ID */}
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Get Teacher Details</h2>
        <form onSubmit={handleSearchTeacher} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Teacher ID"
            value={searchTeacherId}
            onChange={(e) => setSearchTeacherId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        {teacherData && (
          <div className="p-4 bg-gray-100 rounded shadow">
            <p><strong>Name:</strong> {teacherData.name}</p>
            <p><strong>Email:</strong> {teacherData.email}</p>
            <p><strong>Phone:</strong> {teacherData.phno}</p>
            <button
              onClick={handleDeleteTeacher}
              className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Delete Teacher
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
