const getAllProps = (req, res) => {
  res.send('Getting all properties');
};
const getProp = (req, res) => {
  res.send('Getting property');
};
const createProp = (req, res) => {
  res.send('Created property');
};
const deleteProp = (req, res) => {
  res.send('Deleting property');
};
const updateProp = (req, res) => {
  res.send('Updating property');
};

export { getAllProps, getProp, createProp, updateProp, deleteProp };
