
const SID_LENGTH = 32;
var sidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const sessionStore = {};

// TODO: Implment cleaner task, a setInterval should do
// TODO: Low-level express should refresh time on sessions with sid

class Session {
    constructor(id) {
        this.id = id;
        this.time = new Date().getTime();
        this.data = {};
    }

    setValue(key,value) {
        this.data[key]=value;
        this.time = new Date().getTime();
    }

    getValue(key) {
        this.time = new Date().getTime();
        return this.data[key];
    }
}

function makeID(){
    var sid = "";
    var i=0;        
    for (i=0; i < SID_LENGTH; i++) {
        sid= sid+sidChars[Math.floor(Math.random()*sidChars.length)];
    }
    return sid;
}

function getCurrentRequestSID(req) {
    var currentSID;
    currentSID=req.headers["x-mars-sid"];
    if(currentSID === undefined) {
        currentSID = req.query["sid"];
        if(req.body["sid"]) {
            currentSID = req.body["sid"];
        }
    }
    // TODO: Implement cookie sid
    if(currentSID=== undefined) {

    }
    return currentSID;
}


function session(key, value) {
    var currentSID;
    currentSID=getCurrentRequestSID(this.req);
    var currentSession;
    if(currentSID) {
        currentSession=sessionStore[currentSID];
    }

    if(arguments.length === 0) {
        var newSID = makeID();
        var s = new Session(newSID);
        sessionStore[newSID]=s;
        return newSID;
    }
    if(arguments.length === 1) {
        if(currentSession) {
            return currentSession.getValue(key)===undefined? null:currentSession.getValue(key);
        }
    }
    if(arguments.length === 2) {
        if(currentSession) {
            currentSession.setValue(key, value);
        }
    }
}

function close(){

}

function prepareSession(req){
    let tempSess = session.bind({req}); 
    tempSess.close = close;
    return tempSess;
}

module.exports = prepareSession;