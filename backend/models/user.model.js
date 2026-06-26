import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
         type:String,
         required:true
    },
    role:{
           type:String,
           enum:['student', 'admin', 'recuiter'],
           required:true
    },
    profile:{
        bio:{type:String},
        skills:{type:[String]},
        resume:{type:String} , // url rahega resume ka 
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
             default:""
        } 
    },
},{timestamps:true});
export default User = mongoose.model('User', userSchema);