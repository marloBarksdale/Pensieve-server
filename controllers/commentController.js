import Comment from '../models/commentModel';

const getComments = async (req, res, next) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ post: postId });

  res.send(comments);
};
