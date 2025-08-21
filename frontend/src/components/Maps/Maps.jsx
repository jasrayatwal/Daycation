import { useEffect, useState, useRef } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import './Maps.css';

const defaultContainerStyle = { width: '400px', height: '400px' };
const defaultCenter = { lat: 20, lng: -103.771556 };

const Maps = ({
  config = {},
  onMapClick,
  rotate = false,
  tripMarkers = [],
  activityMarkers = []
}) => {
  const [viewState, setViewState] = useState({ //set controlled state
    center: config.center || defaultCenter,
    zoom: config.zoom || 8
  })

  const containerStyle = config.containerStyle || defaultContainerStyle;
  const userInteractedRef = useRef(false); //check for movement

  useEffect(() => {
    if (!rotate) return;

    let angle = 0;
    const centerLat = 20;
    const rotationSpeed = 0.50;
    const updateInterval = 50;

    const rotationInterval = setInterval(() => {
      angle += rotationSpeed;
      const lng = (angle % 360) - 180;

      setViewState(prev => ({
        ...prev,
        center: { lat: centerLat, lng }
      }));
    }, updateInterval);

    return () => clearInterval(rotationInterval);
  }, [rotate]);

  useEffect(() => {
    if (config.center && !userInteractedRef.current) {
      setViewState(prev => ({
        ...prev,
        center: config.center,
        zoom: config.zoom || prev.zoom
      }));
    }
  }, [config.center, config.zoom]);

  const onMove = ({center, zoom}) => {
    if (!rotate) { //don't worry about rotate
      userInteractedRef.current = true;

      setViewState({center, zoom});
    }
  };

  const handleMarkerHover = (markerHandler, event) => {
    if (markerHandler) {
      markerHandler(event);
    }
  };


  return (
      <Map
        mapId={config.mapId}
        style={containerStyle}
        center={viewState.center}
        zoom={viewState.zoom}
        onCameraChanged={onMove}
        onClick={onMapClick}
        gestureHandling="greedy"
        disableDefaultUI={true}
        zoomControl={false}
      >
        {tripMarkers.map((marker) => (
          <AdvancedMarker
            key={`trip-${marker.id}`}
            position={marker.position}
            title={marker.title}
            onClick={marker.onClick}
            onMouseEnter={(event) => handleMarkerHover(marker.onMouseEnter, event)}
            onMouseLeave={(event) => handleMarkerHover(marker.onMouseLeave, event)}
          >
            <Pin
              background={'#176982'}
              borderColor={'#135a6b'}
              glyphColor={'white'}
            />
          </AdvancedMarker>
        ))}

        {activityMarkers.map((marker) => {
        if (!marker.id || !marker.position || !marker.number) {
          console.warn('Invalid marker data:', marker);
          return null;
        }

        return (
          <AdvancedMarker
            key={`activity-${marker.id}-${marker.number}`} //make unique vs trip marker
            position={marker.position}
            title={`${marker.number}. ${marker.title}`}
            onClick={marker.onClick}
          >
            <div className={`numbered-marker ${marker.isSelected ? 'selected' : ''}`}>
              <div className="marker-number">{marker.number}</div>
            </div>
          </AdvancedMarker>
        );
      })}
      </Map>
  );
};

export default Maps;
