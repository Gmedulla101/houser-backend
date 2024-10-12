"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PropertiesSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user token'],
    },
}, { timestamps: true });
const propertyModel = mongoose_1.default.model('properties', PropertiesSchema);
exports.default = propertyModel;
