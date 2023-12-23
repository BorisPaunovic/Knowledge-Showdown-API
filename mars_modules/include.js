const path = require("path");
const util = require('./mars/Utils')

function getStack() {
    // Save original Error.prepareStackTrace
    var origPrepareStackTrace = Error.prepareStackTrace
  
    // Override with function that just returns `stack`
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
  
    // Create a new `Error`, which automatically gets `stack`
    var err = new Error()
  
    // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
    var stack = err.stack
  
    // Restore original `Error.prepareStackTrace`
    Error.prepareStackTrace = origPrepareStackTrace
  
    // Remove superfluous function call on stack
    stack.shift() // getStack --> Error
  
    return stack
}

function getCaller() {
    var stack = getStack()
  
    // Remove unneccessary function calls on stack
    stack.shift() // getCaller --> getStack
    stack.shift()
    // Return caller's caller
    return stack[0]
}


function include(includePath) {
    let splitBy = util.getPlatformDirSeparator()
    var s = getCaller();
    var callerDirnameSplit = s.getFileName().split(splitBy);
    console.log(callerDirnameSplit);
    var callerDirname="";
    for(var i=0; i<callerDirnameSplit.length-1; i++) {
        if(i > 0) {
            callerDirname = callerDirname+splitBy;
        }
        callerDirname += callerDirnameSplit[i]
    }
    var resolvedPath = path.resolve(callerDirname,includePath)
    console.log("Resolved path: ", resolvedPath)
    var t = require(resolvedPath);
    return t;
}

module.exports = include;
