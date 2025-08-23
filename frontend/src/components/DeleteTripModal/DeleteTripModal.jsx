import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteTripById, getAllTrips } from '../../store/trips';
import './DeleteTripModal.css';

function DeleteTripModal({ trip, onDelete }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteTripById(trip.id));
      await dispatch(getAllTrips());
      closeModal();
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-trip-modal">
      <div className="modal-header">
        <h2>Delete Trip</h2>
      </div>

      <div className="modal-content">
        <p>Are you sure you want to delete <strong>{trip.name}</strong>?</p>
        <p>This action cannot be undone. All activities and details will be permanently deleted.</p>
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
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Trip'}
        </button>
      </div>
    </div>
  );
}

export default DeleteTripModal;
