'use strict';
/**
 *  @module  userModel
 * 
 */
const schema = require('./user-schema.js');
const Model = require('../mongo.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'mysecret';

const roles = {
  student : ['read'],
  instructor : ['read' , 'addcourse'],
};


class Users extends Model {
  /** 
    * Users Constructor 
    * @param {object} schema - user schema 
  */
  constructor() {
    super(schema);
  }
  /**
   * for signup
 * @method save
 * @param {string} record
 * @returns user
 */

  async save(record){
    /**
   * record
   * {username:"reham",password:"1234"}
   */
    const result = await this.get({username : record.username});
    if(result.length == 0){
      const user = await this.create(record);
      return user;
    }
    
  }

  /**
   * for signin
   * this function to compare  user to his/her pass
 * @method authenticateBasic
 * @param {string} user
 * @param {string} pass
 */
  async authenticateBasic(user,pass){
    const result = await this.get({username : user});
    if(result.length !=0){
      const valid = await bcryptjs.compare(pass, result[0].password);
      return valid ? result : Promise.reject('wrong password');
    }

  }
  /**
   * for signin/signup
   * function to generate the taken based on the user information
 * @method generateToken
 * @param {string} user
 */
  generateToken(user){
    const token =  jwt.sign({
      algorithm:  'RS384',
      username: user.username,
      role : user.role,
      capabilities : roles[user.role],
    }, SECRET);
    return token;
  }
  /**
     * function to verify the token that the user used from the client that was generated by jwt
 * @method   async authenticateToken
 * @param {string} token
 */
  async authenticateToken  (token) {
    try {
      const tokenObject = await jwt.verify(token, SECRET);
      const result = await this.get({username : tokenObject.username});
      if (result.length != 0) {
        return Promise.resolve(tokenObject);
      } else {
        return Promise.reject('User is not found!');
      }
    } catch (e) {
      return Promise.reject(e.message);
    }
  }
 
}

module.exports = new Users();
