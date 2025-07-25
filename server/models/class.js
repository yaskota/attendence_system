import mongoose from 'mongoose'
import teacher from './teacher.js'

const classSchema=new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    start_year:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teacher',
        required:true
    },
    
    
})
const classmodel=mongoose.model('class',classSchema);

export default classmodel;
