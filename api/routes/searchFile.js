const express = require('express');
const router = express.Router();
const path = require('path');
const searchFile = require('../../functions/searchfile');
const rootPath = path.parse(__dirname).root;
router.post('/:user', (req, res) => {
    // res.status(200).json({
    //     requestBody: req.body.filename
    // });
    searchFile(path.join(
        rootPath, 'files', req.params.user
    ), 'filename').then(result => {
        console.log(result);
        res.status(200).json({response: result});
    })
})

module.exports = router;