import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline as ErrorIcon } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            p: 4,
          }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 600,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
            }}
          >
            <ErrorIcon 
              sx={{ 
                fontSize: '4rem', 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            
            <Typography variant="h5" gutterBottom color="error">
              Something went wrong
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ mr: 2 }}
            >
              Refresh Page
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </Button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Error Details (Development):
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', overflow: 'auto' }}>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary