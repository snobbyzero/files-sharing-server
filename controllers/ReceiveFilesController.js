const express = require('express');
const router = express.Router();
const {receiveFiles, checkLink, getFilesLinks, getFilesLinksByName} = require('../services/RecieveFilesService')

router.get("/", (req, res, next) => {
    const name = req.query.name
    console.log(name)
    const cb = (links) => {
        console.log("links list")
        console.log(links)
        res.status(200).send(links)
    }
    if (name) {
        getFilesLinksByName(name, cb)
    } else {
        getFilesLinks(cb)
    }
})


router.post('/:link', (req, res, next) => {
    const link = req.params.link;
    const password = req.body.password;
    receiveFiles(link, password, (path, name, err) => {
        if (err) {
            res.status(401).send(err.message);
        } else {
            res.download(path, name);
        }
    })
});

router.get('/:link', (req, res, next) => {
    const link = req.params.link;
    checkLink(link, (data, err) => {
        if (err != null) {
            res.status(404).send(err.message);
        } else {
            res.status(200).send(data)
        }
    });
});

module.exports = router;
