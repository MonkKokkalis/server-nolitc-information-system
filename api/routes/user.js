const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../../prototypes/user');
const jwt = require('jsonwebtoken');
router.post('/signin', (req, res) => {
    User.find({username: req.body.username})
    .exec()
    .then((user) => {
        if(user.length < 1) {
            return res.status(400).json({
                message: 'Username not found'
            })
        }
        bcryptjs.compare(req.body.password, user[0].password, (error, result) => {
            if(!error) {
                return res.status(400).json({
                    message: 'Authentication failed'
                })
            }
            if(result) {
                const token = jwt.sign({
                    username: user[0].email,
                    _id: user[0]._id
                }, 'secretprivatekey', {
                    expiresIn: "1h"
                })
                return res.status(201).json({
                    message: 'Authentication Successful',
                    token: token
                })
            }
        })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: error
        })
    })
})

module.exports = router;