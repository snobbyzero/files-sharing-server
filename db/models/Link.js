const sequelize = require('../index').sequelize;
const DataTypes = require('sequelize');

module.exports.Link = sequelize.define('link', {
    link: {
        type: DataTypes.STRING,
        field: 'link',
    },
    password: {
        type: DataTypes.STRING,
        field: 'password'
    }
});
