const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');


exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ article: req.params.articleId })
    .populate('author', 'username')
    .populate('replies');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.article = req.params.articleId;
  req.body.author = req.user.id;

  const comment = await Comment.create(req.body);
  const populatedComment = await Comment.findById(comment._id)
  .populate('author', 'username')
  .populate({
    path: 'replies',
    populate: { path: 'author', select: 'username' }
  });
  req.app.get('io').to(req.params.articleId).emit('newComment', populatedComment);

  res.status(201).json({
    success: true,
    data: populatedComment
  });
});


exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id ${req.params.id}`, 404)
    );
  }

  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to delete this comment', 401)
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});