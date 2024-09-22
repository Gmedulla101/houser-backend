import propertyModel from '../models/Properties-model';
import { StatusCodes } from 'http-status-codes';

const getAllProps = (req, res) => {
  res.send('Getting all properties');
};
const getProp = (req, res) => {
  res.send('Getting property');
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

export { getAllProps, getProp, createProp, updateProp, deleteProp };
