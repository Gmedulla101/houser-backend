import express from 'express';
const {
  getAllProps,
  getProp,
  createProp,
  updateProp,
  deleteProp,
} = require('../controllers/properties-controller');

const propertiesRouter = express.Router();

propertiesRouter.get('/getAllProperties', getAllProps);
propertiesRouter.get('/getProperty/:id', getProp);
propertiesRouter.post('/addProperty', createProp);
propertiesRouter.patch('/updateProperty/:id', updateProp);
propertiesRouter.delete('/deleteProperty/:id', deleteProp);

module.exports = propertiesRouter;
