import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  Home as HomeIcon,
  Add as AddIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  LocationCity as LocationCityIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'

export function Header() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setAnchorEl(null)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isActive = (path) => location.pathname === path

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '70px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
            onClick={() => navigate('/')}
          >
            <LocationCityIcon sx={{ mr: 2, fontSize: '2rem', color: 'white' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              Urban Issue Reporter
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Home
            </Button>

            {currentUser && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => navigate('/report')}
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Report
              </Button>
            )}

            {currentUser?.isAdmin && (
              <Button
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/admin')}
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Admin
              </Button>
            )}

            {currentUser ? (
              <>
                <Typography sx={{ color: 'white', mr: 1 }}>
                  {currentUser.name}
                </Typography>
                <Tooltip title="Account menu">
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/login')}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Login
                </Button>
                <Button
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/register')}
                  variant="contained"
                  color="secondary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
