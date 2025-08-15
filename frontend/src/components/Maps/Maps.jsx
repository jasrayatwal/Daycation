import { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const defaultContainerStyle = { width: '400px', height: '400px' };
const defaultCenter = { lat: 20, lng: -103.771556 };
const libraries = ['places'];

const Maps = ({
  apiKey,
  config = {},
  onMapClick,
  rotate = false
}) => {
  const mapRef = useRef(null);

  const containerStyle = config.containerStyle || defaultContainerStyle;
  const center = config.center || defaultCenter;
  const zoom = config.zoom || 8;
  const options = config.options || {};

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
    version: 'weekly'
  });

  useEffect(() => {
    if (!rotate || !mapRef.current) return;

    let angle = 0;
    const centerLat = center.lat || 20;
    const rotationSpeed = 0.50;
    const updateInterval = 50;

    const rotationInterval = setInterval(() => {
      angle += rotationSpeed;
      const lng = (angle % 360) - 180; //set to value between -180 and 180

      try {
        if (mapRef.current) {
          mapRef.current.panTo({ lat: centerLat, lng });
        }
      } catch (error) {
        console.error('Rotation error:', error);
      }
    }, updateInterval);

    return () => clearInterval(rotationInterval);

  }, [center.lat, rotate])

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  if (loadError) {
    console.error('Map did not load: ', loadError);
    return (
      <div>
        <h3>Failed to load Map</h3>
      </div>
    );
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
      onClick={onMapClick}
    />
  );
};

export default Maps;
