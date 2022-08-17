import debug from 'debug';
import Express from 'express';
import logger from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import Post from './models/postModel.js';

debug('pensieve-app:server');

const app = Express();

app.use(logger('dev'));

mongoose
  .connect(process.env.MONGODB, { dbName: 'pensieve' })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
    post();
  })

  .catch((error) => console.log(error.message));

const post = async () => {
  const message = new Post({ title: 'Hello', author: 'John' });

  await message.save();
};
