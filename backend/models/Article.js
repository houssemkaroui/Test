const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function(tags) {
        return tags.length > 0 && tags.length <= 5;
      },
      message: 'Please add between 1 and 5 tags'
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

ArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ArticleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  justOne: false
});

module.exports = mongoose.model('Article', ArticleSchema);