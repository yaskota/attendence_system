import express from 'express'
import { is_Authenticated, login, logout, otp_Send, profileupdate, register, resendOtp, resetpassword, teacherdetails, verify_Email } from '../controllers/authteacher.js';
import userAuth from '../middleware/userauth.js';
import multer from "multer";
import { validateLogin, validateregister, validateSignup } from '../middleware/validate.js';

const teacherrouter=express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

teacherrouter.post('/register',validateregister,register);
teacherrouter.post('/login',validateLogin,login);
teacherrouter.post('/logout',logout);
teacherrouter.post('/otpSend',userAuth,otp_Send);
teacherrouter.post('/verifyOtp',userAuth,verify_Email);
teacherrouter.post('/is_Auth',userAuth,is_Authenticated);
teacherrouter.post('/resendOtp',userAuth,resendOtp);
teacherrouter.post('/resetpassword',userAuth,resetpassword);
teacherrouter.post('/profileupdate',upload.single("photo"),userAuth,profileupdate);
teacherrouter.get('/teacherdetails',userAuth,teacherdetails);

export default teacherrouter;