import { useRef, useEffect, useState } from 'react';
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
  const [mapLoaded, setMapLoaded] = useState(false); //check that map loaded

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
    console.log('useEffect:', {
      rotate,
      mapRefExists: !!mapRef.current,
      mapLoaded
    });

    if (!rotate) {
      console.log('Rotation disabled');
      return;
    }

    if (!mapRef.current) {
      console.log('Map ref not available');
      return;
    }

    if (!mapLoaded) {
      console.log('Map not loaded yet');
      return;
    }

    let angle = 0;
    const centerLat = 20;
    const rotationSpeed = 0.50;
    const updateInterval = 50;

    console.log('Starting map rotation...');

    const rotationInterval = setInterval(() => {
      angle += rotationSpeed;
      const lng = (angle % 360) - 180; //set to value between -180 and 180

      try {
        if (mapRef.current) {
          console.log('Rotating to:', { lat: centerLat, lng });
          mapRef.current.panTo({ lat: centerLat, lng });
        }
      } catch (error) {
        console.error('Rotation error:', error);
      }
    }, updateInterval);

    return () => clearInterval(rotationInterval);

  }, [rotate, mapLoaded])

  const onLoad = (mapInstance) => {
    console.log('Map instance loaded');
    mapRef.current = mapInstance;
    setMapLoaded(true);
  };

  const onUnmount = () => { //remove ref
    mapRef.current = null;
    setMapLoaded(false);
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

  console.log('Rendering...');

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
    />
  );
};

export default Maps;
