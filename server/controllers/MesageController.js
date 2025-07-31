import express from "express";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import  { io, userSocketMap } from "../server.js"

// Get All the user except urself

export const getUsersForSideBar = async (req,res) => {
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) =>{
            const messages = await Message.find({senderId:user._id, receiverId: userId,seen: false});
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers,unseenMessages});
    }
    catch(error){
        console.log(error.message);
        res.json({success: false});
    }
}

// Get all messages for current user

export const getMessages = async (req,res) =>{
    try {
        const { id:selectedUserId } = req.params;
        const myId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        });
        await Message.updateMany({senderId: selectedUserId,receiverId:myId},{seen:true});
        res.json({success: true,message : messages})
    }
    catch(error){
        console.log(error.message);
        res.json({success: false,message: error.message});
    }
}

// api to mark messages as seen 

export const markMessageAsSeen = async (req,res) => {
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true})
    }
    catch(error){
        console.log(error.message);
        res.json({success: false,message: error.message});
    }
}

// send message for particular user

export const sendMessage = async (req,res) =>{
    try{
        const {text,image} =  req.body;
        const receiverId =  req.params.id;
        const senderId = req.user._id;
        
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        
        // Emit message to the receiver 

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        console.log("MESSAGE SENT:", newMessage);

        res.json({success:true,newMessage});
    }
    catch(error){
        console.log(error.message);
        res.json({success: false,message: error.message});
    }
}

