const bcrypt = require('bcryptjs')

module.exports = function hash(password) {
    return bcrypt.hashSync(password, 14);
}