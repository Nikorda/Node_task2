const { connectToDB } = require('./common/db.client');

const { PORT } = require('./common/config');
const app = require('./app');

const { logger } = require('./common/log');

connectToDB(() => {
  app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
  );
});
