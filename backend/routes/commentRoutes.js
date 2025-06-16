const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

router
  .route('/articles/:articleId/comments')
  .get(getComments)
  .post(protect, addComment);

router
  .route('/:id')
  .delete(protect, deleteComment);

module.exports = router;