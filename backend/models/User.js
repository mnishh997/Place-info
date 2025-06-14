import mongoose from "mongoose";
import { trim } from "zod/v4";

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    unique: false, 
    trim: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  
});

const User = mongoose.model("User", userSchema);

export { User };
