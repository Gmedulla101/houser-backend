import mongoose from 'mongoose';

const PropertiesSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: [String],
      required: [true, 'Your listing must have images.'],
    },
    title: {
      type: String,
      required: [true, 'Please give your property a title'],
    },
    desc: {
      type: String,
      required: [true, 'Describe your property'],
    },
    bedrooms: {
      type: Number,
    },
    propertyType: {
      type: String,
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
    featured: {
      type: Boolean,
      default: false,
    },
    /*    status: {
      type: String,
      enum: [
        'Available',
        'Taken',

      ]
    }, */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const propertyModel = mongoose.model('properties', PropertiesSchema);

export default propertyModel;
