import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../store/maps';
import Maps from '../Maps/Maps';
import { APIProvider } from '@vis.gl/react-google-maps';
import './LandingPage.css';

function LandingPage() {
  const key = useSelector((state) => state.maps.key);
  const landingMapId = useSelector((state) => state.maps.landingMapId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key || !landingMapId) {
    return (
      <div>Loading map...</div>
    )
  }

  const mapConfig = {
    center: { lat: 20, lng: -103.771556 },
    zoom: 3.25,
    mapId: landingMapId,
    containerStyle: {
      width: '100vw',
      height: '100vh'
    },
      gestureHandling: 'greedy',
      minZoom: 2,
      maxZoom: 15,
      disableDefaultUI: true
  }

  return (
    <APIProvider apiKey={key}>
    <div className="landing-globe-container">
      <Maps
        apiKey={key}
        config={mapConfig}
        rotate={true}
        onMapClick={(event) => { //have for now, testing feature for users before log-in/sign-up
          console.log('Map clicked at:', event.latLng.lat(), event.latLng.lng());
        }}
      />

      <div className="landing-text-search-container">
        <div className="landing-content">
          <h1 className="landing-title">Daycation</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Where would you like to explore?"
              className="location-search"
            />
          </div>
        </div>
      </div>
    </div>
    </APIProvider>
  )
}

export default LandingPage;
