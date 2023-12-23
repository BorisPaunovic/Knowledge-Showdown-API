const WriteModes = require('./mars/WriteModes')

class Response {
    res;
    constructor(res) {
        this.res = res;
    }

    setCache(...args) {
        if (args.length > 1) {
            throw new Error("Method setCache needs only one parameter");
        }
        var sec;
        if (args.length == 0) {
            sec = 604800;
        } else if (typeof args[0] === 'number') {
            sec = Math.round(args[0]);
        } else {
            let v = args[0].trim();
            if (v==="") {
                sec = 604800;
            } else {
                let last = v[v.length - 1];
                let p = 1;
                // Convert the value to seconds based on string
                switch (last) {
                    case 's':
                        p = 1;
                        break;
                    case 'm':
                        p = 60;
                        break;
                    case 'h':
                        p = 3600;
                        break;
                    case 'D':
                        p = 86400;
                        break;
                    case 'W':
                        p = 604800;
                        break;
                    case 'M':
                        p = 2592000;
                        break;
                    case 'Y':
                        p = 31536000;
                        break;
                }
                try {
                    if (!isNaN(last)) {
                        sec = Math.round(Number.parseFloat(v));
                    } else {
                        sec = Math.round(Number.parseFloat(v.substring(0, v.length() - 1)) * p);
                    }
                } catch (e) {
                    throw new Error("Invalid value format");
                }
            }
        }
        if (sec <= 0) {
            sec = 604800;
        } else if (sec > 31536000) {
            sec = 31536000;
        }
        
        let conn = this.res;
        console.log('conn', conn)
    
        conn.setHeader("Cache-Control", "public, max-age=" + sec);        
        if(sec>0) {            
            conn.setHeader("pragma", null);
            conn.setHeader("Expires",new Date((sec+1)*1000));
        }
        let modstr = new Date().toUTCString();
        conn.setHeader("Last-Modified", modstr);
    
    
    
    }

    setContentType(...args) {
        if (args.length != 1 || args[0] == null) {
            throw new Error("Method setContentType needs exactly one parameter");
        }
        let conn = this.res;
        if(conn==null) return;
        let write = conn.getWrite();
        //let t = args[0].toString();
        //let mimeType = HTTPUtils.getContentType(t);
        let mimeType = args[0].toString();
        if (mimeType.contains("text")) {
            write.setType(WriteModes.TEXT);
            write.setMime(mimeType)
        } else if (mimeType.contains("json")) {
            write.setType(WriteModes.JSON);
            write.setMime(mimeType)
        } else {
            write.setType(WriteModes.BIN);
            write.setMime(mimeType)
        }        
    }
    
    setCookie(...args) {
        if (args.length > 3 || args[0] == null || args[1] == null) {
            throw new Error("Method setCookie needs 2 parameters: name and value (3rd parameter 'options' is optional)");
        }
        if (typeof args[0] !== 'string') {
            throw new Error("Method setCookie needs string as first parameter");
        }
        // intentionally set as undefined if not set
        let options = undefined;
        if (args[2] != null) {
            options = args[2];
        }
        let connection = this.res.getExpressRes()
        connection.cookie(args[0], args[1], options);
    }

    status(...args) {
        let conn = this.res;
        if(conn==null) return;
        if(args.length < 1 || args[0] == null) {
            throw new Error("method 'setStatus' requires 1-2 arguments: code, message");
        } 
        let code = Number.parseInt(args[0]);
        if(args.length === 1) {
            conn.setStatus(code);
        }
        else {
            conn.setStatus(code, args[1]);
        }
    }

    close(...values) {
        this.res.close();        
    }

    header(...values) {
        if (values.length != 2 || values[0] == null) {
            throw new Error("Method setHeader needs 2 parameters: name and value");
        }
        let conn = this.res;
        if(conn==null) return;
        conn.setHeader(values[0].toString(), values[1]);
    
    }

}



module.exports = Response;
