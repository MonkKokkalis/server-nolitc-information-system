const express = require('express');
const router = express.Router();
const path = require('path');
const functions = require('../../functions/functions');
const rootPath = path.parse(__dirname).root;
router.get('/:user', (req, res) => {
   functions.getFiles(path.join(
           rootPath, 'files', req.params.user
    )).then(result => {
        res.status(200).json(result);
    })
})
module.exports = router;