const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');
const {conf} = require("../config")["dev"];
const {Link} = require("./Link");


const ArchiveProps = sequelize.define('archive', {
    name: {
        type: DataTypes.STRING,
        field: 'name'
    },
    password: {
        type: DataTypes.STRING,
        field: 'password'
    },
    creation_time: {
        type: 'TIMESTAMP',
        field: 'creation_time'
    },
    expire_time: {
        type: 'TIMESTAMP',
        field: 'expire_time'
    }
}, {underscored: true});

// One to one relationship
ArchiveProps.belongsTo(Link, {onDelete: 'cascade'});

module.exports.ArchiveProps = ArchiveProps;
