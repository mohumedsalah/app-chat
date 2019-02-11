const jwt = require("jsonwebtoken");


module.exports = async function auth(req, res, next) {
  let error = { message: 'Access denied', statusCode: 401 };
  const token = req.header('x-auth-token');
  try {
    if (!token) throw new Error();
    const decode = jwt.verify(token, "secretKeyFromSystemConfig");
    console.log(decode);
    req.user = decode;
    next();
  } catch (ex) {
    return res.status(error.statusCode).json({ result: error.message })
  }
}