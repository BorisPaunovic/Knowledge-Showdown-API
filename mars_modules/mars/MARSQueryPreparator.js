const Utils = require('./Utils');

// StringBuilderObj is an object containing str to allow for pass-by-reference
function copyTo(stringSplitter, toChar, stringBuilderObj) {
    let ch, last = '\0';
    while ((ch = stringSplitter.read()) != toChar || last == '\\') {
        if (stringSplitter.eof()) {
            throw new Error("Closing " + toChar + " not found");
        }
        stringBuilderObj.str += ch;
        if (ch == '\\' && last == '\\') {
            last = '\0';
        } else {
            last = ch;
        }
    }
}

function isValidChar(ch) {
    let str = ch
    // No, because it's a string
    if (str.length > 1) {
        return false;
    }

    // Is letter?
    if (str.match(/[a-z]/i)) {
        return true;
    }
    if (str === "$") {
        return true;
    }
    if (str === "_") {
        return true;
    }
    // Is digit?
    if (str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57) {
        return true;
    }
}

class MARSQueryPreparator {
    finalSQL;
    constructor(sql, data) {
        this.finalSQL = this.prepareSQL(sql, data)
    }
    toString() {
        return this.finalSQL
    }
    getValue(arr, getter) {
        if (typeof getter === 'number') {
            return arr[getter]
        }
        if (typeof getter === 'string' && arr.length === 1) {
            return arr[0][getter];
        }
    }
    valueToSQL(sbo, value) {
        console.log(value);
        let append = (v) => {
            sbo.str += v
        }
        append('\'')
        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            switch (char) {
                case '\'':
                    append("\\'")
                    break;
                case '\\':
                    append("\\\\")
                    break;
                case '\"':
                    append("\\\"")
                    break;
                default:
                    append(char)
                    break;
            }
        }
        append('\'')
    }
    prepareSQL(sql, valueMap) {
        let isArray = Array.isArray(valueMap);

        /// Receives stringSplitter: s
        function readParamName(s) {
            let sbo = { str: "" };
            let ch;
            while (s.hasMore()) {
                ch = s.read();
                if (!isValidChar(ch)) {
                    s.back(1);
                    return sbo;
                }
                sbo.str += ch;
            }
            return sbo;
        }

        let count = 0;
        let ch;

        let sbo = { str: '' }
        let s = new Utils.StringSplitter(sql);
        let quote = '\0';

        while (s.hasMore()) {
            ch = s.read();

            switch (ch) {
                case '"':
                case '\'':
                    sbo.str += ch;
                    copyTo(s, ch, sbo);
                    break;
                case '`':
                    if (!s.isNext("?") && !s.isNext(":")) {
                        sbo.str += ch;
                        copyTo(s, ch, sbo);
                    } else {
                        quote = ch;
                    }
                    break;
                case ':':
                    if (s.isNext("=")) {
                        break; // To allow for :=
                    }
                case '?':
                    let name = readParamName(s);
                    let value;
                    // console.log(valueMap);
                    if (name?.str?.length === 0 && isArray) {
                        value = this.getValue(valueMap, count++)//valueMap[count++]
                    } else {
                        let key = typeof name === 'object' ? name.str : name
                        value = this.getValue(valueMap, key)//valueMap[key];
                    }
                    // TODO: Write valueToSQL
                    this.valueToSQL(sbo, value);

                    if (s.isNext(quote)) {
                        s.skip(1);
                        sbo.str += quote;
                        quote = '\0';
                    }
                    continue;
            }
            sbo.str += ch;
        }

        return sbo.str;

    }
}

module.exports = MARSQueryPreparator