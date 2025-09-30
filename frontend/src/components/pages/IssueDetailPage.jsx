import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  TextField,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material'
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material'
import { useApp } from '../../context/AppContext'
import { issuesAPI } from '../../services/api'
import { LoadingSpinner } from '../common/LoadingSpinner'
import InteractiveMap from '../common/InteractiveMap'

export function IssueDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    currentUser, 
    loadComments, 
    addComment, 
    voteOnIssue, 
    updateIssueStatus,
    categories,
    statuses,
    priorities,
    showMessage 
  } = useApp()

  const [issue, setIssue] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({ status: '', comment: '' })

  // Load issue details
  useEffect(() => {
    const loadIssueDetail = async () => {
      try {
        setLoading(true)
        
        // Load issue details
        const issueResponse = await issuesAPI.getIssue(id)
        if (issueResponse.success) {
          setIssue(issueResponse.data)
          setStatusUpdate({ status: issueResponse.data.status, comment: '' })
        } else {
          showMessage('Issue not found', 'error')
          navigate('/')
          return
        }

        // Load comments
        const commentsData = await loadComments(id)
        setComments(commentsData)
        
      } catch (error) {
        console.error('Failed to load issue details:', error)
        showMessage('Failed to load issue details', 'error')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadIssueDetail()
    }
  }, [id, navigate, loadComments, showMessage])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser) return

    try {
      setSubmittingComment(true)
      await addComment(id, newComment.trim())
      
      // Reload comments
      const updatedComments = await loadComments(id)
      setComments(updatedComments)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleVote = async (voteType) => {
    if (!currentUser) {
      showMessage('Please login to vote', 'error')
      return
    }

    try {
      await voteOnIssue(id, voteType)
      
      // Reload issue to get updated vote counts
      const response = await issuesAPI.getIssue(id)
      if (response.success) {
        setIssue(response.data)
      }
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!currentUser?.isAdmin) return

    try {
      await updateIssueStatus(id, statusUpdate.status, statusUpdate.comment)
      
      // Reload issue to get updated status
      const response = await issuesAPI.getIssue(id)
      if (response.success) {
        setIssue(response.data)
      }
      
      setStatusUpdate({ ...statusUpdate, comment: '' })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading issue details..." />
  }

  if (!issue) {
    return (
      <div className="container">
        <div className="card">
          <h1>Issue Not Found</h1>
          <p>The requested issue could not be found.</p>
          <button className="btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const categoryData = categories.find(c => c.id === issue.category)
  const statusData = statuses.find(s => s.id === issue.status)
  const priorityData = priorities.find(p => p.id === issue.priority)

  return (
    <div className="container">
      {/* Issue Details */}
      <div className="card">
        <div className="issue-header">
          <button className="btn btn-sm" onClick={() => navigate('/')}>
            ← Back to Issues
          </button>
          <h1 className="issue-title">{issue.title}</h1>
          <div className="issue-meta">
            <span className={`badge badge-${issue.category}`}>
              {categoryData?.icon} {categoryData?.name || issue.category}
            </span>
            <span className={`badge status-${issue.status}`}>
              {statusData?.icon} {statusData?.name || issue.status}
            </span>
            <span className={`badge priority-${issue.priority}`}>
              {priorityData?.name || issue.priority}
            </span>
          </div>
        </div>

        <div className="issue-body">
          <p className="issue-description">{issue.description}</p>
          
          <div className="issue-details">
            <p><strong>Location:</strong> {issue.location?.address}</p>
            <p><strong>GPS Coordinates:</strong> {issue.location?.coordinates?.latitude?.toFixed(6)}, {issue.location?.coordinates?.longitude?.toFixed(6)}</p>
            <p><strong>Reported by:</strong> {issue.reportedBy?.name}</p>
            <p><strong>Reported on:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
            {issue.assignedTo && (
              <p><strong>Assigned to:</strong> {issue.assignedTo.name}</p>
            )}
          </div>

          {issue.imageUrl && (
            <div className="issue-image">
              <img 
                src={`http://localhost:5000${issue.imageUrl}`} 
                alt="Issue" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
          )}

          {/* Location Map */}
          <div className="issue-location-map" style={{ marginTop: '20px' }}>
            <h3>Issue Location</h3>
            <InteractiveMap 
              initialPosition={[
                issue.location?.coordinates?.latitude || 0,
                issue.location?.coordinates?.longitude || 0
              ]}
              height="300px"
              allowClick={false}
              zoom={15}
            />
          </div>
        </div>

        {/* Voting */}
        <div className="issue-actions">
          <div className="issue-votes">
            <button 
              className="vote-btn upvote" 
              onClick={() => handleVote('up')}
              disabled={!currentUser}
            >
              👍 {issue.upvotes || 0}
            </button>
            <button 
              className="vote-btn downvote" 
              onClick={() => handleVote('down')}
              disabled={!currentUser}
            >
              👎 {issue.downvotes || 0}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Status Update */}
      {currentUser?.isAdmin && (
        <div className="card">
          <h2>Update Status (Admin)</h2>
          <form onSubmit={handleStatusUpdate}>
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                required
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.icon} {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="statusComment">Comment (optional):</label>
              <textarea
                id="statusComment"
                value={statusUpdate.comment}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, comment: e.target.value })}
                placeholder="Add a comment about this status update..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn">Update Status</button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      <div className="card">
        <h2>Comments ({comments.length})</h2>
        
        {/* Add Comment Form */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <div className="form-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={3}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn"
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <p>Please login to add comments.</p>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author?.name || 'Anonymous'}</strong>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  )
}
