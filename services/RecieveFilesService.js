const path = require('path');
const Sequelize = require('sequelize/lib/sequelize');
const Op = Sequelize.Op;
const {compare} = require("../utils/encryption");
const {ArchiveLink} = require('../db/models/ArchiveLink');

module.exports.getFilesLinks = (cb) => {
    ArchiveLink.findAll({
        where: {link_only: false},
        include: { all: true }
    }).then(result => {
        cb(result)
    }).catch(err => {
        console.log("Get files: " + err.message)
    })
}

module.exports.getFilesLinksByName = (name, cb) => {
    console.log(`Searching by name: ${name}`)
    ArchiveLink.findAll({
        where: {
            link_only: false,
            '$archive_information.name$': {
                [Op.iLike]: `%${name}%`
            }
        },
        include: { all: true }
    }).then(result => {
        cb(result)
    }).catch(err => {
        console.log("Get files: " + err.message)
    })
}

module.exports.receiveFiles = (link, password, cb) => {
    console.log(`Receive files password: ${password}`);
    ArchiveLink.findOne({
        where: { link: link },
        include: { all: true }
    }).then(result => {
        console.log(result.password);
        if (result && (password == null || compare(password, result.password))) {
            const pth = path.join(__dirname, '..', 'uploads', result.archive_prop.unique_id + '.zip');
            const name = result.archive_information.name;
            console.log(`Path: ${pth}`);
            console.log(`Name: ${name}`);
            cb(pth, name);
        } else {
            console.log(401);
            cb(null, null, "401 Unauthorized");
        }
    }).catch(err => {
        console.log(err);
        cb(null, null, err.message);
    });
}

module.exports.checkLink = (link, cb) => {
    ArchiveLink.findOne({
        where: {link: link},
        include: { all: true }
    }).then(result => {
        if (result) {
            // if password is null then user doesn't input it
            cb({
                "name": result.archive_information.name,
                "description": result.archive_information.description,
                "createdAt": result.archive_prop.createdAt,
                "expiredAt": result.archive_information.expire_time,
                "protected": result.password != null
            }, null);
        } else {
            console.log(404);
            cb(null, "Error: 404 Not Found");
        }
    }).catch(err => {
        console.log(err);
        cb(null, `Error: ${err.message}`);
    });
}
