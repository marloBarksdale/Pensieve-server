import debug from 'debug';
import Express, { urlencoded } from 'express';
import logger from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import Post from './models/postModel.js';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';
import S3 from 'aws-sdk/clients/s3.js';
import multer from 'multer';
import multerS3 from 'multer-s3';

debug('pensieve-app:server');

const app = Express();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWSID,
    secretAccessKey: process.env.AWSSECRET,
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
    return cb(null, false);
  }

  cb(undefined, true);
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.BUCKET,
    key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  }),
});

app.use(logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(upload.single('image'));
app.use('/posts', postRouter);
app.use(userRouter);
app.use('/', postRouter);
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
