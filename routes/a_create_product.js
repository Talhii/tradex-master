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
router.post('/', verifyToken, upload.single('product_photo'), function (req, res, next) {

    var product_photo = req.file;
    console.log(product_photo);
    product_photo = req.file.filename;
    console.log("File Name =" + product_photo);
    var id = 0;
    var name = req.body.name;
    var description = req.body.description;
    var condition = req.body.condition;
    var starting_bid_prize = req.body.starting_bid_prize;
    var brand_name = req.body.brand_name;
    var category_name = req.body.category_name;
    var product_dimensions = req.body.product_dimensions;
    var material = req.body.material;
    var retail = req.body.retail;
    var color = req.body.color;
    var hardware = req.body.hardware;
    var size = req.body.size;


    pool.query("INSERT INTO handbag_products value (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, name, product_photo, description, condition, starting_bid_prize, brand_name, category_name, product_dimensions, material, retail, color, hardware, size])
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