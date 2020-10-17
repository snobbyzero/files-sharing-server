const express = require('express');
const router = express.Router();
const multer = require('multer');
const {uploadFiles} = require("../services/UploadFilesServices");
const upload = multer({storage: multer.memoryStorage()});

router.post('/', upload.any(), (req, res, next) => {
    uploadFiles(req.files, req.body.password, req.body.expireTime, (archivePassword, link) => {
        res.send({
            archivePassword: archivePassword,
            link: link
        }).status(200);
    });
});

module.exports = router;

