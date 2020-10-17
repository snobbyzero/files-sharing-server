const express = require('express');
const router = express.Router();
const path = require('path');
const {ArchiveProps} = require('../db/models/ArchiveProps');
const {ArchiveLink} = require('../db/models/ArchiveLink');

router.post('/:link', (req, res, next) => {
    const link = req.params.link;
    const password = req.body.password;
    console.log(req.body.password);
    ArchiveLink.findOne({
        where: {link: link, password: password},
        include: [{
            model: ArchiveProps
        }]
    }).then(result => {
        if (result) {
            console.log(result);
            const pth = path.join(__dirname, '..', 'uploads', result.archive_prop.name + '.zip');
            console.log(pth);
            res.download(pth);
        } else {
            console.log(401);
            res.status(401).send("null");
        }
    }).catch(err => {
        console.log(err);
        next(err);
    });
});

module.exports = router;
