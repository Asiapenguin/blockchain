import express from 'express';

import { AppController } from './controllers';

const app: express.Application = express();

// 3rd process variable
const port = process.argv[2];

app.use('/', AppController);

app.use('/blockchain', AppController);

app.use('/transaction', AppController);

app.use('/mine', AppController);

app.use('/register-broadcast-node', AppController);

app.use('/register-node', AppController);

app.use('/register-nodes', AppController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
})