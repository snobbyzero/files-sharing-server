const express = require('express');
const router = express.Router();
const multer = require('multer');
const {uploadFiles} = require("../services/UploadFilesService");
const upload = multer({storage: multer.memoryStorage()});

router.post('/', upload.any(), (req, res, next) => {
    uploadFiles(req.files, req.body.name, req.body.description, req.body.password, req.body.expireTime, req.body.linkOnly, (link) => {
        res.send({
            link: link
        }).status(200);
    });
});

module.exports = router;

