// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// Enable cross-origin request service

var cors = require('cors');

// Import environment variables (obfuscated for security)

require('dotenv').config();

var username = process.env.USERNAME;

var password = process.env.PASSWORD;

var loc = process.env.LOCATION;

console.log('Imported environment variables');

var dbconn = 'mongodb://' + username + ':' + password + '@127.0.0.1:'+loc;

var mongoose = require('mongoose');

mongoose.connect(dbconn, { useNewUrlParser: true });

console.log('Connected to database');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cross-origin request service
app.use(cors());

app.get('/onegrams/:word', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

/*app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});*/

var port = process.env.PORT || 3001;        // set our port

var Onegram = require('./api/models/onegram');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/onegrams/:word')

    // get the onegram for that word (accessed at GET http://localhost:{PORT}/api/onegrams/onegram_id)
    .get(function(req, res) {
        Onegram.find({word: req.params.word}, function(err, onegram) {
            if (err)
                res.send(err);
            res.json(onegram);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);