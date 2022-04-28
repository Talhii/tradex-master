var express = require('express');
var router = express.Router();
var pool = require('../db')
var multer = require('multer')
var jwt = require('jsonwebtoken');
var fs = require('fs');




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname)
    }
})

var upload = multer({
    storage: storage
});


// Upload a photo
router.post('/',verifyToken,  upload.single('image'), function (req, res, next) {

    // var image_name = req.body.image;
    var image_name = req.file.filename;
    console.log(image_name);
    console.log("image name in upload photo " + image_name);
    var id = 0;

    var product_id = req.query.id;
    console.log("product_id in upload photo " + product_id);

    pool.query("INSERT INTO photos value (?,?,?)", [id,image_name,product_id])
        .then((rows) => {
            res.json({
                status: "OK"
            });

        })
        .catch(err => {
            //handle error
            console.log(err);
            res.json({
                status: "NOT Inserted"
            });
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
