const MARSWrite = require("./MARSWrite")

class MARSConnection {
    constructor(expressReq, expressRes) {
        this.expressReq=expressReq;
        this.expressRes=expressRes;
        this.MARSWrite = new MARSWrite(this.expressRes);
    }

    getExpressReq() {
        return this.expressReq;
    }

    getExpressRes() {
        return this.expressRes;
    }

    send(data) {
        this.expressRes.write(data)
    }

    setHeader(key,val){
        this.expressRes.setHeader(key, val);
    }

    setStatus(code, message) {
        if(message===undefined){
            console.log("MARS setStatus",code)
            this.expressRes.status(code);
        }
        else {
            this.expressRes.status(code);
            this.expressRes.statusMessage=message;
        }
    }

    getWrite() {
        return this.MARSWrite;
    }

    close(){
        this.expressRes.end();
    }
}

module.exports = MARSConnection;