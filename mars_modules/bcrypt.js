var bcryptPackage = require('bcrypt');

function bcrypt(password, hash) {
    if (password === undefined) {
        throw new Error('Password requrired.')
    }
    if(hash === undefined) {
        const hash = bcryptPackage.hashSync(password, 10);
        return hash;
    }
    return bcryptPackage.compareSync(password, hash);
}

module.exports = bcrypt;
