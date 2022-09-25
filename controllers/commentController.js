import Comment from '../models/commentModel.js';

export const getComments = async (req, res, next) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ post: postId });

  res.send(comments);
};

export const addComment = async (req, res, next) => {
  const { postId, commentId } = req.params;

  const comment = new Comment({
    post: postId,
    author: req.user._id,
    message: req.body.message,
    parent: commentId,
  });

  await comment.save();

  res.send(comment);
};
