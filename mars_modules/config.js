const {getDotEnv} = require("./mars/Utils")

function config(name, defaultResult) {
    var envConfig = getDotEnv();
    var val = envConfig[name];
    if(val === undefined && defaultResult !== undefined) {
        return defaultResult;
    }
    // Always return null if undefined
    if(val === undefined) {
        val = null;
    }
    return val;
}

module.exports = config;
