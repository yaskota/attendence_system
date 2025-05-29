import express from "express";
import studentmodel from "../models/student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import transporter from "../nodemail.js";
import cloudinary from "../cloudinary.js";
import attendencemodel from "../models/attendence.js";
import teachermodel from "../models/teacher.js";
import verifyOtpTemp from "../utils/verifyOtpTemp.js";
import resetPasswordTemp from "../utils/resetPasswordTemp.js";
import adminmodel from "../models/admin.js";

export const register = async (req, res) => {
  const { name, rollNo, start_year, email, password, phno, branch } = req.body;
  if (
    !name ||
    !rollNo ||
    !start_year ||
    !email ||
    !password ||
    !phno ||
    !branch
  ) {
    return res.status(401).send({ message: "required data was missing" });
  }

  try {
    const studentId = await studentmodel.findOne({ rollNo });

    if (studentId) {
      return res.status(400).send({ message: "RollNo is alreay exist" });
    }
    const user = await studentmodel.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "mail is alreay exist" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const otp = String(Math.floor(10000 + Math.random() * 90000));

    const newstudent = {
      name,
      email,
      rollNo,
      start_year,
      password: hashpassword,
      phno,
      branch: branch.toUpperCase(),
      otp: otp,
      otp_expiry_time: Date.now() + 5 * 60 * 1000,
    };

    const User = new studentmodel(newstudent);
    await User.save();

    const verificationMail = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to JNTU sulthanpur",
      html: verifyOtpTemp(name, email, otp),
    };

    await transporter.sendMail(verificationMail);

    return res
      .status(201)
      .send({
        message: "register succesfullly",
        msg: "otp sent to your email",
      });
  } catch (error) {
    console.error({ message: "error occur in signup", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(505).send({ message: "data missing" });
  }
  try {
    const user = await studentmodel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "email not exist" });
    }
    if (!user.user_verify) {
      return res.status(400).send({ message: "user not verified" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(404).send({ message: "password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .send({ message: "login succesfully", userRole: "student", user });
  } catch (error) {
    console.error({ message: "error in login_page", error });
    console.log("error in login page");
    return res.status(400).send({ message: "error occur in login" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).send({ message: "logout succesfully" });
  } catch (error) {
    console.error({ message: "error in login_page", error });
  }
};

export const otp_Send = async (req, res) => {
  const { USER_ID } = req.body;

  const user = await studentmodel.findById(USER_ID);
  console.log({ user });
  if (!user) {
    return res.status(400).send({ message: "User Not found" });
  }
  try {
    if (user.user_verify) {
      return res.status(200).send({ message: "account is already verified" });
    }

    const otp = String(Math.floor(10000 + Math.random() * 90000));

    const email = user.email;
    const name = user.name;

    user.otp = otp;
    user.otp_expiry_time = Date.now() + 5 * 60 * 1000;

    await user.save();

    const otpEmail = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account verification OTP",
      html: resetPasswordTemp(name, email, otp),
    };

    await transporter.sendMail(otpEmail);

    return res.status(200).send({ message: "otp send to email succesfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(404).send({ message: "error at otp_send", error });
  }
};

export const verify_Email = async (req, res) => {
  try {
    const { email, OTP } = req.body;

    const user = await studentmodel.findOne({ email });

    console.log(user);

    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }
    console.log("aa");
    if ((user.otp = "" || user.otp !== OTP)) {
      return res.status(400).send({ message: "OTP not valid" });
    }
    console.log("bb");
    if (user.otp_expiry_time < Date.now()) {
      return res.status(401).send({ message: "OTP Expired" });
    }

    user.user_verify = true;
    user.otp = "";
    user.otp_expiry_time = 0;
    await user.save();
    console.log("cc");
    return res.status(200).send({ message: "Email Verified" });
  } catch (error) {
    return res.status(400).send({ message: "error in verify_Email", error });
  }
};

export const is_Authenticated = async (req, res) => {
  try {
    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: "please enter email" });
  }
  try {
    const user = await studentmodel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "user not found" });
    }
    const otp = String(Math.floor(10000 + Math.random() * 90000));

    const name = user.name;
    user.resendotp = otp;
    user.resend_otp_expiry_time = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resend_email = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "reset password",
      html: resetPasswordTemp(name, email, otp),
    };

    await transporter.sendMail(resend_email);

    return res
      .status(200)
      .send({ message: "otp send to your email succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "error at resendOtp", error });
  }
};

export const resetpassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(404).send({ message: "data missing" });
  }
  try {
    const user = await studentmodel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    if (user.resendotp == "" || user.resendotp !== otp) {
      return res.status(401).send({ message: "otp incorrect" });
    }
    if (user.resend_otp_expiry_time < Date.now()) {
      return res.status(402).send({ message: "otp expired" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    user.password = hashpassword;
    user.resendotp = "";
    user.resend_otp_expiry_time = 0;
    await user.save();
    return res.status(200).send({ message: "password reset succesfully" });
  } catch (error) {
    return res.send(400).send({ message: "error in passreset", error });
  }
};

export const delete_unverify_students = async (req, res) => {
  try {
    const currentTime = Date.now();
    const verify = await studentmodel.deleteMany({
      user_verify: false,
      otp_expiry_time: { $lt: currentTime },
    });
    return res.status(400).send({ message: "Unverified students deleted" });
  } catch (error) {
    console.log(error.data);
    return res.status(401).send({
      message: "error occur in delete unverified student deletion",
      error,
    });
  }
};

export const profileupdate = async (req, res) => {
  const { USER_ID } = req.body;
  console.log("USER_ID:", USER_ID);

  if (!USER_ID) {
    return res.status(400).send({ message: "user id not found" });
  }

  const user = await studentmodel.findById(USER_ID);
  if (!user) {
    return res.status(401).send({ message: "user not found" });
  }

  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "myApp" },
    async (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ error });
      }

      user.profile = result.secure_url;
      await user.save();
      return res
        .status(200)
        .send({ user, message: "profile update successfully" });
    }
  );

  uploadStream.end(req.file.buffer);
};

export const studentattendencedetails = async (req, res) => {
  const { USER_ID } = req.body;
  try {
    if (!USER_ID) {
      return res.status(400).send({ message: "User ID not found" });
    }

    const user = await studentmodel.findById(USER_ID);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { rollNo } = user;

    const records = await attendencemodel.find({ rollNo });

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this roll number." });
    }

    // Group by subject
    const subjectMap = {};

    records.forEach((record) => {
      const {
        subject,
        counthour,
        totalhour,
        studentname,
        branch,
        start_year,
        teachername,
        timestamp,
      } = record;

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          counthour: 0,
          totalhour: 0,
          studentname,
          rollNo,
          branch,
          start_year,
          teachername,
          timestamp, // latest timestamp if needed
        };
      }

      subjectMap[subject].counthour += counthour;
      subjectMap[subject].totalhour += totalhour;
      subjectMap[subject].timestamp = timestamp; // overwrites, will be the latest if records are sorted
    });

    const result = Object.values(subjectMap).map((item) => ({
      ...item,
      attendancePercentage: item.totalhour
        ? ((item.counthour / item.totalhour) * 100).toFixed(2)
        : "0.00",
    }));

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({
      message: "Error occurred in get student attendece details",
      error: error.message,
    });
  }
};

export const studentdetails = async (req, res) => {
  const { USER_ID } = req.body;
  try {
    if (!USER_ID) {
      return res.status(400).send({ message: "User ID not found" });
    }

    const user = await studentmodel.findById(USER_ID);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("error occur in get student details");
  }
};

export const details = async (req, res) => {
  const { USER_ID } = req.body;

  try {
    if (!USER_ID) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    let user = await studentmodel.findById(USER_ID);
    if (user) {
      return res
        .status(200)
        .json({ message: "Student found", userRole: "student", user });
    }

    user = await teachermodel.findById(USER_ID);
    if (user) {
      return res
        .status(200)
        .json({ message: "Faculty found", userRole: "faculty", user });
    }

    user = await adminmodel.findById(USER_ID);
    if (user) {
      return res
        .status(200)
        .json({ message: "Admin found", userRole: "admin", user });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error in details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const detailsByRollNO = async (req,res) => {
  const { rollNo, USER_ID } = req.body;
  try {
    
    if (!USER_ID) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    let user = await adminmodel.findById(USER_ID);
    if (!user) {
      return res.status(200).json({ message: "you have no access" });
    }
    if (!rollNo) {
      return res.status(404).json({ message: "Data Missing" });
    }
    user = await studentmodel.findOne({ rollNo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteById = async (req,res) => {
  const ID = req.params.id;
  try {
    
    if (!ID) {
      return res.status(404).json({ message: "ID not found" });
    }
    let user= await studentmodel.findOne({rollNo:ID});
     user = await studentmodel.findByIdAndDelete(user._id);
    return res.status(200).json({ message: "student removed" });
  } catch (error) {
    console.error("Error in details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
