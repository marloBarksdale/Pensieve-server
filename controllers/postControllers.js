import Post from '../models/postModel.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).send(posts);
  } catch (error) {}
};

export const addPost = async (req, res, next) => {
  try {
    const post = await new Post({ ...req.body, author: req.user._id }).save();

    res.status(201).send(post);
  } catch (error) {
    res.status(400).status(error);
  }
};
