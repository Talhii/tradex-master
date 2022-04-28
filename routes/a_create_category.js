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
router.post('/', verifyToken, upload.single('category_image'), function (req, res, next) {
    var category_image = req.file;
    console.log(category_image);
    category_image = req.file.filename;
    console.log("File Name =" + category_image);

    var name = req.body.name;
    var description = req.body.description;
    var brand_name = req.body.brand_name;


    pool.query("INSERT INTO categories value (?,?,?,?)", [name, category_image, description, brand_name])
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