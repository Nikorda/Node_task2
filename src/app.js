const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/boards.router');
const taskRouter = require('./resources/tasks/tasks.router');
const loginRouter = require('./resources/login/login.router');
const authorization = require('./middleware/authorization');
const { infoLogger, errorLogger } = require('./common/log');
const errorHandler = require('./common/errorHandler');
const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());

process.on('uncaughtException', error => {
  console.error(`Captured error: ${error.message}`);
});

process.on('unhandledRejection', reason => {
  console.error(`Unhandled rejection detected: ${reason.message}`);
});

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use((req, res, next) => {
  infoLogger.log('info', {
    time: new Date(),
    url: req.url,
    query: req.query,
    method: req.method,
    body: req.body,
    code: res.statusCode
  });
  next();
});

app.use('/login', loginRouter);

app.use(authorization);

app.use('/users', userRouter);

app.use('/boards', boardRouter);

boardRouter.use('/:boardId/tasks', taskRouter);

app.use(errorHandler);

app.use((err, req, res, next) => {
  errorLogger.log('error', `Error, code:${err.status}, message:${err.message}`);
  next();
});

module.exports = app;
