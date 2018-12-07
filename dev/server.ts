import express from 'express';

import { AppController } from './controllers';

const app: express.Application = express();

const port: number = 3000;

app.use('/', AppController);

app.use('/blockchain', AppController);

app.use('/transaction', AppController);

app.use('/mine', AppController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
})