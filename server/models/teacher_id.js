import mongoose from 'mongoose'

const teacher_idschema=mongoose.Schema({
    id:{
        type:String,
        required:true
    }
})

const teacher_idmodel=mongoose.model('teacher_id',teacher_idschema);

export default teacher_idmodel;