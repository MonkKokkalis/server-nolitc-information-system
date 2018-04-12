const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const rootPath = path.join(path.parse(__dirname).root, 'files');
const mime = require('mime/lite');
mime.define({
    'microsoft word file': ['docx'],
    'microsoft excel file': ['xlsx'],
    'installer/application': ['exe']
}, true);
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const directory = ((mime.getType(file.originalname)).split('/')[0]).concat('s');
        callback(null, path.join(rootPath, req.params.user, directory));
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})
const upload = multer({storage: storage});
router.post('/:user', upload.array('files'), (req, res) => {
    console.log(req.files);
    // console.log(req.body);
    res.status(200).json({
        files: req.files.length
    })
})

module.exports = router;