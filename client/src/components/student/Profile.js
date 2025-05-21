import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userdetails = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          "http://localhost:8080/api/authstudent/stduentdetails",
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("something went wrong");
        }
        console.log("error occur in the deleting student data");
      }
    };
    userdetails();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(
        "http://localhost:8080/api/authstudent/profileupdate",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile Updated successfully");
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("something went wrong");
      }
      console.log("error occur in the profile update");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl p-10 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.profile || "/images/profilephoto2.jpg"}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-green-500 shadow-md"
          />
          <label className="mt-5 inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-green-700 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Student Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-green-800 mb-6 border-b pb-2">
            Student Profile
          </h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Name:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Roll No:</span>{" "}
              {user.rollNo}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Phone:</span>{" "}
              {user.phno}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Branch:</span>{" "}
              {user.branch}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Start Year:</span>{" "}
              {user.start_year}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Profile;
