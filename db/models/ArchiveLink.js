const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');

const ArchiveLink = sequelize.define('archive_link', {
    link: {
        type: DataTypes.STRING,
        field: 'link',
    },
    password: {
        type: DataTypes.STRING,
        field: 'password'
    },
    link_only: {
        type: DataTypes.BOOLEAN,
        field: 'link_only'
    }
}, {underscored: true});


module.exports.ArchiveLink = ArchiveLink;
