
const jwt = require('jsonwebtoken');

const Model = new (require('./model'))();


// @route   GET api/book/:id
// @desc    get one
exports.logIn = async (req, res, next) => {
  const result = await Model.logIn(req.body);
  if (result.error)
    return res
      .status(result.error.statusCode)
      .json({ error: result.error.message });
  console.log(result.data);
  const token = jwt.sign({ _id: result.data._id, name: result.data.name,userName:result.data.userName }, "secretKeyFromSystemConfig");
  result.data["authToken"] =  token;
  return res.status(200).json({ result: result.data });
};

// @route   POST api/book
// @desc    add one
exports.add = async (req, res, next) => {
  const result = await Model.addOne(req.body);
  if (result.error)
    return res
      .status(result.error.statusCode)
      .json({ error: result.error.message });
  console.log(result.data);
  const token = jwt.sign({ _id: result.data._id, name: result.data.name, userName:result.data.userName }, "secretKeyFromSystemConfig");
  result.data["authToken"] =  token;
  return res.status(201).json({ result: result.data });
};


exports.returnUser = async (req, res) => {
 
  const result = await Model.ValidToken(req.params.token);
  if (result.error)
    return res
      .status(result.error.statusCode)
      .json({ error: result.error.message });
  return res.status(201).json({ result: result.data });

}




