import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Admin schema definition
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phno: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: "",
  },
  otp_expiry_time: {
    type: Number,
    default: 0,
  },
  profile:{
    type:String
  }
});

// Create and export the Admin model
const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
