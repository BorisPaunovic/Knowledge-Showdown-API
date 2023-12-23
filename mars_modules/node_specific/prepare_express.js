const MARSConnection = require("../mars/MARSConnection");
const MARSDBConnection = require("../mars/MARSDBConnection")

function parseEndpoint(endpoint) {
    // TODO: How do we export Websockets??

    let splitByDot = endpoint.split(".");
    // Last is file extension
    // Second-last MUST be method
    let method = splitByDot[splitByDot.length-2];
    // Rest is path
    let path = splitByDot.slice(0, splitByDot.length-2).join(".");

    // Trim the starting slash if there is any
    // Because requiring files requires @mars_fs/ which already has a '/' at the end
    let requirePath = path[0] === '/' ? path.substring(1) : path;
    //console.log('patj[0]',path[0] === '/',requirePath)  

    // Require path should be @mars_fs / originalApiPath
    requirePath = `@mars_fs${endpoint}`;

    return {
        method,
        requirePath,
        path
    }
}

function cleanup(modules, req, res, marsconn){
    marsconn.getWrite().finish();
}

function prepareExpressEndpoints(app, initmodules, endpointsObj) {
  var endpointsArr = Object.keys(endpointsObj);
  for(endpoint of endpointsArr) {
    let parsedEndpoint = parseEndpoint(endpoint);
    // console.log("Parsed ENDPOINT ", parsedEndpoint)

    // app.get('/')
    app[parsedEndpoint.method.toLowerCase()](`${parsedEndpoint.path}`, (req, res, next) => {
      let marsconn = new MARSConnection(req,res);
      let dbConn = MARSDBConnection;
      var modules = initmodules(req, res, marsconn, dbConn);
      
      try{
        // explanation of this is:
        // 1. We want to call the function that is exported by the module
        // 2. We want to pass the modules as arguments
        // example of a function that would behave simmilar to this require:
        /**
         * let add = (num) => {
         *    return function (num2) {
         *      return num + num2;
         *    }
         * }
         * add(1)(2) // 3
         */
        require(parsedEndpoint.requirePath)(modules);
        // all queries are send as a queue and if no errors are found all queries are executed and commited
        dbConn.query('COMMIT;')
      }
      catch(e){
        if(e.message !== 'MARS_EXIT_EXCEPTION') {
          console.log("error ",e);
          marsconn.getWrite().writeJSON("Execution error", e.message);
          throw e;
        }
      }
      finally {
        cleanup(modules, req, res, marsconn);  
      }
      
      
    });
  }
}

module.exports = prepareExpressEndpoints;