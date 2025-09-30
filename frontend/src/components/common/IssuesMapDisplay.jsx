import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different issue statuses
const getMarkerIcon = (status, priority) => {
  const colors = {
    pending: '#ed8936',
    'in-progress': '#3182ce',
    resolved: '#38a169',
    rejected: '#e53e3e'
  };

  const prioritySize = {
    low: { size: 20, border: 2 },
    medium: { size: 25, border: 3 },
    high: { size: 30, border: 4 }
  };

  const config = prioritySize[priority] || prioritySize.medium;
  const color = colors[status] || colors.pending;

  return L.divIcon({
    className: 'issue-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${config.size}px;
        height: ${config.size}px;
        border-radius: 50%;
        border: ${config.border}px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          width: ${Math.floor(config.size * 0.3)}px;
          height: ${Math.floor(config.size * 0.3)}px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2]
  });
};

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const IssuesMapDisplay = ({ 
  issues = [], 
  height = '500px',
  onIssueSelect = null,
  selectedIssue = null,
  showFilters = true,
  className = ''
}) => {
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi

  useEffect(() => {
    if (issues.length > 0) {
      // Calculate center based on all issues
      const latSum = issues.reduce((sum, issue) => sum + issue.location.coordinates.latitude, 0);
      const lngSum = issues.reduce((sum, issue) => sum + issue.location.coordinates.longitude, 0);
      setMapCenter([latSum / issues.length, lngSum / issues.length]);
    }
  }, [issues]);

  useEffect(() => {
    // Apply filters
    let filtered = issues;

    if (filters.status !== 'all') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(issue => issue.priority === filters.priority);
    }

    setFilteredIssues(filtered);
  }, [issues, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className={`issues-map-display ${className}`}>
      {showFilters && (
        <div className="map-filters" style={{ marginBottom: '15px' }}>
          <div className="filter-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="traffic">Traffic</option>
                <option value="sanitation">Sanitation</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="water">Water</option>
                <option value="electricity">Electricity</option>
                <option value="environment">Environment</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Priority:</label>
              <select 
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="issues-count">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>
        </div>
      )}

      <div className="map-legend" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
        <strong>Legend:</strong>
        <span style={{ color: '#ed8936', marginLeft: '10px' }}>● Pending</span>
        <span style={{ color: '#3182ce', marginLeft: '10px' }}>● In Progress</span>
        <span style={{ color: '#38a169', marginLeft: '10px' }}>● Resolved</span>
        <span style={{ color: '#e53e3e', marginLeft: '10px' }}>● Rejected</span>
        <span style={{ marginLeft: '15px', fontSize: '0.8rem' }}>Size indicates priority</span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height, width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredIssues.map((issue) => (
          <Marker
            key={issue._id}
            position={[issue.location.coordinates.latitude, issue.location.coordinates.longitude]}
            icon={getMarkerIcon(issue.status, issue.priority)}
            eventHandlers={onIssueSelect ? {
              click: () => onIssueSelect(issue)
            } : {}}
          >
            <Popup>
              <div className="issue-popup" style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#2d3748' }}>
                  {issue.title}
                </h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#4a5568' }}>
                  {issue.description.length > 100 
                    ? `${issue.description.substring(0, 100)}...` 
                    : issue.description
                  }
                </p>
                
                <div className="issue-badges" style={{ marginBottom: '8px' }}>
                  <span className={`badge badge-${issue.category}`}>{issue.category}</span>
                  <span className={`badge status-${issue.status}`}>{issue.status}</span>
                  <span className={`badge priority-${issue.priority}`}>{issue.priority}</span>
                </div>
                
                <div className="issue-details" style={{ fontSize: '0.8rem', color: '#718096' }}>
                  <div><strong>Reported by:</strong> {issue.reportedBy?.name || 'Unknown'}</div>
                  <div><strong>Date:</strong> {formatDate(issue.createdAt)}</div>
                  <div><strong>Address:</strong> {issue.location.address}</div>
                  <div><strong>Votes:</strong> ↑{issue.upvotes} ↓{issue.downvotes}</div>
                  
                  {issue.imageUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={`http://localhost:5000${issue.imageUrl}`}
                        alt="Issue"
                        style={{ 
                          width: '100%', 
                          maxHeight: '150px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {onIssueSelect && (
                  <button
                    onClick={() => onIssueSelect(issue)}
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    View Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IssuesMapDisplay;