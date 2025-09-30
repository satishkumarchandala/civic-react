import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  ReportProblem as ReportIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'
import InteractiveMap from '../common/InteractiveMap'
import { LoadingSpinner } from '../common/LoadingSpinner'

export function ReportIssuePage() {
  const navigate = useNavigate()
  const { currentUser, addIssue, categories, priorities, showMessage, authLoading } = useApp()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    location: {
      address: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    }
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect if not logged in (but wait for auth to load)
  useEffect(() => {
    if (!authLoading && !currentUser) {
      showMessage('Please login to report issues', 'error')
      navigate('/login')
    }
  }, [currentUser, authLoading, navigate, showMessage])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'address') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }))
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            ...prev.location.coordinates,
            [name]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        showMessage('Please select a valid image file (JPEG, PNG, GIF)', 'error')
        return
      }

      // Validate file size (16MB)
      if (file.size > 16 * 1024 * 1024) {
        showMessage('Image size should be less than 16MB', 'error')
        return
      }

      setImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle map location selection
  const handleMapLocationSelect = (latitude, longitude, address = '') => {
    setFormData(prev => ({
      ...prev,
      location: {
        address: address || `${latitude}, ${longitude}`,
        coordinates: {
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }
      }
    }))
    
    if (address) {
      showMessage('📍 Location and address updated successfully!', 'success')
    } else {
      showMessage('📍 Location coordinates updated!', 'success')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation to match backend requirements
    if (!formData.title.trim()) {
      showMessage('Title is required', 'error')
      return
    }
    if (formData.title.trim().length < 5) {
      showMessage('Title must be at least 5 characters long', 'error')
      return
    }
    if (formData.title.trim().length > 200) {
      showMessage('Title must be less than 200 characters', 'error')
      return
    }
    if (!formData.description.trim()) {
      showMessage('Description is required', 'error')
      return
    }
    if (formData.description.trim().length < 20) {
      showMessage('Description must be at least 20 characters long', 'error')
      return
    }
    if (formData.description.trim().length > 2000) {
      showMessage('Description must be less than 2000 characters', 'error')
      return
    }
    if (!formData.location.address.trim()) {
      showMessage('Address is required', 'error')
      return
    }
    if (!formData.location.coordinates.latitude || !formData.location.coordinates.longitude) {
      showMessage('GPS coordinates are required. Please click on the map to select a location.', 'error')
      return
    }

    const lat = parseFloat(formData.location.coordinates.latitude)
    const lng = parseFloat(formData.location.coordinates.longitude)
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      showMessage('Invalid latitude coordinate', 'error')
      return
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      showMessage('Invalid longitude coordinate', 'error')
      return
    }

    try {
      setLoading(true)

      if (image) {
        // If image is present, use FormData but structure it correctly for multer
        const submitData = new FormData()
        submitData.append('title', formData.title.trim())
        submitData.append('description', formData.description.trim())
        submitData.append('category', formData.category)
        submitData.append('priority', formData.priority)
        submitData.append('location[address]', formData.location.address.trim())
        submitData.append('location[coordinates][latitude]', lat)
        submitData.append('location[coordinates][longitude]', lng)
        submitData.append('image', image)

        // Send FormData with image
        const response = await fetch('http://localhost:5000/api/issues', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: submitData
        })

        const data = await response.json()
        
        if (data.success) {
          showMessage('Issue reported successfully!', 'success')
          navigate('/')
        } else {
          showMessage(data.message || 'Failed to report issue', 'error')
          if (data.errors) {
            console.error('Validation errors:', data.errors)
            // Show specific validation errors
            data.errors.forEach(error => {
              showMessage(error.msg, 'error')
            })
          }
        }
      } else {
        // If no image, send JSON data with proper nested structure
        const submitData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
          location: {
            address: formData.location.address.trim(),
            coordinates: {
              latitude: lat,
              longitude: lng
            }
          }
        }

        console.log('Submitting data:', submitData) // Debug log

        // Send JSON data without image
        const response = await fetch('http://localhost:5000/api/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(submitData)
        })

        const data = await response.json()
        console.log('Server response:', data) // Debug log
        
        if (data.success) {
          showMessage('Issue reported successfully!', 'success')
          navigate('/')
        } else {
          showMessage(data.message || 'Failed to report issue', 'error')
          if (data.errors) {
            console.error('Validation errors:', data.errors)
            // Show specific validation errors
            data.errors.forEach(error => {
              showMessage(error.msg, 'error')
            })
          }
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      showMessage('An error occurred while submitting. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <ReportIcon sx={{ fontSize: '3rem', color: 'error.main', mr: 1 }} />
            <Typography variant="h3" component="h1" color="primary.main" fontWeight="bold">
              Report an Issue
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
            Help make our community better by reporting urban issues. 
            Provide detailed information and location to help authorities respond quickly.
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Title Field */}
          <TextField
            fullWidth
            label="Issue Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief description of the issue"
            required
            margin="normal"
            inputProps={{ maxLength: 200 }}
            helperText={`${formData.title.length}/200 characters`}
          />

          {/* Description Field */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about the issue"
            required
            multiline
            rows={4}
            margin="normal"
            inputProps={{ maxLength: 2000 }}
            helperText={`${formData.description.length}/2000 characters`}
          />

          {/* Category and Priority Row */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  {priorities.map(priority => (
                    <MenuItem key={priority.id} value={priority.id}>
                      <Chip 
                        label={priority.name} 
                        color={priority.id === 'high' ? 'error' : priority.id === 'medium' ? 'warning' : 'success'} 
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Address Field */}
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.location.address}
            onChange={handleInputChange}
            placeholder="Auto-filled when you select location on map"
            required
            margin="normal"
            InputProps={{
              startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />,
              sx: { 
                backgroundColor: formData.location.address ? 'action.hover' : 'background.paper'
              }
            }}
            helperText={
              formData.location.address 
                ? 'Address auto-filled from selected location' 
                : 'Use "Use Current Location" button or click on map to auto-fill address'
            }
          />

          {/* Interactive Map */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Location on Map
            </Typography>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <InteractiveMap 
                onLocationSelect={handleMapLocationSelect}
                height="400px"
                initialPosition={
                  formData.location.coordinates.latitude && formData.location.coordinates.longitude
                    ? [
                        parseFloat(formData.location.coordinates.latitude),
                        parseFloat(formData.location.coordinates.longitude)
                      ]
                    : null
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click on the map to select the exact location of the issue, or use the "Use Current Location" button
              </Typography>
            </Paper>
          </Box>

          {/* Coordinates Row */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                value={formData.location.coordinates.latitude}
                placeholder="Auto-filled from map selection"
                required
                InputProps={{ readOnly: true }}
                helperText="Automatically filled when you select location on map"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                value={formData.location.coordinates.longitude}
                placeholder="Auto-filled from map selection"
                required
                InputProps={{ readOnly: true }}
                helperText="Automatically filled when you select location on map"
              />
            </Grid>
          </Grid>

          {/* Image Upload */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Photo (Optional)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              sx={{ mb: 1 }}
            >
              Choose Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              Supported formats: JPEG, PNG, GIF (Max size: 16MB)
            </Typography>
          </Box>

          {/* Image Preview */}
          {imagePreview && (
            <Paper sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '150px', 
                  maxHeight: '100px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
              <Box>
                <Typography variant="body2">Image selected</Typography>
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<ReportIcon />}
              disabled={loading}
              size="large"
            >
              {loading ? 'Reporting...' : 'Report Issue'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
