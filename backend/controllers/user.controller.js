import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register= async (req, res)=>{
    try{
        const{fullName, email,phoneNumber ,password,role} = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        };
       let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User Already Exists",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });
        res.status(201).json({
            message:"User registered successfully",
            success:true
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
export const login = async (req, res)=>{
    try{
        const {email, password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        };
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false
            })
        }
        const isMatch = await bcrypt.compare(password ,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            })
        };
        if(role!==user.role){
            return res.status(400).json({
                message:"Account Does Not Exist with Current Role",
                success:false,
            })
        };
        const tokenData ={
            userId:user._id,
        }
        user = {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).cookie("token", token,{maxAge: 24 * 60 * 60 * 1000, httpOnly: true,sameSite:'strict' }).json({
            message:`Welcome Back ${user.fullName}`,
            user,
            success:true,
        });
    } catch(error){
        res.status(500).json({message: error.message});
    }
}
export const logout = (req, res)=>{
    try{
        return res.status(200).cookie("token", "",{maxAge: 0, httpOnly: true,sameSite:'strict' }).json({
            message:"Logged out successfully",
            success:true
        });
    } catch(error){
        res.status(500).json({message: error.message});
    }
}
export const updateProfile= async (req,res)=>{
    try{
        const{fullName, email,phoneNumber,bio, skills} = req.body;
        const file = req.file;
        if(!fullName || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        };
        // cloudinary upload logic yaha likhna hai 
        const skillsArray = skills.split(",");
        const userId = req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User Not Found ",
                success:false
            })
        }
        user.fullName = fullName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.Bio = bio;
        user.profile.Skills = skillsArray;
        await user.save();
    
        user ={
            _id:user._id,
            fullName :user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}