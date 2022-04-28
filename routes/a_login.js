var express = require('express');
var router = express.Router();
var pool = require('../db')
var jwt = require('jsonwebtoken');

require('dotenv').config();

// Login
router.post('/', function (req, res, next) {
    pool.query("select * from admins where email= '" + req.body.email + "' && password='" + req.body.password + "'  ")
        .then(async (rows) => {
            if (rows.length == 1) {
                const access_token = jwt.sign({
                    email: req.body.email
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                console.log("id during login " + rows[0].id);
                res.contentType('text/plain');
                res.send({
                    status: "OK",
                    id: rows[0].id,
                    token: access_token
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            //handle error
            console.log(err);
            // conn.end();
        })
});

router.get('/*', function (req, res) {
    res.status(404).send('Page Not Exist');
});


router.post('/*', function (req, res) {
    res.status(404).send('Page Not Exist');
});


module.exports = router;