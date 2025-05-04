import React, { useState } from 'react';
import axios from 'axios'

function Main() {
  const [teacherId, setTeacherId] = useState('');

  const handleTeacherSubmit = async(e) => {
    e.preventDefault();
    try {
        const Data={id:teacherId}
        const res=await axios.post('http://localhost:8080/api/teacher_id',Data,{withCredentials:true})
        console.log(res.data.message);

    } catch (error) {
        console.log("error occur in admin id submit")
        
    }
  };

  const handleSendToRFID = () => {
    console.log('Sending data to student RFID cards...');
    // Your logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Card 1: Teacher ID Submission */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Submit Teacher ID</h2>
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
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Send Data to Student RFID</h2>
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
    </div>
  );
}

export default Main;
