import express from 'express'
import { delete_unverify_students, details, is_Authenticated, login, logout, otp_Send, profileupdate, register, resendOtp, resetpassword, studentattendencedetails, studentdetails, verify_Email } from '../controllers/authstudent.js'
import userAuth from '../middleware/userauth.js'
import { validateLogin, validateSignup } from '../middleware/validate.js'
import multer from "multer";
const studentrouter=express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });

studentrouter.post('/register',validateSignup,register)
studentrouter.post('/login',validateLogin,login)
studentrouter.post('/logout',logout)
studentrouter.post('/otpSend',otp_Send)
studentrouter.post('/verifyEmail',verify_Email)
studentrouter.post('/is_Auth',userAuth,is_Authenticated)
studentrouter.post('/resendOtp',resendOtp)
studentrouter.post('/resetPassword',resetpassword)
studentrouter.delete('/deleteUnverifiedStudents',delete_unverify_students);

studentrouter.post('/profileupdate', upload.single("photo"), userAuth, profileupdate);

studentrouter.get('/studentattendencedetails',userAuth,studentattendencedetails);
studentrouter.get('/stduentdetails',userAuth,studentdetails);
studentrouter.get('/details',userAuth,details);

export default studentrouter;

