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
import multerS3 from 'multer-sharp-s3';
import sharp from 'sharp';
import { auth } from './middleware/auth.js';

debug('pensieve-app:server');

const app = Express();

export const s3 = new S3({
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

const avatarUpload = multer({
  fileFilter,
  storage: multerS3({
    s3,

    resize: { height: 400, width: 400, options: { fit: 'inside' } },

    ACL: 'public-read',
    Bucket: process.env.AVATAR_BUCKET,
    Key: function (req, file, cb) {
      cb(null, 'avatar-' + new Date().toISOString() + '-' + file.originalname);
    },
  }),
});

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    ACL: 'public-read',
    Bucket: process.env.BUCKET,
    Key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  }),
});

app.use(logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/posts', auth, upload.single('image'), postRouter);
app.use('/user', avatarUpload.single('avatar'), userRouter);
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
