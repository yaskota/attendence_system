import { Router } from "express";
import passport from "passport";
import studentmodel from "../models/student.js";

import jwt from "jsonwebtoken";
import teachermodel from "../models/teacher.js";
import AdminModel from "../models/admin.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
    session: true,
  }),
  async (req, res) => {
    try {
      const email = req.user?.emails?.[0]?.value;

      if (!email) {
        console.log("Email not available in profile");
        return res.redirect("http://localhost:3000");
      }

      console.log("Authenticated email:", email);

      let user = await studentmodel.findOne({ email });
      console.log(user);
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect("http://localhost:3000/studentmain");
      }
       user = await teachermodel.findOne({ email });
      console.log(user);
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect("http://localhost:3000/teachermain");
      }
      user = await AdminModel.findOne({ email });
      console.log(user);
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect("http://localhost:3000/adminmain");
      }
      return res.redirect("http://localhost:3000"); // fallback redirect if not in DB
    } catch (error) {
      console.error("Error in Google callback:", error);
      return res.redirect("http://localhost:3000");
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

router.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const email = req.user?.emails?.[0]?.value;
      let user = await studentmodel.findOne({ email }).lean(); // lean() returns plain object
      if(user)
      {
        return res.json(user);
      }
      user = await teachermodel.findOne({ email }).lean();
      if(user)
      {
        return res.json(user);
      }
      user = await AdminModel.findOne({ email }).lean();
      if(user)
      {
        return res.json(user);
      }
      return res.json(user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
