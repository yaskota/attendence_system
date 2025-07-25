import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StudentMain() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [expandedCards, setExpandedCards] = useState([]);

  const { user, setUser, setUserRole } = useAuth();
  const [loading, setLoading] = useState(true); // ✅ loading control

  // ✅ Step 1: Get user profile
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data);
        setUserRole("student");
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    if (user === null) {
      getData();
    } else {
      setLoading(false); // In case user is already set somehow
    }
  }, []);

  // ✅ Step 2: Redirect if user is null
  useEffect(() => {
    if (!loading && user === null) {
      navigate("/");
    }
  }, [loading, user]);

  // ✅ Step 3: Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/authstudent/stduentdetails",
          { withCredentials: true }
        );
        setStudent(res.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    if (user) fetchStudent();
  }, [user]);

  // ✅ Step 4: Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/authstudent/studentattendencedetails",
          { withCredentials: true }
        );
        setAttendanceData(res.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    if (user) fetchAttendance();
  }, [user]);

  // ✅ Expand/Collapse logic
  const toggleExpand = (index) => {
    if (expandedCards.includes(index)) {
      setExpandedCards(expandedCards.filter((i) => i !== index));
    } else {
      setExpandedCards([...expandedCards, index]);
    }
  };

  // ✅ Optional: Loading UI
  if (loading) {
    return (
      <div className="text-center mt-24 text-xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 mt-24">
      {/* Student Details Section */}
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row p-8 mb-10">
        <div className="flex justify-center md:justify-start mb-6 md:mb-0 md:mr-10">
          <img
            src={student.profile || "/images/profilephoto2.jpg"}
            alt="Student"
            className="w-48 h-48 object-cover rounded-full border-4 border-indigo-500"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-indigo-700">{student.name}</h2>
          <div className="text-gray-600 space-y-2">
            <p>
              <strong>Roll No:</strong> {student.rollNo}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Phone:</strong> {student.phno}
            </p>
            <p>
              <strong>Start Year:</strong> {student.start_year}
            </p>
            <p>
              <strong>Branch:</strong> {student.branch}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {attendanceData.map((subject, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 space-y-4 hover:shadow-xl transition-all relative"
          >
            <h3 className="text-2xl font-semibold text-indigo-700">
              {subject.subject}
            </h3>
            <p className="text-gray-600">
              <strong>Teacher:</strong> {subject.teachername}
            </p>
            <p className="text-gray-600">
              <strong>Total Hours:</strong> {subject.totalhour}
            </p>
            <p className="text-gray-600">
              <strong>Attended Hours:</strong> {subject.counthour}
            </p>

            <div className="mt-4">
              <p className="text-gray-800 font-semibold">
                Attendance:{" "}
                {subject.totalhour > 0
                  ? ((subject.counthour / subject.totalhour) * 100).toFixed(2)
                  : "0.00"}
                %
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${
                      subject.totalhour > 0
                        ? (subject.counthour / subject.totalhour) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => toggleExpand(index)}
              className="text-indigo-600 mt-4 hover:underline focus:outline-none"
            >
              {expandedCards.includes(index) ? "See Less" : "See More"}
            </button>

            {expandedCards.includes(index) && (
              <div className="mt-4 space-y-2">
                <h4 className="text-lg font-bold text-gray-700">
                  Attendance Dates:
                </h4>
                <ul className="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto">
                  {(subject.timestamp || []).map((date, idx) => (
                    <li key={idx}>{new Date(date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentMain;
