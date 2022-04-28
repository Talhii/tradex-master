var express = require('express');
var router = express.Router();
var pool = require('../db')
var jwt = require('jsonwebtoken');

// Get Personal Profile
var data = [];
router.get('/', verifyToken, function (req, res, next) {

    var brand_name = req.query.brand_name;
    var category_name = req.query.category_name;


    pool.query("select id,name,product_photo,description,retail from handbag_products where brand_name='"+brand_name+"' AND  category_name='"+category_name+"'")
        .then((rows) => {

            if (rows[0].product_photo == null || rows[0].product_photo == "") {
                console.log("image not exist");
            } else {
                console.log("image: " + rows[0].product_photo);

                const path = 'build/images/' + rows[0].product_photo;
                rows[0].product_photo = path;
            }
            data = rows[0];
            res.contentType('text/plain');
            res.send({
                status: "OK",
                data: data
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