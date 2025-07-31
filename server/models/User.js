import mongoose from "mongoose";


// create db with certain schema structure
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ""},
    bio: {type: String},
},{timestamps: true});

// create the user db with userschema
const User = mongoose.model("User", userSchema);

export default User;