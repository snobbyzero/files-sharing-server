const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');
const {ArchiveProps} = require("./ArchiveProps");

const ArchiveLink = sequelize.define('archive_link', {
    link: {
        type: DataTypes.STRING,
        field: 'link',
    },
    password: {
        type: DataTypes.STRING,
        field: 'password'
    }
}, {underscored: true});


module.exports.ArchiveLink = ArchiveLink;
