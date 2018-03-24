const express = require('express');
const router = express.Router();
const path = require('path');
const getFiles = require('../../functions/getfiles');
const rootPath = path.parse(__dirname).root;
router.get('/:user', (req, res) => {
    getFiles(path.join(
           rootPath, 'files', req.params.user
    )).then(result => {
        res.status(200).json(result);
    })
})
module.exports = router;