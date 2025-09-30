const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: [true, 'Issue reference is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
commentSchema.index({ issue: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Method to toggle like
commentSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likedBy.findIndex(id => id.toString() === userId.toString());
  
  if (likeIndex >= 0) {
    // Remove like
    this.likedBy.splice(likeIndex, 1);
    this.likes--;
  } else {
    // Add like
    this.likedBy.push(userId);
    this.likes++;
  }
  
  return this.save();
};

// Method to check if user has liked
commentSchema.methods.hasUserLiked = function(userId) {
  return this.likedBy.some(id => id.toString() === userId.toString());
};

module.exports = mongoose.model('Comment', commentSchema);
