import propertyModel from '../models/Properties-model';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthenticatedError } from '../errors';
import { Response } from 'express';
import { ModifiedRequest } from '../middleware/auth-middleware';

//GETTING ALL PROPERTIES
const getAllProps = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    const { location, propertyType, bedrooms, pricingRange, searchValue } =
      req.query;

    let queryObject: any = {};

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
      if (typeof pricingRange !== 'string') {
        throw new Error('Pricing range is not a string');
      }
      const rangeValues = pricingRange.split('-');

      if (rangeValues[1] === 'e') {
        queryObject.price = {
          $gte: rangeValues[0],
        };
      } else {
        queryObject.price = {
          $gte: rangeValues[0],
          $lte: rangeValues[1],
        };
      }
    }

    const allProps = await propertyModel
      .find(queryObject)
      .sort({ createdAt: -1 });

    let searchedProps;
    if (searchValue) {
      const validProps = allProps.filter((prop) => {
        return prop.title
          .toLowerCase()
          .startsWith(String(searchValue).toLowerCase());
      });

      searchedProps = validProps;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: allProps,
      nbHits: allProps.length,
      searchedProps,
    });
  }
);

//GETTING FEATURED PROPERTIES
const getFeaturedProps = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    const { location, propertyType, bedrooms, pricingRange } = req.query;
    let queryObject: any = {
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
      if (typeof pricingRange !== 'string') {
        throw new Error('Pricing range is not a string');
      }
      const rangeValues = pricingRange.split('-');

      if (rangeValues[1] === 'e') {
        queryObject.price = {
          $gte: rangeValues[0],
        };
      } else {
        queryObject.price = {
          $gte: rangeValues[0],
          $lte: rangeValues[1],
        };
      }
    }
    const featuredProps = await propertyModel
      .find(queryObject)
      .sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({
      success: true,
      data: featuredProps,
      nbHits: featuredProps.length,
    });
  }
);

//GETTING SINGLE PROPERTY
const getProp = asyncHandler(async (req: ModifiedRequest, res: Response) => {
  const _id = req.params.id;
  const prop = await propertyModel.findOne({ _id });
  res.status(StatusCodes.OK).json({ success: true, data: prop });
});

//GETTING USER PROPERTIES
const getUserProp = asyncHandler(
  async (req: ModifiedRequest, res: Response) => {
    const { location, propertyType, bedrooms, pricingRange } = req.query;
    let queryObject: any = {
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
      if (typeof pricingRange !== 'string') {
        throw new Error('Pricing range is not a string');
      }
      const rangeValues = pricingRange.split('-');

      if (rangeValues[1] === 'e') {
        queryObject.price = {
          $gte: rangeValues[0],
        };
      } else {
        queryObject.price = {
          $gte: rangeValues[0],
          $lte: rangeValues[1],
        };
      }
    }

    const userProps = await propertyModel.find(queryObject);
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: userProps, nbHits: userProps.length });
  }
);

//CREATING PROPERTY
const createProp = asyncHandler(async (req: ModifiedRequest, res: Response) => {
  req.body.createdBy = req.user.userId;

  const newProperty = await propertyModel.create({ ...req.body });
  res.status(StatusCodes.OK).json({ sucess: true, data: newProperty });
});

//DELETING PROPERTY
const deleteProp = asyncHandler(async (req: ModifiedRequest, res: Response) => {
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

//UPDATING PROPERTY
const updateProp = asyncHandler(async (req: ModifiedRequest, res: Response) => {
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

export {
  getAllProps,
  getProp,
  getFeaturedProps,
  getUserProp,
  createProp,
  updateProp,
  deleteProp,
};
