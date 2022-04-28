var express = require('express');
var router = express.Router();
var pool = require('../db')
var multer = require('multer')
var jwt = require('jsonwebtoken');
var fs = require('fs');
require('dotenv').config();

require('dotenv').config();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage
});

// Create profile
router.post('/', verifyToken, upload.single('brand_image'), function (req, res, next) {

            var brand_image = req.file;
            console.log(brand_image);
                brand_image = req.file.filename;
                console.log("File Name =" + brand_image);
            var id = 0;
            var name = req.body.name;
            var description = req.body.description;

            pool.query("INSERT INTO brands value (?,?,?,?)", [id, name,brand_image,description])
                .then((rows) => {

                    res.json({
                        status: "OK"
                    });

                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    // conn.end();
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

module.exports = router;