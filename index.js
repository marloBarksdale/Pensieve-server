import debug from 'debug';
import Express, { urlencoded } from 'express';
import logger from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import Post from './models/postModel.js';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';

debug('pensieve-app:server');

const app = Express();

app.use(logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use('/posts', postRouter);
app.use(userRouter);
mongoose
  .connect(process.env.MONGODB, { dbName: 'pensieve' })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
    // post();
  })

  .catch((error) => console.log(error.message));

const post = async () => {
  const message = new Post({ title: 'Hello', author: 'John' });

  await message.save();
};
