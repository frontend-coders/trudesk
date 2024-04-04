const User = require('../../../models/user')
const apiUtils = require('../apiUtils')
const middleware = require('../../../middleware')
const commonV2 = {}
const secretKey = '--- change me now ---';
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const winston = require('winston');
// Configure Winston with a console transport
winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});
commonV2.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) return apiUtils.sendApiError_InvalidPostData(res)

  try {
    const user = await User.getUserByUsername(username)
    if (!user) return apiUtils.sendApiError(res, 401, 'Invalid Username/Password')

    if (!User.validate(password, user.password)) return apiUtils.sendApiError(res, 401, 'Invalid Username/Password')
    const token = await generateToken(user);
    console.log(token);
    res.setHeader('X-Jwt-Token', token);
    return apiUtils.sendApiSuccess(res, { token: token, })
  } catch (e) {
    return apiUtils.sendApiError(res, 500, e.message)
  }
}

function generateToken(user) {
  // Use your own secret key for signing the token

  const otherDatabaseUri = 'mongodb://localhost:27017/formioapp';
  const collectionName = 'submissions';  // Replace with your actual collection name

  return MongoClient.connect(otherDatabaseUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      const collection = client.db().collection(collectionName);
      const userEmail = user.email;

      return collection.findOne({ 'data.email': userEmail, form: ObjectId('64d76782756dab14a2f41767') })
        .then((document) => {
          if (!document) {
            // Handle the case where no document is found
            throw new Error('Document not found');
          }
          // Do something with the found document
          console.log('Found document:', document);

          // Specify the payload you want in the token
          const payload = {
            user: { _id: document._id, email: user.email },
            form: { "_id": "64d76782756dab14a2f41767" }
            // Add any other claims as needed
          };
          console.log('Found payload:', payload);

          // Set the options for the token, e.g., expiration time
          const options = {
            expiresIn: '1h', // Token expiration time
          };
          // Generate the token
          const token = jwt.sign(payload, secretKey, options);
          return token;
        })
        .finally(() => client.close()); // Close the MongoDB connection
    })
    .catch((err) => {
      // Handle error
      winston.error('Error generating token:', err);
      throw err; // Propagate the error
    });
}

commonV2.token = async (req, res) => {
  const refreshToken = req.body.refreshToken
  if (!refreshToken) return apiUtils.sendApiError_InvalidPostData(res)

  try {
    const user = await User.getUserByAccessToken(refreshToken)
    if (!user) return apiUtils.sendApiError(res, 401)

    const tokens = await apiUtils.generateJWTToken(user)

    return apiUtils.sendApiSuccess(res, { token: tokens.token, refreshToken: tokens.refreshToken })
  } catch (e) {
    return apiUtils.sendApiError(res, 500, e.message)
  }
}

commonV2.viewData = async (req, res) => {
  return apiUtils.sendApiSuccess(res, { viewdata: req.viewdata })
}

module.exports = commonV2
