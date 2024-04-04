'use strict'

var _ = require('lodash')
var db = require('../database')
var mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
var winston = require('../logger')
const csrf = require('../dependencies/csrf-td')
const viewdata = require('../helpers/viewdata')
const jwt = require('jsonwebtoken');
var passport = require('passport')
var middleware = {}
const secretKey = '--- change me now ---';
middleware.db = function (req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    winston.warn('MongoDB ReadyState = ' + mongoose.connection.readyState)
    db.init(function (e, database) {
      if (e) {
        return res.status(503).send()
      }

      req.db = database
    })
  }

  return next()
}

middleware.redirectToDashboardIfLoggedIn = function (req, res, next) {
  if (req.user) {
    if (req.user.hasL2Auth) {
      return middleware.ensurel2Auth(req, res, next)
    }
    if (!req.user.role.isAdmin || !req.user.role.isAgent) {
      return res.redirect('/tickets')
    }

    return res.redirect('/dashboard')
  }

  return next()
}

middleware.redirectToLogin = function (req, res, next) {
  if (!req.user) {
    if (!_.isUndefined(req.session)) {
      req.session.redirectUrl = req.url
    }

    return res.redirect('/')
  }

  if (req.user.deleted) {
    req.logout()
    req.session.l2auth = null
    req.session.destroy()
    return res.redirect('/')
  }

  if (req.user.hasL2Auth) {
    if (req.session.l2auth !== 'totp') {
      return res.redirect('/')
    }
  }

  return next()
}

middleware.redirectIfUser = function (req, res, next) {
  if (!req.user) {
    if (!_.isUndefined(req.session)) {
      res.session.redirectUrl = req.url
    }

    return res.redirect('/')
  }

  if (!req.user.role.isAdmin && !req.user.role.isAgent) {
    return res.redirect(301, '/tickets')
  }

  return next()
}

middleware.ensurel2Auth = function (req, res, next) {
  if (req.session.l2auth === 'totp') {
    if (req.user) {
      if (req.user.role !== 'user') {
        return res.redirect('/dashboard')
      }

      return res.redirect('/tickets')
    }

    return next()
  }

  return res.redirect('/l2auth')
}

// Common
middleware.loadCommonData = function (req, res, next) {
  viewdata.getData(req, function (data) {
    data.csrfToken = req.csrfToken
    req.viewdata = data

    return next()
  })
}

middleware.cache = function (seconds) {
  return function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=' + seconds)

    next()
  }
}

middleware.checkCaptcha = function (req, res, next) {
  var postData = req.body
  if (postData === undefined) {
    return res.status(400).json({ success: false, error: 'Invalid Captcha' })
  }

  var captcha = postData.captcha
  var captchaValue = req.session.captcha

  if (captchaValue === undefined) {
    return res.status(400).json({ success: false, error: 'Invalid Captcha' })
  }

  if (captchaValue.toString() !== captcha.toString()) {
    return res.status(400).json({ success: false, error: 'Invalid Captcha' })
  }

  return next()
}

middleware.checkOrigin = function (req, res, next) {
  var origin = req.headers.origin
  var host = req.headers.host

  // Firefox Hack - Firefox Bug 1341689 & 1424076
  // Trudesk Bug #26
  // TODO: Fix this once Firefox fixes its Origin Header in same-origin POST request.
  if (!origin) {
    origin = host
  }

  origin = origin.replace(/^https?:\/\//, '')

  if (origin !== host) {
    return res.status(400).json({ success: false, error: 'Invalid Origin!' })
  }

  return next()
}

// API
middleware.api = function (req, res, next) {
  var accessToken = req.headers.accesstoken

  var userSchema = require('../models/user')

  if (_.isUndefined(accessToken) || _.isNull(accessToken)) {
    var user = req.user
    if (_.isUndefined(user) || _.isNull(user)) return res.status(401).json({ error: 'Invalid Access Token' })

    return next()
  }

  userSchema.getUserByAccessToken(accessToken, function (err, user) {
    if (err) return res.status(401).json({ error: err.message })
    if (!user) return res.status(401).json({ error: 'Invalid Access Token' })

    req.user = user

    return next()
  })
}

middleware.hasAuth = middleware.api
middleware.apiv2 = async function (req, res, next) {
  var userSchema = require('../models/user')
  console.log(req.user);
  //let token = req.headers;
  let token = req.headers["x-jwt-token"];
  //console.log(token);
  if (req.user && !token) {
    console.log("inside user");
    //console.log(req.user);
    const token = await generateToken(req.user);
    console.log(token);
    res.setHeader('X-Jwt-Token', token);
    return next();
  }
  if (token) {
    console.log(secretKey);
    jwt.verify(token,
      secretKey,
      (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        //console.log(decoded.user.email);
        //req.userId = decoded.id;
        //let mid= new ObjectId(decoded.user._id);
        //console.log(mid);
        let useremail = decoded.user.email;
        userSchema.find({ email: useremail }, (err, userdata) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          if (!userdata) {
            return res.status(401).send({ message: 'Unauthorised' });
          }
          req.user = userdata[0]
          console.log("userdata");
          console.log(decoded);
          next();
        });
        //next();
      });
  }

  else {
    passport.authenticate('jwt', { session: true }, function (err, user) {
      if (err || !user) return res.status(401).json({ success: false, error: 'Invalid Authentication Token' });
      if (user) {
        req.user = user;
        const token = generateToken(user);
        res.setHeader('X-Jwt-Token', token);
        return next();
      }

      return res.status(500).json({ success: false, error: 'Unknown Error Occurred' })
    })(req, res, next)
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
            //throw new Error('Document not found');
            const payload = {
              user: { email: user.email },
              form: { "_id": "64d76782756dab14a2f41767" }
              // Add any other claims as needed
            };
            const options = {
              expiresIn: '1h', // Token expiration time
            };
            console.log('generate token' + secretKey);
            // Generate the token
            const token = jwt.sign(payload, secretKey, options);
            return token;
          }
          // Do something with the found document
          console.log('Found document:', document);

          // Specify the payload you want in the token
          const payload = {
            user: { _id: document._id, email: user.email },
            form: { "_id": "64d76782756dab14a2f41767" }
            // Add any other claims as needed
          };

          // Set the options for the token, e.g., expiration time
          const options = {
            expiresIn: '1h', // Token expiration time
          };
          console.log('generate token' + secretKey);
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


middleware.canUser = function (action) {
  return function (req, res, next) {


    if (!req.user) return res.status(401).json({ success: false, error: 'Not Authorized for this API call.' })
    const permissions = require('../permissions')
    const perm = permissions.canThis(req.user.role, action)
    if (perm) return next()

    return res.status(401).json({ success: false, error: 'Not Authorized for this API call.' })
  }
}

middleware.isAdmin = function (req, res, next) {
  var roles = global.roles
  var role = _.find(roles, { _id: req.user.role._id })
  role.isAdmin = role.grants.indexOf('admin:*') !== -1

  if (role.isAdmin) return next()

  return res.status(401).json({ success: false, error: 'Not Authorized for this API call.' })
}

middleware.isAgentOrAdmin = function (req, res, next) {
  var role = _.find(global.roles, { _id: req.user.role._id })
  role.isAdmin = role.grants.indexOf('admin:*') !== -1
  role.isAgent = role.grants.indexOf('agent:*') !== -1

  if (role.isAgent || role.isAdmin) return next()

  return res.status(401).json({ success: false, error: 'Not Authorized for this API call.' })
}

middleware.isAgent = function (req, res, next) {
  var role = _.find(global.roles, { _id: req.user.role._id })
  role.isAgent = role.grants.indexOf('agent:*') !== -1

  if (role.isAgent) return next()

  return res.status(401).json({ success: false, error: 'Not Authorized for this API call.' })
}

middleware.isSupport = middleware.isAgent

middleware.csrfCheck = function (req, res, next) {
  csrf.init()
  return csrf.middleware(req, res, next)
}

module.exports = function () {
  return middleware
}
