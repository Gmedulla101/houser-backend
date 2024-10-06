import propertyModel from '../models/Properties-model';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthenticatedError } from '../errors';
import { Request, Response } from 'express';

const getAllProps = asyncHandler(async (req: Request, res: Response) => {
  const props = await propertyModel.find({}).sort({ createdAt: -1 });
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: props, nbHits: props.length });
});

const getFeaturedProps = asyncHandler(async (req: Request, res: Response) => {
  const { location, propertyType, bedrooms, pricingRange } = req.query;

  if (location || propertyType || bedrooms || pricingRange) {
    const filteredProps = await propertyModel.find(req.query);
    res.status(StatusCodes.OK).json({ success: true, data: filteredProps });
    return;
  }

  const featuredProps = await propertyModel
    .find({ featured: true })
    .sort({ createdAt: -1 });
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: featuredProps, nbHits: featuredProps.length });
});

const getProp = asyncHandler(async (req: Request, res: Response) => {
  const _id = req.params.id;
  const prop = await propertyModel.findOne({ _id });
  res.status(StatusCodes.OK).json({ success: true, data: prop });
});

const getUserProp = asyncHandler(async (req: Request | any, res: Response) => {
  const userProps = await propertyModel.find({ createdBy: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: userProps, nbHits: userProps.length });
});

const createProp = asyncHandler(
  async (req: Request | any, res: Response, next) => {
    req.body.createdBy = req.user.userId;

    const newProperty = await propertyModel.create({ ...req.body });
    res.status(StatusCodes.OK).json({ sucess: true, data: newProperty });
  }
);

const deleteProp = asyncHandler(async (req: Request | any, res: Response) => {
  const _id = req.params.id;

  const deletedProp = await propertyModel.findOneAndDelete(
    { _id, createdBy: req.user.userId },
    req.body
  );

  if (!deletedProp) {
    throw new NotFoundError(
      `Listing with ${_id} does not exist or you are not authorised to delete this listing`
    );
  }

  res.status(StatusCodes.OK).json({ success: true, data: deletedProp });
});

const updateProp = asyncHandler(async (req: Request | any, res: Response) => {
  const _id = req.params.id;

  const updatedProp = await propertyModel.findOneAndUpdate(
    { _id, createdBy: req.user.userId },
    req.body,
    { new: true }
  );

  if (!updatedProp) {
    throw new NotFoundError(
      `Listing with ${_id} does not exist or you are not authorised to edit this listing`
    );
  }

  res.status(StatusCodes.OK).json({ success: true, data: updatedProp });
});

const filterProp = asyncHandler(async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, data: 'emptiness' });
});

export {
  getAllProps,
  getProp,
  getFeaturedProps,
  getUserProp,
  createProp,
  updateProp,
  deleteProp,
};
