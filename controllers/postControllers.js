import mongoose from 'mongoose';
import { s3 } from '../index.js';
import Image from '../models/imageModel.js';
import Post from '../models/postModel.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).send(posts);
  } catch (error) {}
};

export const addPost = async (req, res, next) => {
  try {
    let image = {};
    if (req.file) {
      image = new Image({
        imageUrl: req.file.location,
        imageKey: req.file.key,
      });

      await image.save();
    }

    req.body.image = image?._id;

    const post = await new Post({ ...req.body, author: req.user._id }).save();
    await post.populate('image');
    res.status(201).send(post);
  } catch (error) {
    res.status(400).status(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    return res.send(post);
  } catch (error) {
    res.status(500).send();
  }
};

export const updatePost = async (req, res, next) => {
  const id = req.params.id;

  const post = await Post.findById(req.params.id);

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).send('You cannot perform this action');
  }

  let image = {};
  if (req.file) {
    image = await Image.findById(post?.image?._id);

    if (image) {
      const s3Params = { Bucket: process.env.BUCKET, Key: image.imageKey };
      await s3.deleteObject(s3Params).promise();
      await Image.findByIdAndDelete(image._id);
    }

    image = new Image({
      imageUrl: req.file.location,
      imageKey: req.file.key,
    });

    await image.save();
    req.body.image = image._id;
  }

  const newPost = await Post.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
    },
  );
  console.log(newPost);
  res.send(newPost);
};

export const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id; //Retrieve id from params

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send('Not found');
    } else if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send('You cannot perform this action');
    }

    const image = await Image.findById(post?.image?._id);

    if (image) {
      const s3Params = { Bucket: process.env.BUCKET, Key: image.imageKey };
      await s3.deleteObject(s3Params).promise();
      await Image.findByIdAndDelete(image._id);
    }

    const toDelete = await Post.findByIdAndDelete(id);
    return res.status(200).send('Deletion successful');
  } catch (error) {}
};
