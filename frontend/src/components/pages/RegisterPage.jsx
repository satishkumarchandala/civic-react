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
  Container,
  Alert
} from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { useApp } from '../../context/AppContext'
import { LoadingSpinner } from '../common/LoadingSpinner'

export function RegisterPage() {
  const { register, loading, showFlash } = useApp()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }
    
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    if (success) {
      navigate('/')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Creating your account..." />
  }

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh' 
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: 2 }} elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
              <PersonAddIcon sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
              <Typography variant="h4" component="h1" color="primary.main" fontWeight="bold">
                Register
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText="Password must be at least 6 characters long"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={!!passwordError}
                helperText={passwordError}
              />
              
              {passwordError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {passwordError}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                startIcon={<PersonAddIcon />}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/login')
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
