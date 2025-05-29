import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getAdminDetails = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get("http://localhost:8080/api/admin/admindetails", {
          withCredentials: true,
        });
        setUser(res.data);
        console.log(res);
      } catch (error) {
        console.log("Error fetching admin details:", error);
        toast.error("Failed to load admin details");
      }
    };
    getAdminDetails();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(
        "http://localhost:8080/api/admin/profileupdate",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile image");
      console.log("Profile update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl p-10 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">
        
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.profile || '/images/profilephoto2.jpg'}
            alt="Admin Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-600 shadow-md"
          />
          <label className="mt-5 inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-indigo-700 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">Admin Profile</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p><span className="font-semibold text-gray-900">Name:</span> {user.name || 'N/A'}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {user.email || 'N/A'}</p>
            <p><span className="font-semibold text-gray-900">Phone:</span> {user.phno || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
