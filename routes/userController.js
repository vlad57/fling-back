

var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
var jwt = require('jsonwebtoken');
var firebase = require('firebase/app');

var googleapis = require('googleapis');
var querystring = require("query-string");
var axios = require("axios");
var config = require("../utils/config");
var constants = require("../utils/constants");
var utils = require("../utils/utils");
//var axios = require('axios');

require('firebase/auth');
  
// Initialize Firebase
firebase.initializeApp(config.FIREBASE_CONFIG);

// Routes
module.exports = {
  authPhone: function(req, res) {

    // Params
    var indicative = req.body.indicative;
    var phone = req.body.phone;
    var verificationId = req.body.verificationId;
    var code = req.body.code;

    if (utils.isNumeric(phone)) {
      asyncLib.waterfall([
        function(done) {
          models.User.findOne({
            attributes: ['id', 'phone', 'email', 'profileCompleted',],
            where: { phone: phone, indicative: indicative,  isAuthPhone: true}
          })
          .then(function(userFound) {
            done(null, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if (!userFound) {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
        
            firebase.auth().signInWithCredential(credential).then(r => {
                if (r) {
                    if (!r.additionalUserInfo.isNewUser) {
                        return res.status(409).json({ 'error': 'This number is already used.' });
                    } else {
                        done(null, userFound);
                    }
                }
            }).catch((err) => {
                return res.status(500).json({ 'error': 'Error with authentication' });
            });
          } else {

            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
        
            firebase.auth().signInWithCredential(credential).then(r => {
                if (r) {
                    if (!r.additionalUserInfo.isNewUser) {
                      return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound),
                        'profileCompleted': userFound.profileCompleted,
                      });
                    }
                }
            }).catch((err) => {
                return res.status(500).json({ 'error': 'Error with authentication' });
            });
          }
        },
        function(userFound, done) {
          var newUser = models.User.create({
            phone: phone,
            isAuthPhone: true,
            profileCompleted: false,
            indicative: indicative,
          })
          .then(function(newUser) {
              done(newUser);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'cannot add user 1' });
          });
        }
      ], function(newUser) {
        if (newUser) {
          return res.status(200).json({
            'userId': newUser.id,
            'token': jwtUtils.generateTokenForUser(newUser),
            'profileCompleted': newUser.profileCompleted,
          });
        } else {
          return res.status(500).json({ 'error': 'cannot add user 2' });
        }
      });
    } else {
      return res.status(404).json({ 'error': 'The phone number should be numeric' });
    }

  },

  oAuthGoogleUrl: function(req, res) {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env['SERVER_ROOT_URI']}/${process.env['REDIRECT_URI_OAUTH_GOOGLE']}`,
      client_id: config.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    res.status(200).json({'urlOAuthGoogle' : `${rootUrl}?${querystring.stringify(options)}`});
  },

    getTokens: async function({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }) {
      /*
        * Uses the code to get tokens
        * that can be used to fetch the user's profile
        */
      const url = "https://oauth2.googleapis.com/token";
      const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      };

      return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  },

  oAuthGoogle: async function(req, res) {
    const code = req.query.code;

    const { id_token, access_token } = await module.exports.getTokens({
      code,
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env['SERVER_ROOT_URI']}/${process.env['REDIRECT_URI_OAUTH_GOOGLE']}`,
    });

    const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((result) => {

      if (result.data) {

        if (result.data.verified_email) {
          let email = result.data.email;
          let firstname = result.data.given_name;
          let lastname = result.data.family_name;

          asyncLib.waterfall([
            function(done) {

              models.User.findOne({
                attributes: ['id', 'email', 'phone', 'profileCompleted'],
                where: { email: email, isAuthGoogle: true}
              })
              .then(function(userFound) {
                done(null, userFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            function(userFound, done) {
              if (!userFound) {
                var newUser = models.User.create({
                  email: email,
                  firstname: firstname,
                  lastname: lastname,
                  isAuthGoogle: true,
                  profileCompleted: false,
                })
                .then(function(newUser) {
                    done(newUser);
                })
                .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add user 1' });
                });
              } else {

                res.redirect(`${process.env['FRONT_ROOT_URI']}/${process.env['FRONT_ROUTE_LOGIN']}?userId=${userFound.id}&token=${jwtUtils.generateTokenForUser(userFound)}&profileCompleted=${userFound.profileCompleted}`);

                /*return res.status(201).json({
                  'userId': userFound.id,
                  'token': jwtUtils.generateTokenForUser(userFound)
                });*/
              }
            },
  
          ], function(newUser) {
            if (newUser) {
              res.redirect(`${process.env['FRONT_ROOT_URI']}/${process.env['FRONT_ROUTE_LOGIN']}?userId=${newUser.id}&token=${jwtUtils.generateTokenForUser(newUser)}&profileCompleted=${userFound.profileCompleted}`);
              /*return res.status(201).json({
                'userId': newUser.id,
                'token': jwtUtils.generateTokenForUser(newUser)
              });*/
            } else {
              return res.status(500).json({ 'error': 'cannot add user 2' });
            }
          });
        } else {
          return res.status(404).json({ 'error': 'Your google account is not verified.' });
        }

      }
    })
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });
  },

  amIAuth: function(req, res) {
    var token = req.body.token;

    if (token != null) {
        try {
            var jwtToken = jwt.verify(token, constants.JWT_SIGN_SECRET);
            
            if (jwtToken != null) {
                return res.status(200).json({
                  'isAuth': true
                });
            } else {
              return res.status(400).json({
                'error': 'Invalid token'
              });
            }
            
        } catch(err) {
          return res.status(400).json({
            'error': 'Invalid token'
          });
        }
    } else {
      return res.status(500).json({
        'error': 'Token is missing'
      });
    }
  },
  
}