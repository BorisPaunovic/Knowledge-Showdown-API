
const {getDotEnv} = require("../mars_modules/mars/Utils")
const bodyParser = require('body-parser');
const marsEndpoints = require('../mars_endpoints')
const env = getDotEnv()
const path = require('path');
const express = require('express')
const initmodules = require("@init_modules")
const prepareExpressEndpoints = require("@prepare_express");

const PORT = env.PORT || 3000

function _bodyParser () {
  return bodyParser.json();
}

function _isSameWhenSRCRemoved (end, path) {
  if(!env.DEFAULT_PAGE) return false
  let src = env.DEFAULT_PAGE.split('/')
  src.pop()
  src = src.join('/')
  return end.substring(src.length+1) == (path)
}

function exposeDefault (req, res, next)  {
  if (req.path === '/' && env.DEFAULT_PAGE) {
    res.sendFile(path.join(__dirname, '..','mars_fs',path.sep, env.DEFAULT_PAGE))
    return
  }
  next()
}


function cookieParser(req, res, next) {
  let cookies = req.headers.cookie;
  if (cookies) {
    req._cookies = cookies.split(";").reduce((obj, c) => {
      let n = c.split("=");
      obj[n[0].trim()] = n[1].trim();
      return obj
    }, {})
  }
  next();
}

function protectSource(req, res, next) {
  function goTo404() {
    if (env.DEFAULT_PAGE) {
      res.redirect('/')
    } else {
      res.status(404);
      res.send(`Cannot ${req.method} ${req.path}`);
    }
  }
  
  if(marsEndpoints[req.path] !== undefined) {
    goTo404()
    return;
  }
  // Protect source code of API endpoints
  // If someone tries to request an API file source code - 404 and refuse
  for (const endpoint of Object.keys(marsEndpoints)) {
    if (_isSameWhenSRCRemoved(endpoint,req.path)) {
      goTo404()
      return;
    }
  }
  next();
}

function getStatic() {
  // TODO: FIX STATIC FILE HANDLING
  // if (env.DEFAULT_PAGE) {
  //   let src = env.DEFAULT_PAGE.split('/')
  //   src.pop();
  //   src = src.join('/')
  //   return express.static(path.join(__dirname, '..', 'mars_fs/', src))
  // }
  return express.static(path.join(__dirname, '..', 'mars_fs'))
}

function prepareEndpoints(app) {
  prepareExpressEndpoints(app, initmodules, marsEndpoints);
}

function exitHandler (error, req, res, next) {
  // Exit middleware
  console.log("Error middleware invoked", error.message);
  if(error.message === "MARS_EXIT_EXCEPTION"){
    console.log("Exit Middleware called")
    console.log('Path: ', req.path)
    next();
    return;
  }
  next(error) // (optional) invoking next middleware
}

function handle404Page (app) {
  app.get('*', function(req, res, next) {
    if (env.DEFAULT_PAGE && req.path !== '/') {
      res.sendFile(path.join(__dirname, '..', 'mars_fs/', env.DEFAULT_PAGE))
      return
    }
    next()
  }); 
}

function initApp (app) {
  app.listen(PORT, () => {
    console.log(`MARS App listening on port ${PORT}`)
  })
}

module.exports = {
  exposeDefault,
  protectSource,
  getStatic,
  prepareEndpoints,
  cookieParser,
  exitHandler,
  handle404Page,
  bodyParser: _bodyParser, // avoid collision with bodyParser module
  initApp
}