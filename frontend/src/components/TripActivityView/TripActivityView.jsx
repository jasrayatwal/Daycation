import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTripById } from '../../store/trips';
import Maps from '../Maps/Maps';
import ActivitySidebar from '../ActivitySidebar/ActivitySidebar';
import './TripActivityView.css';

function TripActivityView({ trip, onBack }) {
  const dispatch = useDispatch();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const dashboardMapId = useSelector((state) => state.maps.dashboardMapId);
  const currentTrip = useSelector((state) => state.trips.currentTrip);

  useEffect(() => {
    if (trip?.id) {
      dispatch(getTripById(trip.id));
    }
  }, [dispatch, trip?.id]);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  }

  const handleMapClick = () => {
    setSelectedActivity(null);
  }

  const handleTripDeleted = () => {
    onBack(); // Go back to dashboard when trip is deleted
  }

  const tripData = currentTrip || trip;

  const activityMarkers = tripData?.activities ? tripData?.activities.map((activity) => ({
    id: activity.id,
    position: {
      lat: parseFloat(activity.lat),
      lng: parseFloat(activity.lng)
    },
    title: activity.title,
    number: activity.orderNumber,
    onClick: () => handleActivitySelect(activity),
    isSelected: selectedActivity?.id === activity.id
  })) : [];

  const mapConfig = {
    center: { lat: parseFloat(trip.refLat), lng: parseFloat(trip.refLng) },
    zoom: 13,
    mapId: dashboardMapId,
    containerStyle: {
      width: '100%',
      height: '100vh'
    }
  };

  return (
    <div className="trip-activity-container">
      <button className="back-button" onClick={onBack}>
        Back to Dashboard
      </button>

      <div className="trip-activity-content">
        <div className="map-section">
          <Maps
            config={mapConfig}
            activityMarkers={activityMarkers}
            onMapClick={handleMapClick}
          />
        </div>

        <ActivitySidebar
          trip={tripData}
          activities={tripData?.activities}
          selectedActivity={selectedActivity}
          onActivitySelect={handleActivitySelect}
          onTripDeleted={handleTripDeleted}
        />
      </div>
    </div>
  );
}

export default TripActivityView;
