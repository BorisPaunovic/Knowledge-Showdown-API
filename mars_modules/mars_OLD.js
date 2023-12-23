var mysql = require('sync-mysql');

const fs = require('fs')
const {EOL} = require('os');

function extractEnvironment() {
    var dat = fs.readFileSync(".env", "utf-8");

    var envConfig = {};
    var rows = dat.split(EOL);
    for(var i=0; i<rows.length; i++) {
        var split = rows[i].split("=");
        envConfig[split[0]] = split[1];
    }
    return envConfig;
}

const envConfig = extractEnvironment();

var con = new mysql({
    host: "localhost",
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: "test"
  });
  

function write(key, data) {
    if(key === undefined) {
        this.res.json('unset_key', data)
        return;
    }
    var writeObj = {}
    writeObj[key] = data;
    this.res.json(writeObj);
}

var dbObj = {
    query: function(sql, ...data) {
        return con.query(sql, data);
    }
}

exports.write = write;
exports.db = dbObj;