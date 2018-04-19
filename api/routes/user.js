const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../../prototypes/user');
const jwt = require('jsonwebtoken');
const createDirectory = require('../../functions/createdirectory');

router.post('/signin', (req, res) => {
    User.findOne({username: req.body.username}, (error, user) => {
        if(error) {
            return res.status(400).json({
                message: 'User not found'
            })
        }
        bcryptjs.compare(req.body.password, user.password, (error, result) => {
            if(!result) {
                return res.status(400).json({
                    message: 'Authentication failed'
                })
            }
            const token = jwt.sign({
                    username: user.username,
                }, 'secretprivatekey', {
                    expiresIn: "1h"
            })
            return res.status(201).json({
                message: 'Authentication Successful',
                user: {username: user.username, type: user.type,
                    firstname: user.firstname, lastname: user.lastname},
                token: token
            })
        })
    })
})

router.post('/signup', (req, res) => {
    Promise.all([
        User.findOne({ username: req.body.username })
            .then(result => {
                if(result){return reject('username')}
            }),
        User.findOne().and([
            { firstname: req.body.firstname }, 
            { lastname: req.body.lastname }
        ])
            .then(result => { if (result) { return reject('fullname') } })
    ]).then(() => {
        bcryptjs.hash(req.body.password, 10, (error, hash) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        error: error
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username.toLowerCase(),
                        password: hash,
                        type: req.body.type,
                        firstname: req.body.firstname.toLowerCase(),
                        lastname: req.body.lastname.toLowerCase()
                    })
                    user.save().then(() => {
                        createDirectory({firstname: user.firstname, lastname: user.lastname})
                            .then(() => {
                                res.status(200).json({
                                    message: 'User created'
                                })
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({ error: error })
                    })
                }
            })
    })
    .catch(error => res.status(400).json({ message: error }));
})
const reject = (error) => {
        if(error === 'username') {
        return Promise.reject('username already exists')
    } else if(error === 'fullname') {
        return Promise.reject('a user with the indicated fullname already exists')
    }
}

module.exports = router;