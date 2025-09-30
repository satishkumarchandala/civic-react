const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['traffic', 'sanitation', 'infrastructure', 'water', 'electricity', 'environment', 'security', 'other'],
      message: 'Invalid category'
    }
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Invalid priority'
    },
    default: 'medium'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['pending', 'in-progress', 'resolved', 'rejected'],
      message: 'Invalid status'
    },
    default: 'pending'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude']
      }
    }
  },
  imageUrl: {
    type: String,
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  voters: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
issueSchema.index({ category: 1, status: 1 });
issueSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });

// Virtual for vote count
issueSchema.virtual('voteCount').get(function() {
  return this.upvotes - this.downvotes;
});

// Method to check if user has voted
issueSchema.methods.hasUserVoted = function(userId) {
  return this.voters.some(voter => voter.user.toString() === userId.toString());
};

// Method to add vote
issueSchema.methods.addVote = function(userId, voteType) {
  const existingVoteIndex = this.voters.findIndex(voter => voter.user.toString() === userId.toString());
  
  if (existingVoteIndex >= 0) {
    // Update existing vote
    const existingVote = this.voters[existingVoteIndex];
    if (existingVote.voteType === voteType) {
      // Same vote type, remove it
      this.voters.splice(existingVoteIndex, 1);
      if (voteType === 'up') this.upvotes--;
      else this.downvotes--;
    } else {
      // Different vote type, update it
      if (existingVote.voteType === 'up') {
        this.upvotes--;
        this.downvotes++;
      } else {
        this.downvotes--;
        this.upvotes++;
      }
      existingVote.voteType = voteType;
    }
  } else {
    // Add new vote
    this.voters.push({ user: userId, voteType });
    if (voteType === 'up') this.upvotes++;
    else this.downvotes++;
  }
  
  return this.save();
};

module.exports = mongoose.model('Issue', issueSchema);
