import mongoose from 'mongoose';

type User = {
  email: string;
  password: string;
  username: string;
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your username'],
    minLength: 5,
    maxLength: 16,
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter our password'],
  },
});

const userModel = mongoose.model('user', UserSchema);

export default userModel;
