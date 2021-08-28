//Imports
var express = require('express');
var cors = require('cors');
var usersCtrl = require('./routes/userController');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');

//Router

exports.router = (function() {
    var apiRouter = express.Router();

    apiRouter.options('*', cors());

    // Users routes
    /**
     * @swagger
     * /user/authPhone/:
     *  post:
     *      summary: Authentification with phone number
     *      consumes:
     *          - application/json
     *      parameters:
     *          - in: body
     *            schema:
     *              properties:
     *                  indicative:
     *                      type: string
     *                  phone:
     *                      type: string
     *                  verificationId:
     *                      type: string
     *                  code:
     *                      type: string
     *      responses:
     *          200:
     *              description: Return a json with userId and token
     *              examples:
     *                  application/json: { "userId": string, "token": string, "profileCompleted": boolean }
     *          500:
     *              description: When user cannot be verified in database. When there is an error with authentication in firebase. When user cannot be added in database.
     *              examples:
     *                  application/json: { "error": 'unable to verify user'}
     *          409:
     *              description: When phone number already exists in firebase
     *              examples:
     *                  application/json: { "error": 'This number is already used.'}
     *          404:
     *              description: When the phone number is not numeric.
     *              examples:
     *                  application/json: { "error": 'The phone number should be numeric'}
     */
    apiRouter.route('/user/authPhone/').post(usersCtrl.authPhone);

    /**
     * @swagger
     * /user/oAuthGoogle/url/':
     *  get:
     *      summary: Return the uri on server for oAuth Google
     *      responses:
     *          200:
     *              description: Return the URL for oAuth Google
     *              examples:
     *                  application/json: { "urlOAuthGoogle": string }
     */
    apiRouter.route('/user/oAuthGoogle/url/').get(usersCtrl.oAuthGoogleUrl); // Route for Google Authentication

    /**
     * @swagger
     * /user/oAuthGoogle/:
     *  get:
     *      summary: Authentification with oAuth
     *      responses:
     *          302:
     *              description: Return a location to the login page on the front exemple -> "http://localhost:4200/login?userId=1&token=tontokendePuteetjaipasditmonderniermot&profileCompleted=false"
     *          500:
     *              description: When user cannot be verified in database. When user cannot be added in database.
     *              examples:
     *                  application/json: { "error": 'unable to verify user'}
     *          404:
     *              description: When google account is not verified.
     *              examples:
     *                  application/json: { "error": 'Your google account is not verified.'}
     */
    apiRouter.route('/user/oAuthGoogle/').get(usersCtrl.oAuthGoogle);

    /**
     * @swagger
     * /amIAuth:
     *  post:
     *      summary: I am Auth
     *      consumes:
     *          - application/json
     *      parameters:
     *          - in: body
     *            schema:
     *              properties:
     *                  token:
     *                      type: string
     *      responses:
     *          200:
     *              description: Return json with true or false
     *              examples:
     *                  application/json: { "isAuth": boolean }
     *          500:
     *              description: Token is missing.
     *              examples:
     *                  application/json: { "error": 'Token is missing'}
     *          400:
     *              description: Invalid token.
     *              examples:
     *                  application/json: { "error": 'Invalid token'}
     */
    apiRouter.route('/amIAuth').post(usersCtrl.amIAuth);
    

    return apiRouter;
})();