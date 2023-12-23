// TODO: Handle File params
function param(name, defaultResult) {
    var val = this.marsconn.expressReq.query[name];
    // If there was an encoded value in request body
    if(this.marsconn.expressReq.body[name]) {
        var bodyVal = this.marsconn.expressReq.body[name];
        if(bodyVal !== undefined) {
            val = bodyVal;
        }
    }
    if(val === undefined && typeof defaultResult === 'function') {
        val = defaultResult(name);
    }
    if(val === undefined && defaultResult !== undefined) {
        val = defaultResult;
    }
    return val;
}

module.exports = param;
