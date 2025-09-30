const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get comments for an issue
// @route   GET /api/comments/issue/:issueId
// @access  Public
router.get('/issue/:issueId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      issue: req.params.issueId, 
      isDeleted: false 
    })
      .populate('author', 'name email isAdmin')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    });
  }
});

// @desc    Add comment to issue
// @route   POST /api/comments
// @access  Private
router.post('/', [
  protect,
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  body('issueId')
    .isMongoId()
    .withMessage('Valid issue ID is required'),
  body('parentCommentId')
    .optional()
    .isMongoId()
    .withMessage('Valid parent comment ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content, issueId, parentCommentId } = req.body;

    // Check if issue exists
    const issue = await Issue.findById(issueId).populate('reportedBy', 'name email');
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if parent comment exists (for replies)
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      issue: issueId,
      author: req.user._id,
      isOfficial: req.user.isAdmin,
      parentComment: parentCommentId || null
    });

    // Populate the created comment
    await comment.populate('author', 'name email isAdmin');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
router.put('/:id', [
  protect,
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    // Update comment
    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    // Populate the updated comment
    await comment.populate('author', 'name email isAdmin');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating comment'
    });
  }
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Soft delete comment
    comment.isDeleted = true;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    });
  }
});

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Toggle like
    await comment.toggleLike(req.user._id);

    res.json({
      success: true,
      message: 'Like toggled successfully',
      data: {
        likes: comment.likes,
        hasUserLiked: comment.hasUserLiked(req.user._id)
      }
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking comment'
    });
  }
});

module.exports = router;
