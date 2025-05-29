import express from "express";

import teacher_id from "../models/teacher_id.js";
import AdminModel from "../models/admin.js";

export const POST_ID = async (req, res) => {
  const { id, USER_ID } = req.body;
  try {
    console.log(USER_ID)
    if (!id) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    let user = await AdminModel.findById(USER_ID);
    if (!user) {
      return res.status(200).json({ message: "you have no access" });
    }

    user = await teacher_id.findOne({ id });
    if (user) {
      return res.status(401).send({ message: "ID already exist" });
    }
    const Userdata = {
      id,
    };
    const User = await teacher_id(Userdata);
    await User.save();
    return res.status(201).send({ message: "ID send succesfully" });
  } catch (error) {
    return res.status(400).send({ message: "error in posting of teacher id" });
  }
};
