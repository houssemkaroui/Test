const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticleWithImage,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const upload = require('../config/multer');

const Article = require('../models/Article');


router.route('/')
  .get(
    advancedResults(Article, {
      path: 'author',
      select: 'username'
    }),
    getArticles
  )
  .post(
    protect,
    authorize('writer', 'editor', 'admin'),
    upload.single('image'),
    createArticleWithImage
  );

router
  .route('/:id')
  .get(getArticle)
  .put(protect,upload.single('image'), updateArticle)
  .delete(protect, authorize('admin'), deleteArticle);

module.exports = router;
