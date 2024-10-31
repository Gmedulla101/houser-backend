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
      required: [true, 'Please enter our password'],
    },
    status: {
      type: String,
      enum: ['seeker', 'owner'],
    },
    phoneNumber: {
      type: Number,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('user', UserSchema);

export default userModel;
