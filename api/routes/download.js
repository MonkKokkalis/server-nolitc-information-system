const express = require('express');
const router = express.Router();
router.post('/',(req, res) => {
    res.status(200)
    .download(req.body.url);
});

module.exports = router;