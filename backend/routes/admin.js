const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(isAdmin);

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // Get issue statistics
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const rejectedIssues = await Issue.countDocuments({ status: 'rejected' });

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = totalUsers - adminUsers;

    // Get recent issues (last 10)
    const recentIssues = await Issue.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get issues by category
    const issuesByCategory = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get issues by priority
    const issuesByPriority = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get resolution rate
    const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

    // Get average response time (simplified - using creation to first comment)
    const avgResponseTime = await Issue.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'issue',
          as: 'comments'
        }
      },
      {
        $match: {
          'comments.0': { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: [
              { $arrayElemAt: ['$comments.createdAt', 0] },
              '$createdAt'
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const stats = {
      issues: {
        total: totalIssues,
        pending: pendingIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues,
        rejected: rejectedIssues,
        resolutionRate: Math.round(resolutionRate * 100) / 100
      },
      users: {
        total: totalUsers,
        admin: adminUsers,
        regular: regularUsers
      },
      categories: issuesByCategory,
      priorities: issuesByPriority,
      avgResponseTime: avgResponseTime.length > 0 ? avgResponseTime[0].avgResponseTime : 0,
      recentIssues
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin statistics'
    });
  }
});

// @desc    Get all issues for admin management
// @route   GET /api/admin/issues
// @access  Private (Admin only)
router.get('/issues', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.error('Get admin issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin issues'
    });
  }
});

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin users'
    });
  }
});

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value')
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

    const { isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// @desc    Assign issue to admin
// @route   PUT /api/admin/issues/:id/assign
// @access  Private (Admin only)
router.put('/issues/:id/assign', [
  body('assignedTo')
    .isMongoId()
    .withMessage('Valid user ID is required for assignment')
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

    const { assignedTo } = req.body;

    // Check if assigned user exists and is admin
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !assignedUser.isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be an admin'
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email')
     .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue assigned successfully',
      data: issue
    });
  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning issue'
    });
  }
});

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Issues created over time
    const issuesOverTime = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Issues resolved over time
    const resolvedOverTime = await Issue.aggregate([
      {
        $match: {
          status: 'resolved',
          resolvedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$resolvedAt' },
            month: { $month: '$resolvedAt' },
            day: { $dayOfMonth: '$resolvedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Top reporters
    const topReporters = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$reportedBy',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          issueCount: '$count'
        }
      },
      {
        $sort: { issueCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        issuesOverTime,
        resolvedOverTime,
        topReporters,
        period: parseInt(period)
      }
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin analytics'
    });
  }
});

module.exports = router;
