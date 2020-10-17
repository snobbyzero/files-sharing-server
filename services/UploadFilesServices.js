const fs = require('fs');
const path = require('path');
const archiver = require('archiver')
const crypto = require('crypto');
const {ArchiveProps} = require('../db/models/ArchiveProps');
const {ArchiveLink} = require('../db/models/ArchiveLink');
const EventEmitter = require('events').EventEmitter;

module.exports.uploadFiles = (files, linkPassword, expireTime, cb) => {
    const emitter = new EventEmitter();
    const archiveName = generateArchiveName();
    const password = generatePassword();
    const link = generateLink(archiveName);

    console.log(files);
    console.log(linkPassword);
    console.log(expireTime);

    emitter.on('finish', () => {
        save(archiveName, link, linkPassword, expireTime)
            .then(result => {
                cb(password, result.link);
            })
            .catch(err => console.log(err));
    });

    archive(files, archiveName, password, emitter);
}

const save = async (archiveName, link, linkPassword, expireTime) => {
    return ArchiveLink.create({
        link: link,
        password: linkPassword,
        archive_prop: [{
            name: archiveName,
            expire_time: new Date(Number(expireTime))
        }]
    }, {
        include: [{model: ArchiveProps}]
    })
}

const archive = (files, archiveName, password, emitter) => {
    const archivePath = path.join(__dirname, '..', 'uploads', `${archiveName}.zip`);
    const output = fs.createWriteStream(archivePath);

    const archive = archiver('zip-encrypted', {
        zlib: {level: 9},
        encryptionMethod: 'aes256',
        password: password
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

const generateArchiveName = () => {
    const timestamp = (new Date()).getTime().toString();
    const name = crypto.createHash('sha256').update(timestamp + crypto.randomBytes(16)).digest('hex');
    console.log(`Archive name: ${name}`);
    return name;
};

const generateLink = (archiveName) => {
    const link = crypto.createHash('sha256')
        .update(archiveName)
        .digest('base64')
        .slice(0, -1)
        .replace(/\+/g, '_')
        .replace(/\//g, '-');
    console.log(`Link: ${link}`);
    return link;
};

const generatePassword = () => {
    const password = crypto.randomBytes(10)
        .toString('base64')
        .slice(0, -2)
        .replace(/\+/g, '_')
        .replace(/\//g, '-');
    console.log(`Password: ${password}, password length: ${password.length}`);
    return password;
}
