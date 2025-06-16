
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const User = require('../models/User');

module.exports.initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connecté : ${socket.id}`);

    socket.on('joinArticleRoom', (articleId) => {
      socket.join(articleId);
     
    });

    socket.on('newComment', async ({ articleId, content, userId, parentCommentId }) => {
      try {
        const comment = await Comment.create({
          content,
          article: articleId,
          author: userId,
          parentComment: parentCommentId || null
        });

        if (parentCommentId) {
          await Comment.findByIdAndUpdate(parentCommentId, {
            $push: { replies: comment._id }
          });
        }

        const populatedComment = await Comment.findById(comment._id)
          .populate('author', 'username')
          .populate({
            path: 'replies',
            populate: { path: 'author', select: 'username' }
          })
          .populate('parentComment', 'content author');

        io.to(articleId).emit('commentAdded', populatedComment);

        const article = await Article.findById(articleId);
        if (article && article.author.toString() !== userId) {
          io.to(`user:${article.author}`).emit('notifyComment', {
            message: `🆕 Nouveau commentaire sur votre article`,
            comment: populatedComment
          });
        }

      } catch (err) {
        console.error('❌ Erreur lors de l’ajout du commentaire :', err);
        socket.emit('commentError', { message: 'Erreur lors de l’ajout du commentaire' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🚪 Client déconnecté : ${socket.id}`);
    });
  });
};
