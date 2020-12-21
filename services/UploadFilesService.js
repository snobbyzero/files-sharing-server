const fs = require('fs');
const path = require('path');
const archiver = require('archiver')
const crypto = require('crypto');
const {encryptPassword} = require("../utils/encryption");
const {ArchiveProps} = require('../db/models/ArchiveProps');
const {ArchiveLink} = require('../db/models/ArchiveLink');
const {ArchiveInformation} = require('../db/models/ArchiveInformation');
const EventEmitter = require('events').EventEmitter;

module.exports.uploadFiles = (files, archiveName, archiveDescription, linkPassword, expireTime, linkOnly, cb) => {
    const emitter = new EventEmitter();
    const archiveUniqueId = generateArchiveUniqueId();
    const link = generateLink(archiveUniqueId);

    console.log("Archive unique id: " + archiveUniqueId)
    console.log("Archive name: " + archiveName)
    console.log("Archive description: " + archiveDescription)
    console.log("Files: " + files);
    console.log("Link password: " + linkPassword);
    console.log("Expire time: " + expireTime);
    console.log("LinkOnly: " + linkOnly)

    emitter.on('finish', () => {
        save(archiveUniqueId, archiveName, archiveDescription, link, linkPassword, expireTime, linkOnly)
            .then(result => {
                cb(result.link);
            })
            .catch(err => console.log(err));
    });

    archive(files, archiveUniqueId, emitter);
}

const save = async (uniqueId, archiveName, archiveDescription, link, linkPassword, expireTime, linkOnly) => {
    console.log(`Save method name: ${linkOnly}`)
    return ArchiveLink.create({
        link: link,
        password: linkPassword === "" ? null : encryptPassword(linkPassword),
        link_only: linkOnly,
        archive_prop: [{
            unique_id: uniqueId
        }],
        archive_information: [{
            name: archiveName,
            description: archiveDescription,
            expire_time: new Date(Number(expireTime))
        }]
    }, {
        include: { all: true}
    })
}

const archive = (files, archiveUniqueId, emitter) => {
    const archivePath = path.join(__dirname, '..', 'uploads', `${archiveUniqueId}.zip`);
    const output = fs.createWriteStream(archivePath);

    const archive = archiver('zip', {
        zlib: {level: 9}
    });

    output.on('finish', () => {
        console.log('Data has been drained');
        emitter.emit('finish')
    });

    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    files.forEach(file => archive.append(file.buffer, {name: file.originalname}));

    archive.finalize();
}

const generateArchiveUniqueId = () => {
    const timestamp = (new Date()).getTime().toString();
    const uniqueId = crypto.createHash('sha256').update(timestamp + crypto.randomBytes(16)).digest('hex');
    console.log(`Archive unique id: ${uniqueId}`);
    return uniqueId;
};

const generateLink = (uniqueId) => {
    const link = crypto.createHash('sha256')
        .update(uniqueId)
        .digest('base64')
        .slice(0, -1)
        .replace(/\+/g, '_')
        .replace(/\//g, '-');
    console.log(`Link: ${link}`);
    return link;
};

