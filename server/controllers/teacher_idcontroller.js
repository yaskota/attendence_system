import express from 'express'

import teacher_id from '../models/teacher_id.js'

export const POST_ID=async(req,res)=>{

    try {
        const {id}=req.body;
        const user=await teacher_id.findOne({id});
        if(user)
        {
            return res.status(401).send({message:"ID already exist"});
        }
        const Userdata={
            id
        }
        const User=await teacher_id(Userdata)
        await User.save();
        return res.status(201).send({message:"ID send succesfully"})

    } catch (error) {
        return res.status(400).send({message:"error in posting of teacher id"});
    }

}