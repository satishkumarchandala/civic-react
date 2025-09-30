import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, issuesAPI, commentsAPI, emailAPI } from '../services/api'

// Create context
const AppContext = createContext()

// Initial data structure
const initialData = {
  categories: [
    { id: "traffic", name: "Traffic", icon: "🚦" },
    { id: "sanitation", name: "Sanitation", icon: "🗑️" },
    { id: "infrastructure", name: "Infrastructure", icon: "🏗️" },
    { id: "water", name: "Water", icon: "💧" },
    { id: "electricity", name: "Electricity", icon: "⚡" },
    { id: "environment", name: "Environment", icon: "🌱" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "other", name: "Other", icon: "📋" }
  ],
  priorities: [
    { id: "low", name: "Low", color: "#22c55e" },
    { id: "medium", name: "Medium", color: "#eab308" },
    { id: "high", name: "High", color: "#ef4444" }
  ],
  statuses: [
    { id: "pending", name: "Pending", icon: "⏳" },
    { id: "in-progress", name: "In Progress", icon: "🔄" },
    { id: "resolved", name: "Resolved", icon: "✅" },
    { id: "rejected", name: "Rejected", icon: "❌" }
  ]
}

// Context Provider Component
export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [issues, setIssues] = useState([])
  const [comments, setComments] = useState([])
  const [flashMessages, setFlashMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Add auth loading state

  // Load issues from API
  const loadIssues = async () => {
    try {
      setLoading(true)
      const response = await issuesAPI.getIssues()
      if (response && response.success) {
        setIssues(response.data || [])
      } else {
        console.warn('Issues API returned unexpected response:', response)
        setIssues([]) // Set to empty array instead of crashing
      }
    } catch (error) {
      console.error('Failed to load issues:', error)
      setIssues([]) // Set to empty array on error
      // Only show error message if it's not a network error (backend down)
      if (!error.message.includes('fetch')) {
        showMessage('Failed to load issues', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // Load comments from API
  const loadComments = async (issueId) => {
    try {
      const response = await commentsAPI.getComments(issueId)
      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
    return []
  }

  useEffect(() => {
    // Check for saved user session and validate token
    const initializeAuth = async () => {
      try {
        setAuthLoading(true)
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('currentUser')
        
        if (token && savedUser) {
          // Verify token is still valid by making a test API call
          try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              // Add timeout to prevent hanging
              signal: AbortSignal.timeout(5000)
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setCurrentUser(data.user)
                // Update localStorage with fresh user data
                localStorage.setItem('currentUser', JSON.stringify(data.user))
              } else {
                // Token invalid, clear storage
                localStorage.removeItem('token')
                localStorage.removeItem('currentUser')
                setCurrentUser(null)
              }
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('token')
              localStorage.removeItem('currentUser')
              setCurrentUser(null)
            }
          } catch (error) {
            console.error('Token validation failed:', error)
            // On network error, still use saved user (might be offline or backend down)
            if (savedUser) {
              try {
                setCurrentUser(JSON.parse(savedUser))
              } catch (parseError) {
                console.error('Failed to parse saved user:', parseError)
                localStorage.removeItem('currentUser')
                setCurrentUser(null)
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setAuthLoading(false)
      }
    }
    
    initializeAuth()
    
    // Load initial data
    loadIssues()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login({ email, password })
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        setCurrentUser(response.user)
        showMessage('Login successful!', 'success')
        return true
      }
    } catch (error) {
      showMessage(error.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
    return false
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authAPI.register(userData)
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        setCurrentUser(response.user)
        showMessage('Registration successful!', 'success')
        return true
      }
    } catch (error) {
      showMessage(error.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    showMessage('Logged out successfully', 'success')
  }

  const showMessage = (message, type = 'info') => {
    const id = Date.now()
    setFlashMessages(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id))
    }, 5000)
  }

  const addIssue = async (issueData) => {
    try {
      setLoading(true)
      const response = await issuesAPI.createIssue(issueData)
      
      if (response.success) {
        const newIssue = response.data
        setIssues(prev => [newIssue, ...prev])
        showMessage('Issue reported successfully!', 'success')
        
        // Send email notification
        try {
          await emailAPI.notifyIssueCreated(newIssue._id, currentUser._id)
        } catch (emailError) {
          console.warn('Failed to send email notification:', emailError)
        }
        
        return newIssue
      }
    } catch (error) {
      showMessage(error.message || 'Failed to create issue', 'error')
    } finally {
      setLoading(false)
    }
    return null
  }

  const updateIssueStatus = async (issueId, status, comment = '') => {
    try {
      setLoading(true)
      const response = await issuesAPI.updateStatus(issueId, { status, comment })
      
      if (response.success) {
        setIssues(prev => prev.map(issue => 
          issue._id === issueId ? { ...issue, status } : issue
        ))
        showMessage('Issue status updated', 'success')
        
        // Send email notification
        try {
          const issue = issues.find(i => i._id === issueId)
          if (issue && issue.reportedBy) {
            await emailAPI.notifyStatusUpdate(issueId, issue.reportedBy._id, status)
          }
        } catch (emailError) {
          console.warn('Failed to send status update email:', emailError)
        }
      }
    } catch (error) {
      showMessage(error.message || 'Failed to update issue status', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (issueId, content) => {
    try {
      setLoading(true)
      const response = await commentsAPI.addComment({ issueId, content })
      
      if (response.success) {
        const newComment = response.data
        setComments(prev => [newComment, ...prev])
        showMessage('Comment added successfully!', 'success')
        
        // Send email notification
        try {
          const issue = issues.find(i => i._id === issueId)
          if (issue && issue.reportedBy) {
            await emailAPI.notifyCommentAdded(issueId, newComment._id, issue.reportedBy._id)
          }
        } catch (emailError) {
          console.warn('Failed to send comment email:', emailError)
        }
      }
    } catch (error) {
      showMessage(error.message || 'Failed to add comment', 'error')
    } finally {
      setLoading(false)
    }
  }

  const voteOnIssue = async (issueId, voteType) => {
    try {
      const response = await issuesAPI.vote(issueId, voteType)
      
      if (response.success) {
        setIssues(prev => prev.map(issue => {
          if (issue._id === issueId) {
            return {
              ...issue,
              upvotes: response.data.upvotes,
              downvotes: response.data.downvotes
            }
          }
          return issue
        }))
      }
    } catch (error) {
      showMessage(error.message || 'Failed to vote on issue', 'error')
    }
  }

  const value = {
    currentUser,
    issues,
    comments,
    flashMessages,
    loading,
    authLoading,
    categories: initialData.categories,
    statuses: initialData.statuses,
    priorities: initialData.priorities,
    login,
    register,
    logout,
    showMessage,
    addIssue,
    updateIssueStatus,
    addComment,
    voteOnIssue,
    loadIssues,
    loadComments
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
