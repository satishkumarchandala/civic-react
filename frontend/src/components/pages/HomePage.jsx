import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Paper,
  IconButton,
  Skeleton,
  Grow,
  Fade,
  Zoom,
} from '@mui/material'
import {
  LocationOn as LocationOnIcon,
  ReportProblem as ReportIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'

export function HomePage() {
  const navigate = useNavigate()
  const { currentUser, issues, loading, categories, statuses, priorities } = useApp()

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { icon: '', name: categoryId }
  }

  const getStatusInfo = (statusId) => {
    return statuses.find(s => s.id === statusId) || { icon: '', name: statusId }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error'
      case 'in-progress': return 'warning'
      case 'resolved': return 'success'
      case 'closed': return 'default'
      default: return 'default'
    }
  }

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={0} 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Zoom in={true} timeout={1200}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                 Urban Issue Reporter
              </Typography>
            </Zoom>
            
            <Grow in={true} timeout={1500}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.95,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 300,
                }}
              >
                Empowering communities to create positive change
              </Typography>
            </Grow>

            {currentUser ? (
              <Fade in={true} timeout={2000}>
                <Box 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'inline-block',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Welcome back, {currentUser.name}! 
                  </Typography>
                  {currentUser.isAdmin && (
                    <Chip 
                      label=" Admin Privileges Active" 
                      sx={{
                        background: 'linear-gradient(135deg, #06d6a0 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained"
                      startIcon={<ReportIcon />}
                      onClick={() => navigate('/report')}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: 'primary.main',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Report New Issue
                    </Button>
                  </Box>
                </Box>
              </Fade>
            ) : (
              <Fade in={true} timeout={2000}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                    Join our community and make your voice heard
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: 'primary.main',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Fade>

      {/* Stats Section */}
      <Fade in={true} timeout={1500}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <AssignmentIcon />, title: 'Total Issues', value: issues?.length || 0, color: '#667eea' },
            { icon: <TrendingIcon />, title: 'Resolved', value: issues?.filter(i => i.status === 'resolved')?.length || 0, color: '#06d6a0' },
            { icon: <ViewIcon />, title: 'Active', value: issues?.filter(i => i.status === 'open')?.length || 0, color: '#f59e0b' },
            { icon: <PersonIcon />, title: 'Contributors', value: '150+', color: '#764ba2' },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in={true} timeout={1000 + index * 200}>
                <Card 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box 
                    sx={{ 
                      color: stat.color, 
                      mb: 2,
                      '& svg': { fontSize: '2.5rem' }
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="700" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {stat.title}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* Issues Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Fade in={true} timeout={1800}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Recent Issues
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Latest reports from our community
              </Typography>
            </Box>
            {currentUser && (
              <Button
                variant="contained"
                startIcon={<ReportIcon />}
                onClick={() => navigate('/report')}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Report Issue
              </Button>
            )}
          </Box>
        </Fade>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Grow in={true} timeout={500 + item * 100}>
                  <Card sx={{ borderRadius: 3 }}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <CardContent>
                      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        ) : issues && issues.length > 0 ? (
          <Grid container spacing={3}>
            {issues.slice(0, 6).map((issue, index) => {
              const categoryInfo = getCategoryInfo(issue.category)
              const statusInfo = getStatusInfo(issue.status)
              
              return (
                <Grid item xs={12} sm={6} md={4} key={issue._id}>
                  <Grow in={true} timeout={800 + index * 150}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onClick={() => navigate(/issue/)}
                    >
                      {issue.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://localhost:5000${issue.imageUrl}`}
                          alt="Issue"
                          sx={{ 
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            label={`${categoryInfo.icon} ${issue.category}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                            }}
                          />
                          <Chip 
                            label={`${statusInfo.icon} ${issue.status}`}
                            color={getStatusColor(issue.status)}
                            size="small"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                          />
                          <Chip 
                            label={issue.priority}
                            color={getPriorityColor(issue.priority)}
                            size="small"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                          />
                        </Box>

                        <Typography 
                          variant="h6" 
                          component="h3" 
                          gutterBottom 
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          {issue.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 3,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                          }}
                        >
                          {issue.description}
                        </Typography>

                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          pt: 2,
                          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight="500">
                              {issue.location?.address || issue.location || 'Location not specified'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" sx={{ color: 'success.main' }}>
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" color="text.secondary">
                              {issue.upvotes || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <Fade in={true} timeout={1000}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 3,
                border: '2px dashed rgba(102, 126, 234, 0.2)',
              }}
            >
              <Box sx={{ mb: 3, fontSize: '4rem' }}></Box>
              <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
                No issues reported yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to report an issue in your community
              </Typography>
              {currentUser && (
                <Button
                  variant="contained"
                  startIcon={<ReportIcon />}
                  onClick={() => navigate('/report')}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Report First Issue
                </Button>
              )}
            </Box>
          </Fade>
        )}
      </Paper>
    </Container>
  )
}
