import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon using a red pin from external URL
const createLocationIcon = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, currentPosition, setCurrentPosition }) {
  const mapRef = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCurrentPosition([lat, lng]);
      onLocationSelect(lat, lng);
      
      // Reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            onLocationSelect(lat, lng, data.display_name);
          }
        })
        .catch(error => {
          console.error('Reverse geocoding failed:', error);
          onLocationSelect(lat, lng);
        });
    }
  });

  return currentPosition ? (
    <Marker position={currentPosition} icon={createLocationIcon()}>
      <Popup>
        📍 Selected Location<br />
        Lat: {currentPosition[0].toFixed(6)}<br />
        Lng: {currentPosition[1].toFixed(6)}
      </Popup>
    </Marker>
  ) : null;
}

const InteractiveMap = ({ 
  onLocationSelect, 
  initialPosition = null,
  height = '400px',
  allowClick = true,
  zoom = 13,
  className = ''
}) => {
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi
  const mapRef = useRef();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation && !initialPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          
          // Auto-select current location if no initial position
          if (allowClick && onLocationSelect) {
            setCurrentPosition([latitude, longitude]);
            onLocationSelect(latitude, longitude);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Keep default location (Delhi)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else if (initialPosition) {
      setCurrentPosition(initialPosition);
      setMapCenter(initialPosition);
    }
  }, [initialPosition, allowClick, onLocationSelect]);

  const useCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];
          setCurrentPosition(newLocation);
          setUserLocation(newLocation);
          
          // Center the map on user location
          if (mapRef.current) {
            mapRef.current.setView(newLocation, zoom);
          }
          
          // Get address for the current location
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude}, ${longitude}`;
            
            // Update form with current location
            if (onLocationSelect) {
              onLocationSelect(latitude, longitude, address);
            }
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            if (onLocationSelect) {
              onLocationSelect(latitude, longitude);
            }
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your current location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          alert(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className={`interactive-map ${className}`}>
      {allowClick && (
        <div className="map-controls">
          <button 
            type="button"
            onClick={useCurrentLocation}
            className="btn btn-primary"
            style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            📍 Use Current Location
          </button>
          <p className="map-instructions">
            Click "Use Current Location" to auto-fill your location, or click on the map to select a specific location
          </p>
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%', borderRadius: '8px' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Clickable marker handler */}
        {allowClick && (
          <MapClickHandler 
            onLocationSelect={onLocationSelect}
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
          />
        )}
        
        {/* Static marker for display mode */}
        {!allowClick && currentPosition && (
          <Marker position={currentPosition} icon={createLocationIcon()}>
            <Popup>
              📍 Issue Location<br />
              Lat: {currentPosition[0].toFixed(6)}<br />
              Lng: {currentPosition[1].toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;