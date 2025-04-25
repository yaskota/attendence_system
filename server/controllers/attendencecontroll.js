import express from 'express'
import attendencemodel from '../models/attendence.js'
import studentmodel from '../models/student.js'
import teachermodel from '../models/teacher.js'

export const attend=async(req,res)=>{
    const {rollNo,USER_ID,subject,branch,hour}=req.body;
    if(!rollNo || !USER_ID || !subject || !branch || !hour)
    {
        return res.status(400).send({message:"data is missing"});
    }

    try {
        
        const user=await studentmodel.findOne({rollNo});
        if(!user)
        {
            return res.status(400).send({message:"candidate not exist"});
        }
        console.log("aa");
        const teach=await teachermodel.findById(USER_ID);
        if(!teach)
        {
            return res.status(401).send({message:"teacher ID not exist"})
        }
        console.log("bb");
        const year=user.start_year;
        console.log(year);
        const attend=await attendencemodel.findOne({subject,start_year:year,branch});
        if(!attend)
        {
            console.log("cc")
            const students=await studentmodel.find({start_year:year,branch})
            if(students.length ===0)
            {
                return res.status(404).send({message:"no student start from the year"})
            }
            console.log("dd")
            const studentattend=students.map(stud=>({

                rollNo: stud.rollNo,
                studentname:stud.name,
                teachername:teach.name,
                branch,
                start_year:year,
                subject,
                hour,
                totalhour: hour,
                subjectactive: true
            }))
            console.log("ee")
            await attendencemodel.insertMany(studentattend);
            console.log("ff")
            
            console.log({message:"student attendence created"})
        }
        const attend_dance=await attendencemodel.findOne({rollNo, subject,start_year:year,branch})
        if(!attend_dance)
        {
            return res.status(401).send({message:"student not exist in the subject"});
        }
        if(attend_dance.subjectactive===false)
        {
            await attendencemodel.updateMany(
                { start_year:year, branch, subject },
                { $set: { subjectactive: true} ,$inc: {totalhour:hour } }
            );
        }``
        await attendencemodel.updateOne(
            { rollNo,start_year:year, branch, subject },
            {  $inc: { counthour: hour } }
        );

        return res.status(201).send({message:"attendence update succesfully"});

    } catch (error) {
        return res.status(404).send({message:"error in student attendence"},error)
    }

}

export const getattend=async(req,res)=>{
    const{rollNo,branch,subject}=req.body;

    if(!rollNo || !branch || !subject)
    {
        return res.status(400).send({message:"data missing"})   
    }
    try {
        
        const stud_data=await attendencemodel.findOne({rollNo,branch,subject})
        console.log('aa');
        if(!stud_data)
        {
            return res.status(401).send({message:"student data missing in collection"})
        }
        console.log("bb");
        return res.status(200).send({data :stud_data});

    } catch (error) {
        return res.status(404).send({message:"error in get attendence"});
    }
}

export const Delete=async(req,res)=>{
    try {
        const id=req.params.id;
        const user=await attendencemodel.findByIdAndDelete(id);
        if(!user)
        {
            return res.status(401).send({message:"user attendence not found"});
        }
        return res.status(200).send({message:"Data deleted"})
    } catch (error) {
        console.log({message:"error in delete",error});
        return res.status(401).send({message:"error in delete at attendence"});
    }
    
}

