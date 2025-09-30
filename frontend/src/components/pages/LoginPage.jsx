import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  Container,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { 
  Login as LoginIcon, 
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'
import { LoadingSpinner } from '../common/LoadingSpinner'

export function LoginPage() {
  const { login, loading } = useApp()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(formData.email, formData.password)
    if (success) {
      navigate('/')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Logging in..." />
  }

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh',
          py: 4,
        }}
      >
        <Fade in={true} timeout={800}>
          <Card 
            sx={{ 
              width: '100%', 
              maxWidth: 450, 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }} 
            elevation={0}
          >
            <CardContent sx={{ p: 4 }}>
              <Grow in={true} timeout={1000}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LoginIcon sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sign in to continue to your account
                    </Typography>
                  </Box>
                </Box>
              </Grow>
              
              <Fade in={true} timeout={1200}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                        }
                      }
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                        }
                      }
                    }}
                  />
                
                  <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                startIcon={<LoginIcon />}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/register')
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Register here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  </Container>
  )
}
