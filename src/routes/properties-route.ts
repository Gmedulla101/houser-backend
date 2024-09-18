import express from 'express';
import {
  getAllProps,
  getProp,
  createProp,
  updateProp,
  deleteProp,
} from '../controllers/properties-controller';

const propertiesRouter = express.Router();

propertiesRouter.get('/getAllProperties', getAllProps);
propertiesRouter.get('/getProperty/:id', getProp);
propertiesRouter.post('/addProperty', createProp);
propertiesRouter.patch('/updateProperty/:id', updateProp);
propertiesRouter.delete('/deleteProperty/:id', deleteProp);

export default propertiesRouter;
