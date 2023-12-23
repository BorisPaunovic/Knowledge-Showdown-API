const fs = require('fs')
const { EOL, platform } = require('os');

function getPlatformNewLine() {
    let currentOs = platform();
    if (currentOs === 'win32') {
        return '\r\n';
    }
    return '\n'
}

function getPlatformDirSeparator() {
    let currentOs = platform();
    if (currentOs === 'win32') {
        return '\\';
    }
    return '/'
}

function isObject(arg) {
    if (
        typeof arg === 'object' &&
        !Array.isArray(arg) &&
        arg !== null
    ) {
        return true;
    }
    return false;
}

class StringSplitter {
    constructor(str) {
        this.str = str;
        this.pos = 0;
    }

    hasMore() {
        return this.pos < this.str.length;
    }

    read() {
        if (this.eof()) {
            return '\0';
        }
        return this.str[this.pos++];
    }

    isNext(ch) {
        if (this.eof()) return false;
        else return ch === this.str[this.pos];
    }

    skip(numChars) {
        this.pos += numChars;
    }

    back(numChars = 1) {
        this.pos -= numChars;
    }

    eof() {
        return this.pos >= this.str.length;
    }

}

function getDotEnv() {
    var dat = fs.readFileSync(".env", "utf-8");
    var envConfig = {};
    var rows = dat.split('\n');
    for (var i = 0; i < rows.length; i++) {
        var split = rows[i].split("=");
        envConfig[split[0]] = split[1];
    }
    return envConfig;
}
let conf = getDotEnv()

module.exports = {
    isObject,
    getDotEnv: () => conf,
    StringSplitter,
    getPlatformDirSeparator
}