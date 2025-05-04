import mongoose from 'mongoose'

const teacherschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phno:{
        type:String,
        required:true
    },
    teacher_id:{
        type:String,
        required:true,
    },
    user_verify:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:""
    },
    otp_expiry_time:{
        type:Number,
        default:0
    },
    resendotp:{
        type:String,
        default:""
    },
    resend_otp_expiry_time:{
        type:Number,
        default:0
    },
    profile:{
        type:String
    }

})

const teachermodel=mongoose.model('teacher',teacherschema);

export default teachermodel;