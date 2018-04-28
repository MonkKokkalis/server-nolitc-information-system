const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const rootPath = path.join(path.parse(__dirname).root, 'files');
const mime = require('mime/lite');
const checkDirectory = require('../../functions/checkdirectory');
mime.define({
    'microsoft powerpoint file': ['ppt', 'pptx'],
    'microsoft word file': ['doc', 'docx'],
    'microsoft excel file': ['xls', 'xlsx'],
    'application/installer': ['exe'],
    'application/pdf': ['pdf'],
    'image/psd': ['psd']
}, true);
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const directory = ((mime.getType(file.originalname)).split('/')[0]).concat('s');
        checkDirectory(path.join(rootPath, req.params.user), directory)
        .then(() => {
            callback(null, path.join(rootPath, req.params.user, directory));
        });
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})
const upload = multer({storage: storage}).array('files');
// router.post('/:user', upload.array('files'), (req, res) => {
//     res.status(200).json({
//         files: req.files.length
//     })
// })

router.post('/:user', (req, res) => {
    upload(req, res, function(error){
        if(error) {
            return res.status(500).json({
                message: error
            })
        }
        res.status(200).json({
            files: req.files.length
        })
    })
})

module.exports = router;