# Urban Issue Reporter - Frontend

A modern React + Vite frontend application for the Urban Issue Reporter system with full backend integration.

## 🚀 Features

- **Modern React Architecture** - Built with React 18 and Vite
- **Context API State Management** - Global state management without external libraries
- **Responsive Design** - Mobile-first responsive design
- **Backend Integration** - Full API integration with the Node.js backend
- **Email Notifications** - Real-time email status and testing
- **Authentication** - JWT-based authentication system
- **Admin Dashboard** - Complete admin interface
- **Real-time Updates** - Live data updates from backend

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Font Awesome** - Icon library
- **CSS3** - Custom styling with modern features
- **Fetch API** - HTTP client for backend communication

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles
│   └── services/
│       └── api.js           # API service layer
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🔌 Backend Integration

The frontend is fully integrated with the backend API:

### API Endpoints Used

- **Authentication**: `/api/auth/*`
- **Issues**: `/api/issues/*`
- **Comments**: `/api/comments/*`
- **Admin**: `/api/admin/*`
- **Email**: `/api/email/*`
- **Health Check**: `/api/health`

### API Service Layer

The `services/api.js` file provides a clean interface for all backend communication:

```javascript
// Example usage
import { authAPI, issuesAPI, emailAPI } from './services/api'

// Login user
const response = await authAPI.login({ email, password })

// Get issues
const issues = await issuesAPI.getIssues()

// Send test email
await emailAPI.sendTestEmail()
```

## 🎨 UI Components

### Main Components

- **App** - Main application wrapper with context provider
- **Header** - Navigation header with user authentication
- **HomePage** - Dashboard with issues list and backend status
- **LoginPage** - User authentication form
- **RegisterPage** - User registration form
- **AdminPage** - Admin dashboard with email service status
- **FlashMessages** - Toast notifications system

### Styling

- **CSS Grid & Flexbox** - Modern layout system
- **Responsive Design** - Mobile-first approach
- **Custom CSS Variables** - Consistent theming
- **Font Awesome Icons** - Professional iconography
- **Smooth Animations** - Enhanced user experience

## 🔐 Authentication

### User Flow

1. **Registration** - Users can create new accounts
2. **Login** - JWT-based authentication
3. **Session Management** - Automatic token handling
4. **Protected Routes** - Route protection based on auth status
5. **Admin Access** - Role-based access control

### State Management

```javascript
// Using the context
const { currentUser, login, logout, loading } = useApp()

// Login user
const success = await login(email, password)

// Check authentication
if (currentUser) {
  // User is logged in
}
```

## 📧 Email Integration

### Email Service Features

- **Status Check** - Real-time email service status
- **Test Emails** - Send test emails from admin panel
- **Notifications** - Automatic email notifications for:
  - Issue creation
  - Status updates
  - New comments

### Email API Usage

```javascript
// Check email status
const status = await emailAPI.getEmailStatus()

// Send test email
await emailAPI.sendTestEmail()

// Notify issue creation
await emailAPI.notifyIssueCreated(issueId, userId)
```

## 🎯 Key Features

### 1. Backend Connection Testing
- Real-time backend health check
- Connection status display
- Error handling and reporting

### 2. Issue Management
- View all issues with filtering
- Issue status tracking
- Voting system
- Category and priority badges

### 3. Admin Dashboard
- Email service monitoring
- Issue management
- User administration
- System statistics

### 4. Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design

## 🔧 Configuration

### Environment Variables

The frontend connects to the backend via the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Vite Configuration

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true
  }
})
```

## 🚨 Error Handling

### Global Error Management

- **API Error Handling** - Centralized error handling
- **User Feedback** - Toast notifications for errors
- **Loading States** - Visual feedback during operations
- **Fallback UI** - Graceful degradation

### Error Types

- **Network Errors** - Connection issues
- **Authentication Errors** - Invalid credentials
- **Validation Errors** - Form validation
- **Server Errors** - Backend issues

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Colors

- **Primary**: #667eea (Blue gradient)
- **Secondary**: #764ba2 (Purple gradient)
- **Success**: #48bb78 (Green)
- **Error**: #f56565 (Red)
- **Warning**: #ed8936 (Orange)

### Typography

- **Font Family**: System fonts (San Francisco, Segoe UI, etc.)
- **Font Sizes**: Responsive scale
- **Font Weights**: 400, 500, 600, 700

## 🚀 Performance

### Optimizations

- **Code Splitting** - Route-based splitting
- **Lazy Loading** - Component lazy loading
- **Bundle Optimization** - Vite optimizations
- **Caching** - API response caching

### Bundle Size

- **Development**: ~2MB
- **Production**: ~500KB (gzipped)

## 🧪 Testing

### Manual Testing

1. **Backend Connection** - Check health endpoint
2. **Authentication** - Test login/register
3. **Email Service** - Test email functionality
4. **Responsive Design** - Test on different devices

### Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend is running on port 5000
   - Verify CORS configuration
   - Check network connectivity

2. **Authentication Issues**
   - Clear localStorage
   - Check JWT token validity
   - Verify backend auth endpoints

3. **Email Service Not Working**
   - Check email configuration in backend
   - Verify Gmail app password
   - Test email service status

## 📈 Future Enhancements

- **Real-time Updates** - WebSocket integration
- **PWA Support** - Progressive Web App features
- **Offline Support** - Service worker implementation
- **Advanced Filtering** - Enhanced search and filters
- **Dark Mode** - Theme switching
- **Internationalization** - Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for better communities**