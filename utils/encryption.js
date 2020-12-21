const bcrypt = require("bcrypt");

module.exports.encryptPassword = (password) => {
    if (password != null) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    return password;
}

module.exports.compare = (password, hash) => bcrypt.compareSync(password, hash);
