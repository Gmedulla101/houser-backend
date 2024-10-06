"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProp = exports.updateProp = exports.createProp = exports.getUserProp = exports.getFeaturedProps = exports.getProp = exports.getAllProps = void 0;
const Properties_model_1 = __importDefault(require("../models/Properties-model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
//GETTING ALL PROPERTIES
const getAllProps = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, propertyType, bedrooms, pricingRange } = req.query;
    let queryObject = {};
    if (location) {
        queryObject.location = location;
    }
    if (propertyType) {
        queryObject.propertyType = propertyType;
    }
    if (bedrooms) {
        queryObject.bedrooms = bedrooms;
    }
    if (pricingRange) {
        queryObject.pricingRange = pricingRange;
    }
    const allProps = yield Properties_model_1.default
        .find(queryObject)
        .sort({ createdAt: -1 });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: true, data: allProps, nbHits: allProps.length });
}));
exports.getAllProps = getAllProps;
//GETTING FEATURED PROPERTIES
const getFeaturedProps = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, propertyType, bedrooms, pricingRange } = req.query;
    let queryObject = {
        featured: true,
    };
    if (location) {
        queryObject.location = location;
    }
    if (propertyType) {
        queryObject.propertyType = propertyType;
    }
    if (bedrooms) {
        queryObject.bedrooms = bedrooms;
    }
    if (pricingRange) {
        queryObject.pricingRange = pricingRange;
    }
    const featuredProps = yield Properties_model_1.default
        .find(queryObject)
        .sort({ createdAt: -1 });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: true, data: featuredProps, nbHits: featuredProps.length });
}));
exports.getFeaturedProps = getFeaturedProps;
//GETTING SINGLE PROPERTY
const getProp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const prop = yield Properties_model_1.default.findOne({ _id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: prop });
}));
exports.getProp = getProp;
//GETTING USER PROPERTIES
const getUserProp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, propertyType, bedrooms, pricingRange } = req.query;
    let queryObject = {
        createdBy: req.user.userId,
    };
    if (location) {
        queryObject.location = location;
    }
    if (propertyType) {
        queryObject.propertyType = propertyType;
    }
    if (bedrooms) {
        queryObject.bedrooms = bedrooms;
    }
    if (pricingRange) {
        queryObject.pricingRange = pricingRange;
    }
    const userProps = yield Properties_model_1.default.find(queryObject);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ success: true, data: userProps, nbHits: userProps.length });
}));
exports.getUserProp = getUserProp;
//CREATING PROPERTY
const createProp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.createdBy = req.user.userId;
    const newProperty = yield Properties_model_1.default.create(Object.assign({}, req.body));
    res.status(http_status_codes_1.StatusCodes.OK).json({ sucess: true, data: newProperty });
}));
exports.createProp = createProp;
//DELETING PROPERTY
const deleteProp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const deletedProp = yield Properties_model_1.default.findOneAndDelete({ _id, createdBy: req.user.userId }, req.body);
    if (!deletedProp) {
        throw new errors_1.NotFoundError(`Listing with ${_id} does not exist or you are not authorised to delete this listing`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: deletedProp });
}));
exports.deleteProp = deleteProp;
//UPDATING PROPERTY
const updateProp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const updatedProp = yield Properties_model_1.default.findOneAndUpdate({ _id, createdBy: req.user.userId }, req.body, { new: true });
    if (!updatedProp) {
        throw new errors_1.NotFoundError(`Listing with ${_id} does not exist or you are not authorised to edit this listing`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: updatedProp });
}));
exports.updateProp = updateProp;
