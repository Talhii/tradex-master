var express = require('express');
var router = express.Router();
var pool = require('../db')
var jwt = require('jsonwebtoken');
var flag = 1;
var {
    Validator
} = require('node-input-validator');
require('dotenv').config();

// Sign up
router.post('/', function (req, res, next) {
    const v = new Validator(req.body, {
        firstname: 'required',
        lastname: 'required',
        email: 'required|email',
        password: 'required|minLength:8|regex:[a-zA-Z0-9]',

    });
    v.check().then((matched) => {
        if (!matched) {
            res.status(422).send(v.errors);
        }
    });


    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.lastname;
    var password = req.body.password;
    var id = 0;
    pool.query("select * from users where email='" + email + "'").then((rows => {
        if (rows.length > 0) {
            res.json({
                message: "Account Already Exist With Same email"
            })
        } else {
            pool.query("INSERT INTO users value (?,?,?,?,?)", [firstname, lastname, email, password, id])
                .then((rows) => {
                    const access_token = jwt.sign({
                        email: email
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })
                    // req.session.email = email;
                    pool.query("select * from users where email= '" + req.body.email + "' && password='" + req.body.password + "'  ").then(rows => {
                        console.log("id during signup " + rows[0].id);
                        res.json({
                            status: "OK",
                            id: rows[0].id,
                            access_token: access_token
                        });
                    }).catch(err => {
                        console.log(err);
                    })

                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    // conn.end();
                })
        }

    })).catch(err => {
        res.json({
            message: "Error in query"
        });
    })
});

module.exports = router;