var express = require('express');
var router = express.Router();
var pool = require('../db')
var jwt = require('jsonwebtoken');


router.get('/', verifyToken, function (req, res, next) {

    pool.query("select name from brands")
        .then((rows) => {
            res.contentType('text/plain');
            res.send({
                status: "OK",
                data: rows
            });

        })
        .catch(err => {
            //handle error
            console.log(err);
        })
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

router.get('/*', function (req, res) {
    res.status(404).send('Page Not Exist');
});


router.post('/*', function (req, res) {
    res.status(404).send('Page Not Exist');
});


module.exports = router;