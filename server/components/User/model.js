const dbModel = require('./schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ =require('lodash');
class Model {

  async addOne(body) {
    let error = { message: 'can-not-be-saved-to-db', statusCode: 500 };
    try {
      const dbInstance = new dbModel(body);
      const salt = await bcrypt.genSalt(3);
      dbInstance.password = await bcrypt.hash(dbInstance.password, salt);
      (error.message = `can-not-be-saved-to-db`), (error.statusCode = 500);
      await dbInstance.save();
      return { data: _.pick(dbInstance,["userName","_id","name"])  };
    } catch (ex) {
      return { error };
    }
  }

  async logIn(body) {
    let error = { message: 'invalid userName or password', statusCode: 400 };
    try {
      const dbInstance = await dbModel.findOne({ userName: body.userName });
      const ret = await bcrypt.compare(body.password, dbInstance.password);
      if (!ret) throw new Error();
      return { data: _.pick(dbInstance,["userName","_id","name"]) };
    } catch (ex) {
      return { error }
    }
  }

  async ValidToken(body) {
    let error = { message: 'Access denied', statusCode: 401 };
    try {
      let token = body;
      if (!token) throw new Error();
      const decode = jwt.verify(token, "secretKeyFromSystemConfig");
      return ({ data: decode })
    } catch (ex) {
      return error;
    }
  }



}

module.exports = Model;
