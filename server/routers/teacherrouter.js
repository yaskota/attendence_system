import express from 'express'
import { delete_unverify_teachers, is_Authenticated, login, logout, otp_Send, profileupdate, register, resendOtp, resetpassword, teacherdetails, verify_Email } from '../controllers/authteacher.js';
import userAuth from '../middleware/userauth.js';
import multer from "multer";
import { validateLogin, validateregister, validateSignup } from '../middleware/validate.js';

const teacherrouter=express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

teacherrouter.post('/register',validateregister,register);
teacherrouter.post('/login',validateLogin,login);
teacherrouter.post('/logout',logout);
teacherrouter.post('/otpSend',otp_Send);
teacherrouter.post('/verifyOtp',verify_Email);
teacherrouter.post('/is_Auth',userAuth,is_Authenticated);
teacherrouter.post('/resendOtp',resendOtp);
teacherrouter.post('/resetpassword',resetpassword);
teacherrouter.post('/profileupdate',upload.single("photo"),userAuth,profileupdate);
teacherrouter.get('/teacherdetails',userAuth,teacherdetails);
teacherrouter.delete('/deleteunverifiedteachers',delete_unverify_teachers)

export default teacherrouter;