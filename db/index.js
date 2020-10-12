const Sequelize = require('sequelize/lib/sequelize');

const conf = require('./config')["dev"];

const sequelize = new Sequelize(conf.dbname, conf.username, conf.password, {
    host: conf.domain,
    port: conf.port,
    dialect: conf.dialect
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected successfully');
    })
    .catch(err => {
        console.log(err);
    });

module.exports.sequelize = sequelize;

