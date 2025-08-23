import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getKey } from '../../store/maps';
import Maps from '../Maps/Maps';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupModal/SignupModal';
import './LandingPage.css';

function LandingPage() {
  const key = useSelector((state) => state.maps.key);
  const landingMapId = useSelector((state) => state.maps.landingMapId);
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const { setModalContent} = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!key || !landingMapId) {
    return (
      <div>Loading map...</div>
    )
  }

  const handlePlaceChange = (e) => {
    const place = e.target.value;
    if (!place || !place.formattedAddress) return;

    console.log('Place selected on landing:', place.formattedAddress);
    console.log('Place selected on landing:', place.formattedAddress);
    sessionStorage.setItem('pendingSearchLocation', place.formattedAddress);

    setModalContent(
      <div>
        <SignupFormModal
          searchPrompt={`Sign up to plan your trip to ${place.formattedAddress}!`}
        />
      </div>
    );
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
        />

        <div className="landing-text-search-container">
          <div className="landing-content">
            <h1 className="landing-title">Daycation</h1>

            <div className="search-container">
              <div className="place-picker-container">
                <PlacePicker
                  placeholder="Where would you like to explore?"
                  type="(cities)"
                  onPlaceChange={handlePlaceChange}
                  className="landing-place-picker"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  )
}

export default LandingPage;
