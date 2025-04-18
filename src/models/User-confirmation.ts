import mongoose from 'mongoose';

const UserConfirmationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  confirmationCode: {
    type: Number,
  },
  userEmail: {
    type: String,
    ref: 'user',
  },
});

const confirmationModel = mongoose.model(
  'user-confirmation',
  UserConfirmationSchema
);

export default confirmationModel;
