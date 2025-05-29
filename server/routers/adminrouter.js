import express from 'express';
import { admindetails, login, logout, profileupdate, register, resendOtp, resetpassword } from '../controllers/admincontroller.js';

import userAuth from '../middleware/userauth.js';
 import multer from "multer";

const adminrouter=express.Router()

const storage = multer.memoryStorage();
    const upload = multer({ storage });

adminrouter.post('/register',register)
adminrouter.post('/login',login);
adminrouter.post('/logout',logout);
adminrouter.post('/otp',resendOtp);
adminrouter.post('/resetPassword',resetpassword);
adminrouter.post('/profileupdate',upload.single("photo"),userAuth,profileupdate);
adminrouter.get('/admindetails',userAuth,admindetails);

export default adminrouter