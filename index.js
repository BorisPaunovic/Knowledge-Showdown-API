
require('module-alias/register')
const express = require('express')
const app = express()
const {
  exposeDefault,
  protectSource,
  getStatic,
  cookieParser,
  prepareEndpoints,
  exitHandler,
  handle404Page,
  bodyParser,
  initApp
} = require('./middleware')

app.set('trust proxy', true)

app.use(bodyParser());

app.use(protectSource);

app.use(exposeDefault);

app.use(getStatic())

app.use(cookieParser);

// Register existing API endpoints for Express
prepareEndpoints(app)

app.use(exitHandler)

// handle 404 to default page
handle404Page(app)

initApp(app)

