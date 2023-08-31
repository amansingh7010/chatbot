import { app } from './app';

const start = async () => {
  console.log('Starting up...');

  if (!process.env.ELASTIC_SEARCH_URI) {
    throw new Error('ELASTIC_SEARCH_URI must be defined');
  }

  try {
    console.log(process.env.ELASTIC_SEARCH_URI);
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
