//Imports 
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');
require('dotenv').config({path: __dirname + '/.env'});

// Instance du serveur.
var server = express();

//Bopdy parser config
server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    //res.header("Access-Control-Request-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    //res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const swaggerOptions = {
    swaggerDefinition : {
        info: {
            title: 'Library API',
            version: '1.0.0'
        }
    },
    apis: ['./apiRouter.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
server.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bienvenue à bord. </h1>');
});

server.use('/api/', apiRouter);

//Run server
server.listen(8081, function() {
    require('dotenv').config({ path: `./.env.${process.env.ENV}` });
    
    console.log('Serveur démarré');
});