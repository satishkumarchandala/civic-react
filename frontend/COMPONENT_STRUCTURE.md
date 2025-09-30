# Frontend Component Structure

This document outlines the organized component structure of the Urban Issue Reporter frontend application.

## 📁 Directory Structure

```
frontend/src/
├── components/
│   ├── layout/                 # Layout components
│   │   ├── Header.jsx         # Navigation header
│   │   └── Layout.jsx         # Main layout wrapper
│   ├── pages/                 # Page components
│   │   ├── HomePage.jsx       # Home dashboard
│   │   ├── LoginPage.jsx      # User login
│   │   ├── RegisterPage.jsx   # User registration
│   │   ├── AdminPage.jsx      # Admin dashboard
│   │   ├── ReportIssuePage.jsx # Report new issue
│   │   └── IssueDetailPage.jsx # Issue details
│   ├── common/                # Reusable components
│   │   ├── FlashMessages.jsx  # Toast notifications
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── LoadingSpinner.jsx # Loading indicator
│   └── index.js               # Component exports
├── context/
│   └── AppContext.jsx         # Global state management
├── services/
│   └── api.js                 # API service layer
├── App.jsx                    # Main application
├── App.css                    # Application styles
├── index.css                  # Global styles
└── main.jsx                   # Application entry point
```

## 🧩 Component Architecture

### 1. Context Layer (`context/`)

#### AppContext.jsx
- **Purpose**: Global state management using React Context
- **Features**:
  - User authentication state
  - Issues and comments data
  - Flash messages system
  - Loading states
  - API integration functions
- **Exports**: `AppProvider`, `useApp` hook

### 2. Layout Components (`components/layout/`)

#### Header.jsx
- **Purpose**: Navigation header with authentication
- **Features**:
  - Logo and navigation links
  - User authentication buttons
  - Admin-specific navigation
  - Responsive design
- **Dependencies**: `useApp`, `useNavigate`, `useLocation`

#### Layout.jsx
- **Purpose**: Main layout wrapper
- **Features**:
  - Wraps all page content
  - Includes header and flash messages
  - Provides consistent layout structure
- **Dependencies**: `Header`, `FlashMessages`

### 3. Page Components (`components/pages/`)

#### HomePage.jsx
- **Purpose**: Main dashboard showing issues and backend status
- **Features**:
  - Backend connection testing
  - Issues list display
  - User welcome message
  - Real-time data loading
- **Dependencies**: `useApp`

#### LoginPage.jsx
- **Purpose**: User authentication form
- **Features**:
  - Email/password form
  - Form validation
  - Loading states
  - Navigation to register
- **Dependencies**: `useApp`, `useNavigate`

#### RegisterPage.jsx
- **Purpose**: User registration form
- **Features**:
  - Registration form with validation
  - Password confirmation
  - Loading states
  - Navigation to login
- **Dependencies**: `useApp`, `useNavigate`

#### AdminPage.jsx
- **Purpose**: Admin dashboard with system monitoring
- **Features**:
  - Email service status
  - Test email functionality
  - Issues management
  - System statistics
- **Dependencies**: `useApp`, `emailAPI`

#### ReportIssuePage.jsx
- **Purpose**: Form for reporting new issues
- **Status**: Placeholder component
- **Features to implement**:
  - Issue form with validation
  - Location picker
  - Photo upload
  - Category and priority selection

#### IssueDetailPage.jsx
- **Purpose**: Detailed view of individual issues
- **Status**: Placeholder component
- **Features to implement**:
  - Issue details display
  - Comments section
  - Voting functionality
  - Status updates

### 4. Common Components (`components/common/`)

#### FlashMessages.jsx
- **Purpose**: Toast notification system
- **Features**:
  - Success, error, and info messages
  - Auto-dismiss functionality
  - Icon integration
- **Dependencies**: `useApp`

#### ProtectedRoute.jsx
- **Purpose**: Route protection based on authentication
- **Features**:
  - Authentication requirement
  - Admin role requirement
  - Automatic redirects
- **Dependencies**: `useApp`

#### LoadingSpinner.jsx
- **Purpose**: Reusable loading indicator
- **Features**:
  - Customizable message
  - Consistent styling
  - Easy integration

### 5. Service Layer (`services/`)

#### api.js
- **Purpose**: Backend API communication
- **Features**:
  - HTTP client with error handling
  - Authentication token management
  - Organized API endpoints
  - Request/response interceptors

## 🔄 Data Flow

### 1. State Management
```
AppContext (Global State)
├── User Authentication
├── Issues Data
├── Comments Data
├── Flash Messages
└── Loading States
```

### 2. Component Communication
```
App.jsx
├── Layout
│   ├── Header (uses useApp)
│   └── FlashMessages (uses useApp)
└── Pages (use useApp for data)
```

### 3. API Integration
```
Components → useApp → API Service → Backend
```

## 🎯 Benefits of This Structure

### 1. **Modularity**
- Each component has a single responsibility
- Easy to locate and modify specific features
- Reusable components across the application

### 2. **Maintainability**
- Clear separation of concerns
- Easy to add new features
- Simplified debugging and testing

### 3. **Scalability**
- Easy to add new pages and components
- Consistent patterns for new features
- Organized codebase for team development

### 4. **Performance**
- Smaller bundle sizes through code splitting
- Optimized re-rendering
- Lazy loading capabilities

## 🚀 Usage Examples

### Using the Context
```javascript
import { useApp } from '../context/AppContext'

function MyComponent() {
  const { currentUser, loading, showMessage } = useApp()
  
  // Component logic
}
```

### Using Components
```javascript
import { HomePage, LoginPage, ProtectedRoute } from '../components'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### Adding New Components
1. Create component file in appropriate directory
2. Add export to `components/index.js`
3. Import and use in parent component

## 🔧 Development Guidelines

### 1. **Component Creation**
- Use functional components with hooks
- Follow naming conventions (PascalCase)
- Include proper prop types
- Add JSDoc comments for complex components

### 2. **State Management**
- Use context for global state
- Use local state for component-specific data
- Avoid prop drilling
- Keep state as close to usage as possible

### 3. **Styling**
- Use CSS classes from `index.css`
- Follow existing design patterns
- Ensure responsive design
- Maintain consistency across components

### 4. **API Integration**
- Use the centralized API service
- Handle loading and error states
- Provide user feedback
- Implement proper error handling

## 📈 Future Enhancements

### 1. **Component Library**
- Create a design system
- Build reusable UI components
- Implement theme switching
- Add animation components

### 2. **Performance Optimization**
- Implement React.memo for expensive components
- Add lazy loading for pages
- Optimize bundle splitting
- Add service worker for caching

### 3. **Testing**
- Add unit tests for components
- Implement integration tests
- Add E2E testing
- Set up testing utilities

### 4. **Accessibility**
- Add ARIA labels
- Implement keyboard navigation
- Ensure screen reader compatibility
- Add focus management

---

This component structure provides a solid foundation for a scalable, maintainable React application with clear separation of concerns and organized code architecture.
