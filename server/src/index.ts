import { app } from './app';

const start = async () => {
  console.log('Starting up...');

  if (!process.env.HF_API_KEY) {
    throw new Error('HF_API_KEY not found');
  }

  if (!process.env.ELASTIC_SEARCH_URI) {
    throw new Error('ELASTIC_SEARCH_URI must be defined');
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
