const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');
const {ArchiveLink} = require("./ArchiveLink");

const ArchiveInformation = sequelize.define('archive_information', {
    name: {
        type: DataTypes.STRING,
        field: 'name'
    },
    description: {
        type: DataTypes.TEXT,
        field: 'description'
    },
    expire_time: {
        type: 'TIMESTAMP',
        field: 'expire_time'
    }
}, {underscored: true});

// One to one relationship
ArchiveLink.hasOne(ArchiveInformation, {
    foreignKeyConstraint: true,
    onDelete: 'cascade'
});

module.exports.ArchiveInformation = ArchiveInformation;
