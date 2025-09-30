const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc    Get all issues with filtering and pagination
// @route   GET /api/issues
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['traffic', 'sanitation', 'infrastructure', 'water', 'electricity', 'environment', 'security', 'other']),
  query('status').optional().isIn(['pending', 'in-progress', 'resolved', 'rejected']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'location.address': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get issues with population
    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Issue.countDocuments(filter);

    res.json({
      success: true,
      count: issues.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: issues
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issues'
    });
  }
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Get comments for this issue
    const comments = await Comment.find({ issue: issue._id, isDeleted: false })
      .populate('author', 'name email isAdmin')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        issue,
        comments
      }
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issue'
    });
  }
});

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
router.post('/', [
  protect,
  upload.single('image'), // Handle single image upload
  // Middleware to parse nested FormData objects
  (req, res, next) => {
    if (req.body['location[address]']) {
      // Convert FormData format to nested object
      req.body.location = {
        address: req.body['location[address]'],
        coordinates: {
          latitude: parseFloat(req.body['location[coordinates][latitude]']),
          longitude: parseFloat(req.body['location[coordinates][longitude]'])
        }
      };
      // Clean up the flat format
      delete req.body['location[address]'];
      delete req.body['location[coordinates][latitude]'];
      delete req.body['location[coordinates][longitude]'];
    }
    next();
  },
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn(['traffic', 'sanitation', 'infrastructure', 'water', 'electricity', 'environment', 'security', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude')
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

    const issueData = {
      ...req.body,
      reportedBy: req.user._id
    };

    // Add image URL if file was uploaded
    if (req.file) {
      issueData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const issue = await Issue.create(issueData);

    // Populate the created issue
    await issue.populate('reportedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating issue'
    });
  }
});

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (Admin only)
router.put('/:id/status', [
  protect,
  isAdmin,
  body('status')
    .isIn(['pending', 'in-progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters')
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

    const { status, comment } = req.body;

    const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Update status
    issue.status = status;
    if (status === 'resolved') {
      issue.resolvedAt = new Date();
    }
    await issue.save();

    // Add admin comment if provided
    if (comment) {
      await Comment.create({
        content: comment,
        issue: issue._id,
        author: req.user._id,
        isOfficial: true
      });
    }

    res.json({
      success: true,
      message: 'Issue status updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating issue status'
    });
  }
});

// @desc    Vote on issue
// @route   POST /api/issues/:id/vote
// @access  Private
router.post('/:id/vote', [
  protect,
  body('voteType')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be either up or down')
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

    const { voteType } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user has already voted
    const existingVote = issue.voters.find(voter => 
      voter.user.toString() === req.user._id.toString()
    );

    if (existingVote && existingVote.voteType === voteType) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted with this option'
      });
    }

    // Add or update vote
    await issue.addVote(req.user._id, voteType);

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        upvotes: issue.upvotes,
        downvotes: issue.downvotes,
        voteCount: issue.voteCount
      }
    });
  } catch (error) {
    console.error('Vote issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting on issue'
    });
  }
});

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private (Admin only)
router.delete('/:id', [protect, isAdmin], async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ issue: issue._id });

    // Delete issue
    await Issue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting issue'
    });
  }
});

module.exports = router;
