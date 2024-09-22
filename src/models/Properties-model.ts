import mongoose from 'mongoose';

const PropertiesSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    title: {
      type: String,
      required: [true, 'Please give your property a title'],
    },
    desc: {
      type: String,
      required: [true, 'Describe your property'],
    },
    bedroom: {
      type: Number,
    },
    propertyType: {
      enum: [
        'self-con',
        'a room and parlour',
        '2 bedroom flat',
        '3 bedroom flat',
        'bungalow',
        'duplex',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please specify property location'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter property value'],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: [true, 'Please provide user token'],
    },
  },
  { timestamps: true }
);

const propertyModel = mongoose.model('properties', PropertiesSchema);

export default propertyModel;
