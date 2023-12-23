const WriteModes = require('./WriteModes');
const jsonFinish = '}';


const Utils = require('./Utils');


// TODO: Move this elsewhere, it's an abstract class, currently only used for MARSWrite
class AbstractWrite {

    mimeType;
    expressResponse;
    writeMode;
    writtenKeys;
    headerWritten;
    

    constructor(expressResponse) {
        this.expressResponse=expressResponse;
        this.writeMode = WriteModes.JSON;
        this.writtenKeys = null;
        this.headerWritten = false;
    }

    setMode(writeMode) {
        this.writeMode=writeMode;
    }

    setMimeType(mimeType) {
        this.mimeType=mimeType;
    }

    writeJSON(...args) {
        // Abstract - Not implemented here
    }

    finish(){
        switch (this.writeMode) {
            case WriteModes.JSON:
                if (this.writtenKeys != null) {
                    this.expressResponse.write(jsonFinish);
                    this.expressResponse.end();
                    this.writtenKeys = null;
                }
                break;
        }
        //this.expressResponse.send();
    }

}

class MARSWrite extends AbstractWrite {
    constructor(expressResponse){
        super(expressResponse)
    }

    writeJSON(key, value) {
        if(!this.headerWritten) {
            console.log("SETTING WRITEJSON HEADER");
            this.expressResponse.setHeader('Content-Type','application/json');
            this.headerWritten=true;
        }
        // If only one argument, must be a whole object
        if(Utils.isObject(key) && value === undefined) {
            let jsonObj = key;
            let keys = Object.keys(jsonObj);
            // Go through all keys and set each JSON Key
            for(let objKey of keys) {
                this.writeJSON(objKey, jsonObj[objKey]);
                return;
            }
        }
        this.writeMode = WriteModes.JSON;
        let sb = "";
        if (this.writtenKeys == null) {
            this.writtenKeys = new Set();
            sb += '{';
        } else {
            if (this.writtenKeys.has(key)) {
                throw new Error(`Key ${key} is already written`);
            }
            sb+=',';
        }
        this.writtenKeys.add(key);
        sb += `\"${key}\":`
        sb += JSON.stringify(value);
        
        this.expressResponse.write(sb);
        
    }


}



module.exports = MARSWrite; 
