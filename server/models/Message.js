import mongoose from "mongoose";


// create db with certain schema structure
const messsageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId ,ref:"User"},
    receiverId: {type: mongoose.Schema.Types.ObjectId ,ref:"User"},
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, defalt: false}
    
},{timestamps: true});

// create the message db with mesageschema
const Message = mongoose.model("Message", messsageSchema);

export default Message;