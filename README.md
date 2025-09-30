# Urban Issue Reporter - MERN Stack

A full-stack web application for reporting and tracking urban issues in your community. Built with React, Node.js, Express, and MongoDB.

## Features

- 🚨 **Issue Reporting**: Report urban issues with photos, location, and detailed descriptions
- 📍 **Location Services**: GPS-based location marking for precise issue reporting
- 💬 **Community Engagement**: Comment on issues and engage with your community
- 👍 **Voting System**: Upvote/downvote issues to show community support
- 👨‍💼 **Admin Dashboard**: Comprehensive admin panel for issue management
- 📧 **Email Notifications**: Automated email notifications for status updates
- 🔐 **Authentication**: Secure user registration and login system
- 📱 **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email notifications
- Multer for file uploads

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd urban-issue-reporter-vite-react
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Environment Setup

Create a `.env` file in the backend directory:

```bash
cd ../backend
cp config.env .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/urban_issue_reporter
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/urban_issue_reporter

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=16777216

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 5. Create Uploads Directory

```bash
mkdir uploads
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Admin Account

After starting the application, you can log in with the default admin account:

- **Email**: admin@example.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
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
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/issues` - Get all issues for admin
- `GET /api/admin/users` - Get all users for admin
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/issues/:id/assign` - Assign issue
- `GET /api/admin/analytics` - Get analytics data

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  title: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  imageUrl: String,
  reportedBy: ObjectId (ref: User),
  upvotes: Number,
  downvotes: Number,
  voters: [ObjectId],
  assignedTo: ObjectId (ref: User),
  resolvedAt: Date,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,
  issue: ObjectId (ref: Issue),
  author: ObjectId (ref: User),
  isOfficial: Boolean,
  parentComment: ObjectId (ref: Comment),
  likes: Number,
  likedBy: [ObjectId],
  isEdited: Boolean,
  editedAt: Date,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Features in Detail

### Issue Reporting
- Users can report issues with detailed descriptions
- Upload photos to support their reports
- Mark exact locations using GPS coordinates
- Categorize issues (traffic, sanitation, infrastructure, etc.)
- Set priority levels (low, medium, high)

### Community Features
- Vote on issues to show support
- Comment on issues to provide additional information
- View issue history and status updates
- Filter and search issues

### Admin Features
- Comprehensive dashboard with statistics
- Manage issue statuses and assignments
- User management and moderation
- Analytics and reporting
- Email notifications for status updates

### Email Notifications
- Welcome emails for new users
- Issue confirmation emails
- Status update notifications
- Comment notifications

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release
- Complete MERN stack implementation
- User authentication and authorization
- Issue reporting and management
- Admin dashboard
- Email notifications
- Responsive design
