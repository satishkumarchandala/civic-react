# Urban Issue Reporter - Backend API

A comprehensive Node.js/Express backend API for the Urban Issue Reporter application with full email notification support.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role management
- **Issue Management** - Create, read, update, delete issues with full CRUD operations
- **Comment System** - Nested comments with like/unlike functionality
- **Admin Dashboard** - Complete admin panel with analytics and management tools
- **Email Notifications** - Beautiful HTML email templates for all user interactions
- **File Upload Support** - Image uploads for issues
- **Rate Limiting** - Built-in protection against abuse
- **Security** - Helmet.js security headers and CORS protection

## 📧 Email System

The backend includes a comprehensive email notification system:

### Email Templates
- **Issue Creation** - Welcome email when users report issues
- **Status Updates** - Notifications when issue status changes
- **Comment Notifications** - Alerts when new comments are added
- **Test Emails** - Admin can test email configuration
- **Custom Emails** - Admin can send custom messages

### Email Configuration
```env
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp config.env.example config.env
   # Edit config.env with your settings
   ```

3. **Database Setup**
   - MongoDB must be running
   - Update `MONGODB_URI` in config.env

4. **Email Setup**
   - Enable 2FA on Gmail
   - Generate App Password
   - Set `MAIL_USER` and `MAIL_PASS`

5. **Start Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   ├── User.js              # User model
│   ├── Issue.js             # Issue model
│   └── Comment.js           # Comment model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── issues.js            # Issue management
│   ├── comments.js          # Comment system
│   └── admin.js             # Admin dashboard
├── services/
│   └── emailService.js      # Email notification system
├── server.js                # Main server file
├── test-email.js           # Email testing utility
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Issues
- `GET /api/issues` - Get all issues (with filtering)
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id/status` - Update issue status (Admin)
- `POST /api/issues/:id/vote` - Vote on issue
- `DELETE /api/issues/:id` - Delete issue (Admin)

### Comments
- `GET /api/comments/issue/:issueId` - Get comments for issue
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like/unlike comment

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/issues` - Get all issues for admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/issues/:id/assign` - Assign issue
- `GET /api/admin/analytics` - Get analytics data

### Email Service
- `POST /api/email/notify-issue-created` - Notify issue creation
- `POST /api/email/notify-status-update` - Notify status update
- `POST /api/email/notify-comment-added` - Notify comment added
- `POST /api/email/send-custom-email` - Send custom email
- `POST /api/email/test-email` - Send test email
- `GET /api/email/status` - Get email service status

## 🧪 Testing

### Test Email Service
```bash
npm run test-email
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Email status
curl http://localhost:5000/api/email/status
```

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/urban_issue_reporter

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📊 Database Models

### User Model
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `isAdmin` - Admin privileges
- `isActive` - Account status

### Issue Model
- `title` - Issue title
- `description` - Detailed description
- `category` - Issue category
- `priority` - Priority level
- `status` - Current status
- `location` - Address and coordinates
- `reportedBy` - User who reported
- `upvotes/downvotes` - Community voting

### Comment Model
- `content` - Comment text
- `issue` - Related issue
- `author` - Comment author
- `isOfficial` - Admin comment flag
- `parentComment` - For replies
- `likes` - Like count

## 🚨 Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- Database errors
- Email service errors
- Rate limiting errors

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation
- SQL injection protection

## 📈 Performance

- Database indexing
- Pagination support
- Query optimization
- Rate limiting
- Error logging

## 🐛 Troubleshooting

### Common Issues

1. **Email not working**
   - Check Gmail app password
   - Verify 2FA is enabled
   - Test with `npm run test-email`

2. **Database connection**
   - Ensure MongoDB is running
   - Check connection string
   - Verify network access

3. **Authentication errors**
   - Check JWT secret
   - Verify token format
   - Check token expiration

## 📝 Logs

The server provides detailed logging:
- Request/response logs
- Error logs
- Email service logs
- Database operation logs

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure production database
- [ ] Set up email service
- [ ] Configure CORS for production domain
- [ ] Set up monitoring
- [ ] Configure backup strategy

## 📞 Support

For issues or questions:
1. Check the logs
2. Verify configuration
3. Test individual components
4. Check database connectivity
5. Verify email configuration

---

**Built with ❤️ for better communities**
