import mongoose from "mongoose";
import { trim } from "zod/v4";

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
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
  location: {
    type: String,
    required: false,
    trim: true,
  },
  showDefaultLocation: {
    type: Boolean,
    default: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  foodPreference: {
    type: String,
    enum: ["Veg", "Non-Veg", "Vegan", "Other"],
    required: false,
  },
  foodPreferenceDescription: {
    type: String,
    required: false,
    trim: true,
  },
  bio: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export { User };
