import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Skeleton
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  ReportProblem as ReportIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'
import { adminAPI } from '../../services/api'
import { LoadingSpinner } from '../common/LoadingSpinner'
import IssuesMapDisplay from '../common/IssuesMapDisplay'

export function AdminPage() {
  const navigate = useNavigate()
  const { currentUser, issues, loading, updateIssueStatus, categories, statuses, authLoading } = useApp()
  const [adminStats, setAdminStats] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminIssues, setAdminIssues] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [currentView, setCurrentView] = useState(0) // 0: dashboard, 1: map, 2: issues

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoadingStats(true)
        
        // Load admin statistics - fallback to issues if API doesn't exist
        try {
          const statsResponse = await adminAPI.getStats()
          if (statsResponse.success) {
            setAdminStats(statsResponse.data)
          }
        } catch (error) {
          console.error('Failed to load stats:', error)
          // Create mock stats from issues
          const mockStats = {
            totalIssues: issues.length,
            totalUsers: 0,
            pendingIssues: issues.filter(i => i.status === 'pending' || i.status === 'open').length,
            resolvedIssues: issues.filter(i => i.status === 'resolved').length,
            inProgressIssues: issues.filter(i => i.status === 'in-progress').length
          }
          setAdminStats(mockStats)
        }
        
        // Use existing issues from context
        setAdminIssues(issues)
        
      } catch (error) {
        console.error('Failed to load admin data:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (currentUser?.isAdmin) {
      loadAdminData()
    }
  }, [currentUser, issues])

  // Redirect if not admin (but wait for auth to load)
  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      navigate('/login')
    }
  }, [currentUser, authLoading, navigate])

  const handleIssueSelect = (issue) => {
    navigate(`/issue/${issue._id}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
      case 'pending': return 'error'
      case 'in-progress': return 'warning'
      case 'resolved': return 'success'
      case 'closed': return 'default'
      default: return 'default'
    }
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { icon: '📋', name: categoryId }
  }

  const getStatusInfo = (statusId) => {
    return statuses.find(s => s.id === statusId) || { icon: '❓', name: statusId }
  }

  const handleTabChange = (event, newValue) => {
    setCurrentView(newValue)
  }

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssueStatus(issueId, newStatus)
      // Refresh the admin issues
      setAdminIssues(prev => prev.map(issue => 
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ))
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading || loadingStats || authLoading) {
    return <LoadingSpinner message="Loading admin dashboard..." />
  }

  if (!currentUser?.isAdmin) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 6, textAlign: 'center', mt: 8 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1">
              You need admin privileges to access this page.
            </Typography>
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Paper>
      </Container>
    )
  }

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Issues',
      value: adminStats?.totalIssues || adminIssues.length,
      icon: <ReportIcon sx={{ fontSize: '2rem' }} />,
      color: 'primary',
      bgColor: 'primary.light'
    },
    {
      title: 'Total Users',
      value: adminStats?.totalUsers || 'N/A',
      icon: <PeopleIcon sx={{ fontSize: '2rem' }} />,
      color: 'info',
      bgColor: 'info.light'
    },
    {
      title: 'Pending Issues',
      value: adminStats?.pendingIssues || adminIssues.filter(i => i.status === 'pending' || i.status === 'open').length,
      icon: <ScheduleIcon sx={{ fontSize: '2rem' }} />,
      color: 'warning',
      bgColor: 'warning.light'
    },
    {
      title: 'Resolved Issues',
      value: adminStats?.resolvedIssues || adminIssues.filter(i => i.status === 'resolved').length,
      icon: <CheckCircleIcon sx={{ fontSize: '2rem' }} />,
      color: 'success',
      bgColor: 'success.light'
    }
  ]

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Manage and monitor all urban issues reported in the system
        </Typography>
      </Paper>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={currentView} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard" 
            iconPosition="start"
          />
          <Tab 
            icon={<MapIcon />} 
            label="Issues Map" 
            iconPosition="start"
          />
          <Tab 
            icon={<AssignmentIcon />} 
            label="All Issues" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Dashboard View */}
      {currentView === 0 && (
        <Box>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card 
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${card.bgColor} 0%, rgba(255,255,255,0.8) 100%)`,
                    transition: 'all 0.3s ease-in-out',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box sx={{ color: `${card.color}.main`, mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color={`${card.color}.main`} sx={{ mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight="500">
                    {card.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Issues Preview */}
          <Card elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2" fontWeight="600">
                Recent Issues
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<MapIcon />}
                  onClick={() => setCurrentView(1)}
                >
                  View on Map
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AssignmentIcon />}
                  onClick={() => setCurrentView(2)}
                >
                  View All Issues
                </Button>
              </Box>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Total Issues: <strong>{adminIssues.length}</strong>
            </Typography>

            <Grid container spacing={3}>
              {adminIssues.slice(0, 3).map(issue => {
                const categoryInfo = getCategoryInfo(issue.category)
                const statusInfo = getStatusInfo(issue.status)

                return (
                  <Grid item xs={12} md={4} key={issue._id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip 
                            label={`${categoryInfo.icon} ${categoryInfo.name}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip 
                            label={`${statusInfo.icon} ${issue.status}`}
                            size="small"
                            color={getStatusColor(issue.status)}
                          />
                        </Box>

                        <Typography variant="h6" component="h3" gutterBottom noWrap>
                          {issue.title}
                        </Typography>

                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2
                          }}
                        >
                          {issue.description}
                        </Typography>

                        <List dense>
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Location" 
                              secondary={issue.location?.address}
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Reported by" 
                              secondary={issue.reportedBy?.name}
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText 
                              primary="Date" 
                              secondary={new Date(issue.createdAt).toLocaleDateString()}
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>

                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleIssueSelect(issue)}
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Card>
        </Box>
      )}

      {/* Issues Map View */}
      {currentView === 1 && (
        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
            Issues Location Map
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Interactive map showing all reported issues with their current status and priority levels. 
            Click on markers to view issue details.
          </Typography>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <IssuesMapDisplay 
              issues={adminIssues}
              height="600px"
              onIssueSelect={handleIssueSelect}
              showFilters={true}
            />
          </Paper>
        </Card>
      )}

      {/* All Issues View */}
      {currentView === 2 && (
        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
            All Issues Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Total Issues: <strong>{adminIssues.length}</strong>
          </Typography>

          <Grid container spacing={3}>
            {adminIssues.map(issue => {
              const categoryInfo = getCategoryInfo(issue.category)
              const statusInfo = getStatusInfo(issue.status)

              return (
                <Grid item xs={12} sm={6} lg={4} key={issue._id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={`${categoryInfo.icon} ${categoryInfo.name}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          label={`${statusInfo.icon} ${issue.status}`}
                          size="small"
                          color={getStatusColor(issue.status)}
                        />
                      </Box>

                      <Typography variant="h6" component="h3" gutterBottom sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {issue.title}
                      </Typography>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          flexGrow: 1
                        }}
                      >
                        {issue.description}
                      </Typography>

                      <Box sx={{ mt: 'auto' }}>
                        <List dense sx={{ mb: 1 }}>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary="Location" 
                              secondary={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {issue.location?.address}
                                </Typography>
                              }
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                            />
                          </ListItem>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary="Reported by" 
                              secondary={issue.reportedBy?.name}
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary="Date" 
                              secondary={new Date(issue.createdAt).toLocaleDateString()}
                              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>

                        <Divider sx={{ my: 2 }} />

                        {/* Status Update */}
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Update Status</InputLabel>
                          <Select
                            value={issue.status}
                            label="Update Status"
                            onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                            renderValue={(value) => {
                              const statusInfo = getStatusInfo(value)
                              return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{statusInfo.icon}</span>
                                  <span>{statusInfo.name}</span>
                                </Box>
                              )
                            }}
                          >
                            {statuses.map(status => (
                              <MenuItem key={status.id} value={status.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{status.icon}</span>
                                  <span>{status.name}</span>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleIssueSelect(issue)}
                          sx={{ mt: 1 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Card>
      )}
    </Container>
  )
}