const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');
const {ArchiveLink} = require("./ArchiveLink");


const ArchiveProps = sequelize.define('archive_props', {
    name: {
        type: DataTypes.STRING,
        field: 'name'
    },
    expire_time: {
        type: 'TIMESTAMP',
        field: 'expire_time'
    }
}, {underscored: true});

// One to one relationship
ArchiveLink.hasOne(ArchiveProps, {foreignKeyConstraint: true});

module.exports.ArchiveProps = ArchiveProps;
