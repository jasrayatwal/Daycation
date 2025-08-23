import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { csrfFetch } from '../../store/csrf';
import { getTripById } from '../../store/trips';
import './ActivityDeleteModal.css';

function ActivityDeleteModal({ activity, trip }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteActivity = async () => {
    setIsDeleting(true);
    try {
      const response = await csrfFetch(`/api/activities/${activity.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await dispatch(getTripById(trip.id));
        closeModal();
      } else {
        throw new Error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="activity-delete-modal">
      <div className="modal-header">
        <h2>Delete Activity</h2>
      </div>

      <div className="modal-content">
        <div className="activity-info">
          <h3>{activity?.title}</h3>
          <p><strong>Address:</strong> {activity?.address}</p>
          <p><strong>Time:</strong> {activity?.startTime} - {activity?.endTime}</p>
          <p><strong>Cost:</strong> ${activity?.costEstimate}</p>
        </div>

        <p>Are you sure you want to delete this activity?</p>
      </div>

      <div className="modal-buttons">
        <button
          className="cancel-button"
          onClick={closeModal}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteActivity}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Activity'}
        </button>
      </div>
    </div>
  );
}

export default ActivityDeleteModal;
