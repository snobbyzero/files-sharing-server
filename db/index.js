const Sequelize = require('sequelize/lib/sequelize');

const conf = require('./config')["dev"];


const sequelize = new Sequelize(conf.dbname, conf.username, conf.password, {
        host: "localhost",
        dialect: conf.dialect
    });

const createTables = () => {
    sequelize.sync()
        .then(result => console.log(`Sync result: ${result.options}`));
}

const testConnection = () => {
    sequelize.authenticate()
        .then(() => {
            console.log(`Successfully connected to ${conf.dbname}`);
        })
        .catch(err => {
            console.log(err);
        });
};


module.exports.sequelize = sequelize;
module.exports.testConnection = testConnection;
module.exports.createTables = createTables;
