import express from 'express'
import { is_Authenticated, login, logout, otp_Send, register, resendOtp, resetpassword, verify_Email } from '../controllers/authteacher.js';
import userAuth from '../middleware/userauth.js';


const teacherrouter=express.Router();

teacherrouter.post('/register',register);
teacherrouter.post('/login',login);
teacherrouter.post('/logout',logout);
teacherrouter.post('/otpSend',userAuth,otp_Send);
teacherrouter.post('/verifyOtp',userAuth,verify_Email);
teacherrouter.post('/is_Auth',userAuth,is_Authenticated);
teacherrouter.post('/resendOtp',userAuth,resendOtp);
teacherrouter.post('/resetpassword',userAuth,resetpassword);

export default teacherrouter;