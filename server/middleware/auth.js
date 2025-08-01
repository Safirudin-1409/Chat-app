import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import  { configDotenv } from 'dotenv';
configDotenv();

//middleware to protect routes

export const protectRoute = async (req,res,next) => {
    try{
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "User not found"});
        }
        req.user = user;
        next();
    }
    catch(error){
        // console.error(error.message);
        // res.json({success: false, message: error.message});
        console.error("JWT Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}