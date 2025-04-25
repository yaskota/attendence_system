import mongoose from 'mongoose'

const attendenceSchema=new mongoose.Schema({
    rollNo:{
        type:String,
        required:true
    },
    studentname:{
        type:String,
        required:true
    },
    start_year:{
        type:Number,
        required:true
    },
    teachername:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    subjectactive:{
        type:Boolean,
        default:false
    },
    hour:{
        type:Number,
        required:true
    },
    counthour:{
        type:Number,
        default:0
    },
    totalhour:{
        type:Number,
        default:0
    }
})

const attendencemodel=mongoose.model('attendence',attendenceSchema);

export default attendencemodel;