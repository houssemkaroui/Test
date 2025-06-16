const Article = require('../models/Article');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');
const fs = require('fs');

exports.getArticles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id)
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  article.views += 1;
  await article.save();

  res.status(200).json({
    success: true,
    data: article
  });
});


exports.createArticleWithImage = asyncHandler(async (req, res, next) => {

  let imageName = 'no-photo.jpg';
  
  if (req.file) {
    const file = req.file;

    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Veuillez uploader un fichier image`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(
        `L'image doit être inférieure à ${process.env.MAX_FILE_UPLOAD} bytes`, 
        400
      ));
    }

    imageName = `article-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(process.env.FILE_UPLOAD_PATH, imageName);

    try {
      await fs.promises.writeFile(filePath, file.buffer);
    } catch (err) {
      console.error(err);
      return next(new ErrorResponse(`Problème lors de l'upload de l'image`, 500));
    }
  }

  req.body.author = req.user.id;
  req.body.image = imageName;


  if (!req.body.tags || !Array.isArray(req.body.tags)) {
    return next(new ErrorResponse(`Les tags doivent être un tableau`, 400));
  }

  const article = await Article.create(req.body);
  req.app.get('io').emit('newArticle', article);

  res.status(201).json({
    success: true,
    data: article
  });
});


exports.updateArticle = asyncHandler(async (req, res, next) => {
  let article = await Article.findById(req.params.id);

  if (!article) {
    return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
  }


  if (
    article.author.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'editor'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this article`, 401));
  }


  let imageName = article.image;

  if (req.file) {
    const file = req.file;

    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Veuillez uploader un fichier image`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(
        `L'image doit être inférieure à ${process.env.MAX_FILE_UPLOAD} bytes`, 
        400
      ));
    }

    imageName = `article-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(process.env.FILE_UPLOAD_PATH, imageName);

    try {
      await fs.promises.writeFile(filePath, file.buffer);

      if (article.image && article.image !== 'no-photo.jpg' && article.image !== imageName) {
        const oldPath = path.join(process.env.FILE_UPLOAD_PATH, article.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

    } catch (err) {
      return next(new ErrorResponse(`Erreur lors de l'upload d'image`, 500));
    }
  }
  const updateData = {
    title: req.body.title || article.title,
    content: req.body.content || article.content,
    image: imageName
  };

  if (req.body.tags) {
    if (Array.isArray(req.body.tags)) {
      updateData.tags = req.body.tags;
    } else {
      updateData.tags = String(req.body.tags).split(',').map(tag => tag.trim());
    }
  }

  article = await Article.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  req.app.get('io').emit('articleUpdated', article);

  res.status(200).json({
    success: true,
    data: article
  });
});



exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this article`, 
        401
      )
    );
  }

  if (article.image !== 'no-photo.jpg') {
    const filePath = path.join(
      __dirname, 
      `../public/uploads/${article.image}`
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await article.deleteOne(); 
  req.app.get('io').emit('articleDeleted', article._id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
