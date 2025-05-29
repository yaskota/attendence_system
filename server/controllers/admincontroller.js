import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminmodel from "../models/admin.js";
import transport from "../nodemail.js";
import resetPasswordTemp from "../utils/resetPasswordTemp.js";
import verifyOtpTemp from "../utils/verifyOtpTemp.js";
import sendPasswordTemp from "../utils/sendPasswordTemp.js";
import cloudinary from "../cloudinary.js";

export const register = async (req, res) => {
  const { name, email, phno } = req.body;
  if (!name || !email || !phno) {
    return res.status(401).send({ message: "required data was missing" });
  }

  try {
    const user = await adminmodel.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "Admin is alreay exist" });
    }

    const password = String(Math.floor(10000 + Math.random() * 90000));

    const hashpassword = await bcrypt.hash(password, 10);

    const newAdmin = {
      name,
      email,
      password: hashpassword,
      phno,
    };

    const User = new adminmodel(newAdmin);
    await User.save();

    const verificationMail = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to JNTU sulthanpur",
      html: sendPasswordTemp(name, email, password),
    };

    await transport.sendMail(verificationMail);

    return res
      .status(201)
      .send({
        message: "register succesfullly",
        msg: "password sent to your email",
      });
  } catch (error) {
    console.error({ message: "error occur in signup", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send({ message: "Data missing" });
    }

    const user = await adminmodel.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Password mismatch" });
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

    return res.status(200).send({ message: "Login successful", userRole:"admin",user});
  } catch (error) {
    console.error("Error occurred in admin login:", error);
    return res.status(500).send({ message: "Server error" });
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

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: "please enter email" });
  }
  console.log(email)
  try {
    const user = await adminmodel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "user not found" });
    }
    const otp = String(Math.floor(10000 + Math.random() * 90000));

    const name =user.name;
    user.otp = otp;
    user.otp_expiry_time = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resend_email = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "reset password",
      html: resetPasswordTemp(name,email,otp) 
    };

    await transport.sendMail(resend_email);

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
    const user = await adminmodel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    if (user.otp == "" || user.otp !== otp) {
      return res.status(401).send({ message: "otp incorrect" });
    }
    if (user.otp_expiry_time < Date.now()) {
      return res.status(402).send({ message: "otp expired" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    user.password = hashpassword;
    user.otp = "";
    user.otp_expiry_time = 0;
    await user.save();
    return res.status(200).send({ message: "password reset succesfully" });
  } catch (error) {
    return res.send(400).send({ message: "error in passreset", error });
  }
};

export const profileupdate = async (req, res) => {
  const { USER_ID } = req.body;
  console.log("USER_ID:", USER_ID);

  if (!USER_ID) {
    return res.status(400).send({ message: "user id not found" });
  }

  const user = await adminmodel.findById(USER_ID);
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

export const admindetails = async (req, res) => {
  const { USER_ID } = req.body;
  try {
    if (!USER_ID) {
      return res.status(400).send({ message: "User ID not found" });
    }

    const user = await adminmodel.findById(USER_ID);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("error occur in get student details");
  }
};


