import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { chatRouter } from './routes/chat';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(chatRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
