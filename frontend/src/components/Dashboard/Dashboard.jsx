import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKey } from '../../store/maps';
import { getAllTrips } from '../../store/trips';
import { useModal } from '../../context/Modal';
import Maps from '../Maps/Maps';
import TripHover from '../TripHover/TripHover';
import TripActivityView from '../TripActivityView/TripActivityView';
import TripSearchBar from '../TripSearchBar/TripSearchBar';
import TripGenerationModal from '../TripGenerationModal/TripGenerationModal';
import { APIProvider } from '@vis.gl/react-google-maps';
import { APILoader } from '@googlemaps/extended-component-library/react';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [hoveredTrip, setHoveredTrip] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('overview');

  const key = useSelector((state) => state.maps.key);
  const dashboardMapId = useSelector((state) => state.maps.dashboardMapId);
  const user = useSelector((state) => state.session.user);
  const allTrips = useSelector((state) => state.trips.allTrips);

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  useEffect(() => {
    if (user) {
      dispatch(getAllTrips());
    }
  }, [dispatch, user]);

  const handleTripMarkerHover = (trip, event) => {
    setHoveredTrip(trip);
    setMousePosition({x: event.pageX, y: event.pageY});
  }

  const handleTripMarkerHoverEnd = () => {
    setHoveredTrip(null);
  }

  const handleTripMarkerClick = (trip) => {
    console.log('Trip clicked for details:', trip.name);
    setSelectedTrip(trip);
    setViewMode('trip-detail');
    setHoveredTrip(null);
  }

  const handleBackToDashboard = () => { //when user clicks to go back to dashboard from activityview
    setViewMode('overview');
    setSelectedTrip(null);
  }

  const handleSearch = async (searchQuery, placeData) => {

  try {
    console.log('Creating TripGenerationModal for:', searchQuery);
    setModalContent(<TripGenerationModal searchLocation={searchQuery} placeData={placeData}/>);
    console.log('Modal content set successfully');
  } catch (error) {
    console.error('Error in handleSearch:', error);
  }
  }

  const handleMapClick = (event) => { //testing feature
    if (event?.detail?.latLng) {
      console.log('Map clicked at:', event.detail.latLng);
    }
  }

  const tripMarkers = allTrips ? Object.values(allTrips).map(trip => ({
    id: trip.id,
    position: {
      lat: parseFloat(trip.refLat),
      lng: parseFloat(trip.refLng)
    },
    title: trip.name,
    onClick: () => handleTripMarkerClick(trip),
    onMouseEnter: (event) => handleTripMarkerHover(trip, event),
    onMouseLeave: handleTripMarkerHoverEnd
  })) : [];

  const mapConfig = {
    center: {lat: 39.76632525654491, lng: -101.40380859375001},
    zoom: 4,
    mapId: dashboardMapId,
    containerStyle: {
      width: '100%',
      height: '100vh'
    }
  }

  return (
    <>
      <APILoader
        apiKey={key}
        solutionChannel="GMP_GCC_placepicker_v1"
      />

      <APIProvider
        apiKey={key}
        libraries={['places']}
      >
        {viewMode === 'trip-detail' && selectedTrip ? (
          <TripActivityView
            trip={selectedTrip}
            onBack={handleBackToDashboard}
          />
        ) : (
          <div className="dashboard-container">
            <TripSearchBar onSearch={handleSearch} />

            <Maps
              config={mapConfig}
              rotate={false}
              tripMarkers={tripMarkers}
              onMapClick={handleMapClick}
            />

            <TripHover
              trip={hoveredTrip}
              position={mousePosition}
              visible={hoveredTrip}
            />
          </div>
        )}
      </APIProvider>
    </>
  );
}

export default Dashboard;
