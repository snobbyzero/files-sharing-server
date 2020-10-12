const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

router.post('/', upload.any(), (req, res, next) => {
    console.log(req.files);

    res.send('OK').status(200);
})

module.exports = router;

