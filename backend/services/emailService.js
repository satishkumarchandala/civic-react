const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// Email configuration
const createTransporter = () => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Email configuration missing. Please set MAIL_USER and MAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
};

// Email templates
const emailTemplates = {
  welcome: (user) => ({
    subject: '🏙 Welcome to Urban Issue Reporter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <h2 style="text-align: center; margin-bottom: 30px;">🏙 Welcome to Urban Issue Reporter!</h2>
        <div style="background: white; color: #333; padding: 30px; border-radius: 8px;">
          <p><strong>Hi ${user.name},</strong></p>
          <p>Thank you for joining our community! You can now:</p>
          <ul style="line-height: 1.8;">
            <li>🚨 Report urban issues in your area</li>
            <li>📍 Use GPS to mark exact locations</li>
            <li>📷 Upload photos of problems</li>
            <li>💬 Engage with your community</li>
            <li>👍 Support important issues with upvotes</li>
          </ul>
          <p style="margin-top: 30px;"><strong>Together, we can make our city better! 🌟</strong></p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Reporting Issues</a>
          </div>
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 0.9rem;">Best regards,<br>Urban Issue Reporter Team</p>
      </div>
    `
  }),

  issueCreated: (issue, user) => ({
    subject: `Issue Reported: ${issue.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏙️ Urban Issue Reporter</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for reporting an issue!</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2d3748; margin-bottom: 20px;">Issue Successfully Reported</h2>
          <p style="color: #4a5568; line-height: 1.6;">Hello ${user.name},</p>
          <p style="color: #4a5568; line-height: 1.6;">Thank you for taking the time to report an issue in your community. Your report has been received and will be reviewed by our team.</p>
          
          <div style="background: #f7fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #2d3748; margin-top: 0;">Issue Details</h3>
            <p style="margin: 8px 0;"><strong>Title:</strong> ${issue.title}</p>
            <p style="margin: 8px 0;"><strong>Category:</strong> ${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}</p>
            <p style="margin: 8px 0;"><strong>Priority:</strong> ${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</p>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${issue.location?.address}</p>
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #e53e3e; font-weight: bold;">Pending Review</span></p>
          </div>
          
          <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #2d3748; margin-top: 0;">What happens next?</h4>
            <ul style="color: #4a5568; line-height: 1.6;">
              <li>Our team will review your report within 24 hours</li>
              <li>You'll receive updates on the status of your issue</li>
              <li>We'll notify you when the issue is resolved</li>
            </ul>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">Thank you for helping make our community better!</p>
        </div>
        
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
          <p style="margin: 0;">Urban Issue Reporter Team</p>
          <p style="margin: 5px 0 0 0;">Making communities better, one issue at a time</p>
        </div>
      </div>
    `
  }),

  issueStatusUpdated: (issue, user, newStatus) => ({
    subject: `Status Update: ${issue.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏙️ Urban Issue Reporter</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Issue Status Update</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2d3748; margin-bottom: 20px;">Status Update</h2>
          <p style="color: #4a5568; line-height: 1.6;">Hello ${user.name},</p>
          <p style="color: #4a5568; line-height: 1.6;">We have an update on the issue you reported:</p>
          
          <div style="background: #f7fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #2d3748; margin-top: 0;">${issue.title}</h3>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${issue.location?.address}</p>
            <p style="margin: 8px 0;"><strong>New Status:</strong> 
              <span style="color: ${getStatusColor(newStatus)}; font-weight: bold; text-transform: capitalize;">
                ${newStatus.replace('-', ' ')}
              </span>
            </p>
          </div>
          
          <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #2d3748; margin-top: 0;">Status Meanings:</h4>
            <ul style="color: #4a5568; line-height: 1.6;">
              <li><strong>Pending:</strong> Under review by our team</li>
              <li><strong>In Progress:</strong> Work has started on resolving this issue</li>
              <li><strong>Resolved:</strong> Issue has been fixed</li>
              <li><strong>Rejected:</strong> Issue doesn't meet our criteria or is outside our scope</li>
            </ul>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">Thank you for your patience and for helping improve our community!</p>
        </div>
        
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
          <p style="margin: 0;">Urban Issue Reporter Team</p>
          <p style="margin: 5px 0 0 0;">Making communities better, one issue at a time</p>
        </div>
      </div>
    `
  }),

  commentAdded: (issue, user, comment) => ({
    subject: `New Comment on Issue: ${issue.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏙️ Urban Issue Reporter</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Comment Added</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2d3748; margin-bottom: 20px;">New Comment</h2>
          <p style="color: #4a5568; line-height: 1.6;">Hello ${user.name},</p>
          <p style="color: #4a5568; line-height: 1.6;">Someone has added a comment to the issue you're following:</p>
          
          <div style="background: #f7fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #2d3748; margin-top: 0;">${issue.title}</h3>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${issue.location?.address}</p>
            <p style="margin: 8px 0;"><strong>Comment by:</strong> ${comment.author?.name || 'Anonymous'}</p>
            ${comment.isOfficial ? '<p style="margin: 8px 0;"><strong>Type:</strong> <span style="color: #38a169; font-weight: bold;">Official Response</span></p>' : ''}
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin-top: 0;">Comment:</h4>
            <p style="color: #4a5568; line-height: 1.6; margin: 0;">${comment.content}</p>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">You can view the full discussion and add your own comments on our website.</p>
        </div>
        
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
          <p style="margin: 0;">Urban Issue Reporter Team</p>
          <p style="margin: 5px 0 0 0;">Making communities better, one issue at a time</p>
        </div>
      </div>
    `
  })
};

// Helper function to get status color
const getStatusColor = (status) => {
  const colors = {
    'pending': '#e53e3e',
    'in-progress': '#d69e2e',
    'resolved': '#38a169',
    'rejected': '#718096'
  };
  return colors[status] || '#718096';
};

// Send notification email when issue is created
router.post('/notify-issue-created', async (req, res) => {
  try {
    const { issueId, userId } = req.body;
    
    if (!issueId || !userId) {
      return res.status(400).json({ 
        success: false,
        error: 'Issue ID and User ID are required' 
      });
    }

    const issue = await Issue.findById(issueId).populate('reportedBy');
    const user = await User.findById(userId);
    
    if (!issue || !user) {
      return res.status(404).json({ 
        success: false,
        error: 'Issue or User not found' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = emailTemplates.issueCreated(issue, user);

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('✅ Issue creation email sent successfully:', result.messageId);
    res.status(200).json({ 
      success: true,
      message: 'Issue creation notification sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error sending issue creation email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send issue creation notification' 
    });
  }
});

// Send notification email when issue status is updated
router.post('/notify-status-update', async (req, res) => {
  try {
    const { issueId, userId, newStatus } = req.body;
    
    if (!issueId || !userId || !newStatus) {
      return res.status(400).json({ 
        success: false,
        error: 'Issue ID, User ID, and new status are required' 
      });
    }

    const issue = await Issue.findById(issueId).populate('reportedBy');
    const user = await User.findById(userId);
    
    if (!issue || !user) {
      return res.status(404).json({ 
        success: false,
        error: 'Issue or User not found' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = emailTemplates.issueStatusUpdated(issue, user, newStatus);

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('✅ Status update email sent successfully:', result.messageId);
    res.status(200).json({ 
      success: true,
      message: 'Status update notification sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send status update notification' 
    });
  }
});

// Send notification email when comment is added
router.post('/notify-comment-added', async (req, res) => {
  try {
    const { issueId, commentId, userId } = req.body;
    
    if (!issueId || !commentId || !userId) {
      return res.status(400).json({ 
        success: false,
        error: 'Issue ID, Comment ID, and User ID are required' 
      });
    }

    const issue = await Issue.findById(issueId).populate('reportedBy');
    const comment = await Comment.findById(commentId).populate('author');
    const user = await User.findById(userId);
    
    if (!issue || !comment || !user) {
      return res.status(404).json({ 
        success: false,
        error: 'Issue, Comment, or User not found' 
      });
    }

    const transporter = createTransporter();
    const emailTemplate = emailTemplates.commentAdded(issue, user, comment);

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('✅ Comment email sent successfully:', result.messageId);
    res.status(200).json({ 
      success: true,
      message: 'Comment notification sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error sending comment email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send comment notification' 
    });
  }
});

// Send custom email to user
router.post('/send-custom-email', protect, async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'To, subject, and message are required' 
      });
    }

    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏙️ Urban Issue Reporter</h1>
          </div>
          <div style="padding: 30px;">
            <div style="background: #f7fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
              ${message}
            </div>
          </div>
          <div style="background: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p style="margin: 0;">Urban Issue Reporter Team</p>
            <p style="margin: 5px 0 0 0;">Making communities better, one issue at a time</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Custom email sent successfully:', result.messageId);
    res.status(200).json({ 
      success: true,
      message: 'Custom email sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error sending custom email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send custom email' 
    });
  }
});

// Welcome email endpoint
router.post('/welcome', async (req, res) => {
  try {
    const { userEmail, userName } = req.body;
    
    if (!userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'User email and name are required'
      });
    }

    const transporter = createTransporter();
    const emailTemplate = emailTemplates.welcome({ name: userName });

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('✅ Welcome email sent successfully to:', userEmail);
    res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send welcome email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Email service error'
    });
  }
});

// Test email endpoint
router.post('/test-email', protect, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: userEmail,
      subject: 'Test Email from Urban Issue Reporter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏙️ Urban Issue Reporter</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Email Service Test</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Test Email Successful!</h2>
            <p style="color: #4a5568; line-height: 1.6;">Hello ${req.user.name},</p>
            <p style="color: #4a5568; line-height: 1.6;">This is a test email to verify that the email service is working correctly.</p>
            <p style="color: #4a5568; line-height: 1.6;">If you received this email, your email configuration is working properly!</p>
            
            <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #2d3748; margin-top: 0;">Configuration Details:</h4>
              <ul style="color: #4a5568; line-height: 1.6;">
                <li><strong>Service:</strong> Gmail SMTP</li>
                <li><strong>Host:</strong> smtp.gmail.com</li>
                <li><strong>Port:</strong> 587</li>
                <li><strong>User:</strong> ${process.env.MAIL_USER}</li>
              </ul>
            </div>
          </div>
          <div style="background: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
            <p style="margin: 0;">Urban Issue Reporter Team</p>
            <p style="margin: 5px 0 0 0;">Making communities better, one issue at a time</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully:', result.messageId);
    res.status(200).json({ 
      success: true,
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send test email' 
    });
  }
});

// Get email configuration status
router.get('/status', (req, res) => {
  const isConfigured = !!(process.env.MAIL_USER && process.env.MAIL_PASS);
  
  res.status(200).json({
    success: true,
    configured: isConfigured,
    service: 'gmail',
    user: process.env.MAIL_USER ? 'configured' : 'not configured'
  });
});

module.exports = router;