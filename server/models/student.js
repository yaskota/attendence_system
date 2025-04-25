import mongoose from 'mongoose'

const studentschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rollNo:{
        type:String,
        required:true,
        unique: true
    },
    start_year:{
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
    branch:{
        type:String,
        required:true
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
    }
})

const studentmodel=mongoose.model('students',studentschema)

export default studentmodel;