import propertyModel from '../models/Properties-model';
import { StatusCodes } from 'http-status-codes';

const getAllProps = async (req, res, next) => {
  try {
    const props = await propertyModel.find({});
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: props, nbHits: props.length });
  } catch (err) {
    next(err);
  }
};

const getProp = (req, res) => {
  res.send('Getting property');
};

const getUserProp = async (req, res, next) => {
  try {
    const userProps = await propertyModel.find({ createdBy: req.user.userId });
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: userProps, nbHits: userProps.length });
  } catch (err) {
    next(err);
  }
};

const createProp = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  try {
    const newProperty = await propertyModel.create({ ...req.body });
    res.status(StatusCodes.OK).json({ sucess: true, data: newProperty });
  } catch (err) {
    next(err);
  }
};

const deleteProp = (req, res) => {
  res.send('Deleting property');
};

const updateProp = (req, res) => {
  res.send('Updating property');
};

export {
  getAllProps,
  getProp,
  getUserProp,
  createProp,
  updateProp,
  deleteProp,
};
