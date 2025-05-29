    import express from 'express'
    import { delete_unverify_students, deleteById, details, detailsByRollNO, is_Authenticated, login, logout, otp_Send, profileupdate, register, resendOtp, resetpassword, studentattendencedetails, studentdetails, verify_Email } from '../controllers/authstudent.js'
    import userAuth from '../middleware/userauth.js'
    import { validateLogin, validateSignup } from '../middleware/validate.js'
    import multer from "multer";
    // import passport from 'passport';
    import jwt from 'jsonwebtoken'

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

    studentrouter.post('/detailsByRollNo',userAuth, detailsByRollNO);
    studentrouter.delete('/deleteById/:id',deleteById);

    // studentrouter.get('/login/success',(req,res)=>{
    //   if(req.user)
    //   {
    //     console.log(req.user);
    //     res.status(200).json({
    //       error:false,
    //       message:"Succesfully Loged In",
    //       user:req.user,
    //     })
    //   }
    //   else{
    //     res.status(403).json({error:true,message:"Not Authorized"})
    //   }
    // })

    // studentrouter.get('/login/failed',(req,res)=>{
    //   res.status(401).json({error:true,message:"Log in failure",})
    // })

    // studentrouter.get('/google/callback',passport.authenticate('google',{
    //   successRedirect:`${process.env.CLIENT_URL}/studentmain`,
    //   failureRedirect:'/login/failed',
    // }))
    
    // studentrouter.get('/google',passport.authenticate("google",["profile","email"]))


    // studentrouter.get('/logout',(req,res)=>{
    //   req.logout();
    //   res.redirect(process.env.CLIENT_URL)
    // });

    export default studentrouter;

