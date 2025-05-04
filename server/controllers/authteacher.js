import express from 'express'
import teachermodel from '../models/teacher.js'
import teacher_idmodel from '../models/teacher_id.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import transporter from '../nodemail.js'
import cloudinary from "../cloudinary.js";

export const register=async(req,res)=>{
    const {name,email,password,phno,teacher_id}=req.body;
    if(!name || !email || !password || !phno || !teacher_id)
    {
        return res.status(401).send({message:"required data was missing"})
    }

    try {
        
        const userteacher=await teacher_idmodel.findOne({id:teacher_id});
        if(!userteacher)
        {
            return res.status(400).send({message:"you are not a staff"});
        }
        
        const user =await teachermodel.findOne({teacher_id});
        if(user)
        {
            return res.status(400).send({message:"ID is alreay exist"});
        }

        const hashpassword=await bcrypt.hash(password,10);

        const otp=String(Math.floor(10000+Math.random()*90000))


        
        
        const newteacher={
            name,email,
            password:hashpassword,
            phno,teacher_id,
            otp:otp,
            otp_expiry_time:Date.now()+24*60*60*1000
        }

        const User=new teachermodel(newteacher);
        await User.save();

        const token=jwt.sign({id:User._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token ,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge :7*24*60*60*1000
        })

        const verificationMail={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"welcome to JNTU sulthanpur",
            text:`Welcome to JNTU sulthanpur your account has been created by email id ${email} and verify user with otp : ${otp}`
        }

        await transporter.sendMail(verificationMail);

        return res.status(201).send({message:"register succesfullly"})
        
    } catch (error) {
        console.error({message:"error occur in signup",error})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.status(505).send({message:"Data missing"});
    }
    try {
        const user=await teachermodel.findOne({email});
        if(!email)
        {
            return res.status(400).send({message:"email Not exist"});
        }


        const check=await bcrypt.compare(password,user.password);
        if(!check)
        {
            return res.status(404).send({message:"password is incorrect"});
        }

        const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token ,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge :7*24*60*60*1000
        })

        return res.status(200).send({message:"Login succesfully",userRole:"faculty",user});


    } catch (error) {
        console.error({message:"error in login_page",error});
        console.log("error in login page")
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict'
        })

        return res.status(200).send({message:"logout succesfully"})
    } catch (error) {
        console.error({message:"error in login_page",error});
    }
}

export const otp_Send=async(req,res)=>{
    const {USER_ID}=req.body;
        
    const user=await teachermodel.findById(USER_ID);
    console.log({user});
    if(!user)
    {
        return res.status(400).send({message:"User Not found"})
    }
    try {
        
        if(user.user_verify)
        {
            return res.status(200).send({message:"account is already verified"})
        }

        const otp=String(Math.floor(10000+Math.random()*90000))

        const email=user.email;

        user.otp=otp;
        user.otp_expiry_time=Date.now()+24*60*60*1000;

        await user.save();

        const otpEmail={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Account verification OTP",
            text:`your otp is ${otp} . verify your account using this OTP`
        }

        await transporter.sendMail(otpEmail);

        return res.status(200).send({message:"otp send to email succesfully"});

    } catch (error) {
        console.error(error.message)
        return res.status(404).send({message:"error at otp_send",error})
    }
}

export const verify_Email=async(req,res)=>{

    try {
        const {USER_ID,OTP}=req.body;

        const user=await teachermodel.findById(USER_ID)
        
        console.log(user);
        
        if(!user)
        {
            return res.status(400).send({message:"User not found"})
        }

        if(user.otp="" || user.otp!==OTP)
        {
            console.log(user.otp,OTP);
            return res.status(400).send({message:"OTP not valid"})
        }
        if(user.otp_expiry_time<Date.now())
        {
            return res.status(401).send({message:"OTP Expired"});
        }

        user.user_verify=true;
        user.otp="";
        user.otp_expiry_time=0;
        await user.save();

        return res.status(200).send({message:"Email Verified"});

    } catch (error) {
        return res.status(400).send({message:"error in verify_Email",error});
    }
}

export const is_Authenticated=async(req,res)=>{
    try {
        return res.status(200).send({success:true});
    } catch (error) {
        return res.status(400).send({message:error.message});
    }
}

export const resendOtp=async(req,res)=>{
    const {email}=req.body
    if(!email)
    {
        return res.status(400).send({message:"email not found"})
    }
    try {
        const user =await teachermodel.findOne({email})
        if(!user)
        {
            return res.status(401).send({message:"user not found"})
        }
        const otp=String(Math.floor(10000+Math.random()*90000));
        user.resendotp=otp;
        user.resend_otp_expiry_time=Date.now()+10*60*1000;
        await user.save();

        const resend_email={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"reset password",
            text:`verification otp ${otp},used to reset password`
        }

        await transporter.sendMail(resend_email);

        return res.status(200).send({message:"otp send to your email succesfully"})

    } catch (error) {
        console.log(error);
        return res.status(404).send({message:"error at resendOtp",error})
        
    }
}

export const resetpassword=async(req,res)=>{
    const{email,otp,password}=req.body

    if(!email || !otp || !password)
    {
        return res.status(404).send({message:"Data missing"})
    }
    try {
        console.log("aa")
        const user=await teachermodel.findOne({email});
        if(!user)
        {
            return res.status(404).send({message:"user not found"})
        }
        console.log("bb")
        if(user.resendotp=="" || user.resendotp!==otp)
        {
            return res.status(401).send({message:"otp incorrect"})
        }
        if(user.resend_otp_expiry_time<Date.now())
        {
            return res.status(402).send({message:"otp expired"})
        }


        const hashpassword=await bcrypt.hash(password,10)

        user.password=hashpassword
        user.resendotp=""
        user.resend_otp_expiry_time=0
        await user.save()
        return res.status(200).send({message:"password reset succesfully"});

    } catch (error) {
        return res.send(400).send({message:"error in passreset",error})
    }
}
export const profileupdate= async (req,res)=>{
    const {USER_ID}=req.body;
    if(!USER_ID)
    {
      return res.status(400).send({message:"user id not found"})
    }
    const user=await teachermodel.findById(USER_ID);
    if(!user)
    {
      return res.status(401).send({message:"user not found"})
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "myApp" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        
        user.profile=result.secure_url;

        await user.save();
        res.status(200).json(user);
      }
    );

    uploadStream.end(req.file.buffer);
    try {
      
    } catch (error) {
      return res.status(400).send({message:"error occur in profile update"});
    }
}

export const teacherdetails=async(req,res)=>{
    const {USER_ID}=req.body
    try {
        if (!USER_ID) {
            return res.status(400).send({ message: "User ID not found" });
          }
      
          const user = await teachermodel.findById(USER_ID);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
          res.status(200).send(user)
    } catch (error) {
        console.log('error occur in get student details')
    }
  }