import * as express from 'express';
import * as bodyParser from 'body-parser';

import env from './env';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set ENV variables
env();

try {
  app.listen(process.env.PORT);
  process.stdout.write(`INFO: Server listening on port ${process.env.PORT}`);
} catch (err) {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
}
