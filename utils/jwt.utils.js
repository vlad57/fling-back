var jwt = require('jsonwebtoken');
var constants = require('./constants');

module.exports = ({
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id
        },
        constants.JWT_SIGN_SECRET,
        {
            expiresIn: '365d'
        }
        )
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);

        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, constants.JWT_SIGN_SECRET);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch(err) {

            }
        }
        return userId;
    },

    amIAuth: function(token) {
        ret = false;

        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, constants.JWT_SIGN_SECRET);
                if (jwtToken != null) {
                    ret = true;
                }
            } catch(err) {

            }
        }
        return ret;
    }
})