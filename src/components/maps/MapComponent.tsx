import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet's default icon
// We're handling this issue by setting marker icon URLs directly without importing the image files
// This avoids import errors with certain bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  center: [number, number]; // Latitude, longitude
  zoom?: number;
  markers?: {
    position: [number, number];
    title: string;
    popup?: string;
  }[];
  height?: string;
  width?: string;
  onMapClick?: (e: L.LeafletMouseEvent) => void;
  showSatellite?: boolean;
  onMapReady?: (map: L.Map) => void;
}

// A component to handle map events
const MapEvents: React.FC<{ 
  onClick?: (e: L.LeafletMouseEvent) => void;
  onMapReady?: (map: L.Map) => void;
}> = ({ onClick, onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    if (onClick) {
      map.on('click', onClick);
    }
    
    // Call onMapReady with the map instance
    if (onMapReady) {
      onMapReady(map);
    }
    
    return () => {
      if (onClick) {
        map.off('click', onClick);
      }
    };
  }, [map, onClick, onMapReady]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 10,
  markers = [],
  height = '500px',
  width = '100%',
  onMapClick,
  showSatellite = false,
  onMapReady,
}) => {
  // Different tile layers
  const openStreetMapTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteTile = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  
  return (
    <div style={{ height, width }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={showSatellite ? satelliteTile : openStreetMapTile}
        />
        
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            {marker.popup && (
              <Popup>
                <div>
                  <h3 className="text-lg font-medium">{marker.title}</h3>
                  <p>{marker.popup}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        
        <MapEvents onClick={onMapClick} onMapReady={onMapReady} />
      </MapContainer>
    </div>
  );
};

export default MapComponent; 