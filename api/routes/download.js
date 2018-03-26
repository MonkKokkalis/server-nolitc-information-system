const express = require('express');
const router = express.Router();
const path = require('path');
router.post('/',(req, res) => {
    res.status(200)
    .download(path.join(req.body.url, req.body.filename));
});

module.exports = router;