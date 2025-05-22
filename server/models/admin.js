import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Admin schema definition
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: "yaswanth@gmail.com",
  },
  password: {
    type: String,
    required: true,
    default: "1234",
  },
});


// Create and export the Admin model
const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
