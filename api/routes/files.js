const express = require('express');
const router = express.Router();
const path = require('path');
const getFiles = require('../../functions/getfiles');
const getDirectories = require('../../functions/getdirectories');
const rootPath = path.parse(__dirname).root;
router.post('/:type', (req, res, next) => {
    if(req.params.type === 'registrar') {
        if(req.body.target === 'directories') {
            getDirectories(path.join(rootPath, 'files'))
                .then(directories => {
                    res.status(200).json(directories);
                })
        } else {
            getFiles(path.join(
                rootPath, 'files', req.body.user.username
            )).then(result => {
                res.status(200).json(result);
            })
        }
    } else next()
}, function(req, res) {
    getFiles(path.join(
        rootPath, 'files',
        `${req.body.user['firstname']} ${req.body.user['lastname']}`
    )).then(result => {
        res.status(200).json(result);
    })
})
module.exports = router;