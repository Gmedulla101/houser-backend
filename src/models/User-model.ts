import mongoose from 'mongoose';

type User = {
  email: string;
  password: string;
  username: string;
};

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter your username'],
    },
    fullName: {
      type: String,
      required: [true, 'Please enter your full name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter a valid email address'],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['hunter', 'owner'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: Number,
    },
    country: {
      type: String,
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('user', UserSchema);

export default userModel;
