const _ = require('lodash')

const apiUtils = {}

apiUtils.sendApiSuccess = function (res, object) {
  const sendObject = { success: true }
  const resObject = _.merge(sendObject, object)
  console.log("request----"+resObject);
  return res.json(resObject)
}

apiUtils.sendApiError = function (res, errorNum, error) {
  return res.status(errorNum).json({ success: false, error })
}
apiUtils.sendApiError_InvalidPostData = function (res) {
  return apiUtils.sendApiError(res, 400, 'Invalid Post Data')
}

const nconf = require('nconf');
const jwt = require('jsonwebtoken');
const GroupModel = require('../../models/group');

apiUtils.generateJWTToken = async function (dbUser) {
  try {
    const resUser = _.clone(dbUser._doc);
    const refreshToken = resUser.accessToken;

    // Remove sensitive data
    delete resUser.resetPassExpire;
    delete resUser.resetPassHash;
    delete resUser.password;
    delete resUser.iOSDeviceTokens;
    delete resUser.tOTPKey;
    delete resUser.__v;
    delete resUser.preferences;
    delete resUser.accessToken;
    delete resUser.deleted;
    delete resUser.hasL2Auth;

    // Get JWT secret and expiration time
    const secret = nconf.get('tokens') ? nconf.get('tokens').secret : false;
    const expires = nconf.get('tokens') ? nconf.get('tokens').expires : 3600;
    if (!secret || !expires) {
      throw new Error('Invalid Server Configuration');
    }

    // Get groups of the user
    const grps = await GroupModel.getAllGroupsOfUserNoPopulate(dbUser._id);
    resUser.groups = grps.map(g => g._id);

    // Sign the JWT
    const token = jwt.sign({ user: resUser }, secret, { expiresIn: expires });

    return { token: token, refreshToken: refreshToken };
  } catch (err) {
    // Handle any errors here
    throw err;
  }
};


apiUtils.stripUserFields = function (user) {
  user.password = undefined
  user.accessToken = undefined
  user.__v = undefined
  user.tOTPKey = undefined
  user.iOSDeviceTokens = undefined

  return user
}

module.exports = apiUtils
