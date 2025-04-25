import express from 'express'
import { delete_unverify_students, is_Authenticated, login, logout, otp_Send, register, resendOtp, resetpassword, verify_Email } from '../controllers/authstudent.js'
import userAuth from '../middleware/userauth.js'
import { validateLogin, validateSignup } from '../middleware/validate.js'

const studentrouter=express.Router()

studentrouter.post('/register',validateSignup,register)
studentrouter.post('/login',validateLogin,login)
studentrouter.post('/logout',logout)
studentrouter.post('/otpSend',userAuth,otp_Send)
studentrouter.post('/verifyEmail',userAuth,verify_Email)
studentrouter.post('/is_Auth',userAuth,is_Authenticated)
studentrouter.post('/resendOtp',userAuth,resendOtp)
studentrouter.post('/resetPassword',userAuth,resetpassword)
studentrouter.delete('/deleteUnverifiedStudents',delete_unverify_students);


export default studentrouter;

