const express = require('express');
const router = express.Router();
const path = require('path');
const searchFile = require('../../functions/searchfile');
const rootPath = path.parse(__dirname).root;
router.post('/:user', (req, res) => {
    searchFile(path.join(
        rootPath, 'files', req.params.user
    ), req.body.filename.toLowerCase()).then(result => {
        res.status(200).json(result);
    })
})

module.exports = router;