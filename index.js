import S3 from 'aws-sdk/clients/s3.js';
import compression from 'compression';
import cors from 'cors';
import debug from 'debug';
import 'dotenv/config';
import Express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import logger from 'morgan';
import multer from 'multer';
import multerS3 from 'multer-sharp-s3';
import { auth } from './middleware/auth.js';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';

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

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT,PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   next();
// });

app.use(function (req, res, next) {
  setTimeout(next, 1000);
});
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/posts', auth, upload.single('image'), postRouter);
app.use('/user', avatarUpload.single('avatar'), userRouter);
app.use('/', auth, postRouter);
mongoose
  .connect(process.env.MONGODB, { dbName: 'pensieve' })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
    // post();
  })

  .catch((error) => console.log(error.message));
