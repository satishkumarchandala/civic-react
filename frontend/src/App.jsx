import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import theme from './theme/theme'
import { AppProvider } from './context/AppContext'
import { 
  Layout, 
  HomePage, 
  LoginPage, 
  RegisterPage, 
  AdminPage, 
  ReportIssuePage, 
  IssueDetailPage, 
  ProtectedRoute,
  ErrorBoundary
} from './components'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/report" element={
                  <ProtectedRoute>
                    <ReportIssuePage />
                  </ProtectedRoute>
                } />
                <Route path="/issue/:id" element={<IssueDetailPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App