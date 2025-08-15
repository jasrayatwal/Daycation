import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../store/maps';
import Maps from '../Maps/Maps';
import { defaultMapStyle } from '../../config/mapStyles';
import './LandingPage.css';

function LandingPage() {
  const key = useSelector((state) => state.maps.key);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key) {
    return (
      <div>Loading map...</div>
    )
  }

  const mapConfig = {
    center: { lat: 20, lng: -103.771556 },
    zoom: 4,
    mapTypeId: 'roadmap',
    containerStyle: {
      width: '100vw',
      height: '100vh'
    },
    options: {
      gestureHandling: 'greedy',
      minZoom: 2,
      maxZoom: 15,
      disableDefaultUI: true,
      styles: defaultMapStyle
    }
  }

  return (
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
  )
}

export default LandingPage;
