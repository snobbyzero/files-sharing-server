const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');
const {ArchiveLink} = require("./ArchiveLink");


const ArchiveProps = sequelize.define('archive_props', {
    unique_id: {
        type: DataTypes.STRING,
        field: 'unique_id'
    }
}, {underscored: true});

// One to one relationship
ArchiveLink.hasOne(ArchiveProps, {
    foreignKeyConstraint: true,
    onDelete: 'cascade'
});

module.exports.ArchiveProps = ArchiveProps;
