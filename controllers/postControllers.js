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

export const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id; //Retrieve id from params

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send('Not found');
    } else if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send('You cannot perform this action');
    }

    const toDelete = await Post.findByIdAndDelete(id);
    return res.status(200).send('Deletion successful');
  } catch (error) {}
};