import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { generateTrip } from '../../store/ai';
import { getTripById } from '../../store/trips';
import './ActivityEditModal.css';

function ActivityEditModal({ activity, trip }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateActivity = async () => {
    setIsRegenerating(true);
    try {
      const requirements = {
        date: trip.date.split('T')[0],
        startTime: trip.startTime,
        endTime: trip.endTime,
        budget: trip.budget,
        groupSize: trip.groupSize,
        tripPace: trip.tripPace,
        tripType: trip.tripType,
        transportation: trip.primaryTransportation
      };

      const coordinates = {
        lat: trip.refLat,
        lng: trip.refLng
      };

      await dispatch(generateTrip(trip.location, requirements, coordinates));

      await dispatch(getTripById(trip.id));

      closeModal();
    } catch (error) {
      console.error('Failed to regenerate activity:', error);
      alert('Failed to regenerate activity. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="activity-edit-modal">
      <div className="modal-header">
        <h2>Edit Activity</h2>
        <button className="close-button" onClick={closeModal}>&times;</button>
      </div>

      <div className="modal-content">
        <div className="activity-info">
          <h3>{activity?.title}</h3>
          <p><strong>Address:</strong> {activity?.address}</p>
          <p><strong>Time:</strong> {activity?.startTime} - {activity?.endTime}</p>
          <p><strong>Cost:</strong> ${activity?.costEstimate}</p>
        </div>

        <p>Are you sure you want to regenerate this activity?</p>
      </div>

      <div className="modal-buttons">
        <button
          className="cancel-button"
          onClick={closeModal}
          disabled={isRegenerating}
        >
          Cancel
        </button>
        <button
          className="regenerate-button"
          onClick={handleRegenerateActivity}
          disabled={isRegenerating}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Activity'}
        </button>
      </div>
    </div>
  );
}

export default ActivityEditModal;
