import express from 'express'
import classmodel from '../models/class.js'

export const create=async(req,res)=>{
    const {subject,year,hour,branch,USER_ID}=req.body;

    if(!subject || !year || !hour || !branch || !USER_ID)
    {
        return res.status(400).send({message:"class details not found"})
    }
    try {

        const classroom={
            subject,
            year,
            hour,
            branch,
            teacherId:USER_ID
        };
        const Class=new classmodel(classroom);
        await Class.save();

        return res.status(201).send({message:"class is created"})
        
    } catch (error) {
        return res.status(404).send({message:"error in creating class",error})
    }
}

export const gather=async(req,res)=>{
    const {USER_ID}=req.body;

    if(!USER_ID)
    {
        return res.status(400).send({message:"userId not found"})
    }

    try {
        
        const user=await classmodel.find({teacherId:USER_ID})
        if(!user)
        {
            return res.status(200).send({message:"classes not found"})
        }
        console.log(user)
        return res.status(200).send(user);

    } catch (error) {
        return res.status(404).send({message:"error in gather teacher object data"})
    }

}

export const Delete=async(req,res)=>{
    try {
        const id=req.params.id;
        const user=await classmodel.findByIdAndDelete(id);
        if(!user)
        {
            return res.status(401).send({message:"class not found"});
        }
        return res.status(200).send({message:"class deleted"});
    } catch (error) {
        console.log(error);
        return res.status(400).send({message:"error occur in delete in class"});
    }
    
}

export const Update=async(req,res)=>{

    try {
        const id=req.params.id;
        const {subject,year,hour,branch}=req.body;
        if(!subject || !year || !hour || !branch )
        {
            return res.status(400).send({message:"class details not found"});
        }
        const user=await classmodel.findByIdAndUpdate(
            id,
            {
                subject,year,hour,branch
            }
        )
        if(!user)
        {
            return res.status(401).send({message:"class not found"});
        }
        return res.status(200).send({message:"class is updated"});
    } catch (error) {
        console.log({message:"error in update",error});
        return res.status(500).send({message:"error in update class"});
    }

    
}