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

// Mongoose pre-save hook to hash the password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
  
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt for bcrypt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Continue with the save process
  } catch (error) {
    next(error); // Pass error to next middleware or route handler
  }
});

// Create and export the Admin model
const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
