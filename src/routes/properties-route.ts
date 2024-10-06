import express from 'express';
import {
  getAllProps,
  getProp,
  getFeaturedProps,
  createProp,
  updateProp,
  deleteProp,
  getUserProp,
} from '../controllers/properties-controller';
import { auth } from '../middleware/auth-middleware';

const propertiesRouter = express.Router();

propertiesRouter.get('/all-Properties', getAllProps);
propertiesRouter.get('/featured-Properties', getFeaturedProps);
propertiesRouter.get('/my-properties', auth, getUserProp);
propertiesRouter.get('/get-property/:id', getProp);
propertiesRouter.post('/add-property', auth, createProp);
propertiesRouter.patch('/update-property/:id', auth, updateProp);
propertiesRouter.delete('/delete-property/:id', auth, deleteProp);

export default propertiesRouter;
