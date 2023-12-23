class Request {
  constructor (marsconn) {
    this.req = marsconn.getExpressReq();
    this.ip = this.req.ip || this.req.ips
  }

  isSecure() {
    return this.req.secure;
  }

  getAllCookies () {
    return this.req._cookies;
  }
  getCookie (name) {
    return this.req._cookies[name];
  }
  header (name) {
    return this.req.headers[name];
  } 
}

module.exports = Request;