var express = require('express');
var router = express.Router();
var pool = require('../db')
var jwt = require('jsonwebtoken');


// logout
router.get('/',verifyToken,  function (req, res, next) {

    var id = req.query.id;
    console.log("id during logout " + id);
    console.log("logout ");


});

function verifyToken(req, res, next) {
    console.log("varify  " + req);

    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
            if (err) {
                console.log("forbidden inner");
                return res.sendStatus(403);
            }
            // req.user = user;
            else {
                next();
            }
        });

    } else {
        // Forbidden
        console.log("forbidden outer");
        res.sendStatus(403);
    }
}

module.exports = router;
