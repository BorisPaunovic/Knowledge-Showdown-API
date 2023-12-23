function copyTo(stringSplitter, toChar, stringBuilderObj) {
    let ch, last = '\0';
    while ((ch = stringSplitter.read()) != toChar || last == '\\') {
        if (stringSplitter.eof()) {
            throw new Error("Closing " + toChar + " not found");
        }
        stringBuilderObj.str+=ch;
        if (ch == '\\' && last == '\\') {
            last = '\0';
        } else {
            last = ch;
        }
    }
}