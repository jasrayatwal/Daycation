import { MdOutlineEditLocationAlt, MdDeleteForever } from 'react-icons/md';
import { useModal } from '../../context/Modal';
import DeleteTripModal from '../DeleteTripModal/DeleteTripModal';
import TripEditModal from '../TripEditModal/TripEditModal';
import ActivityDeleteModal from '../ActivityDeleteModal/ActivityDeleteModal';
import './ActivitySidebar.css';

function ActivitySidebar({
  trip,
  activities,
  selectedActivity,
  onActivitySelect,
  onTripDeleted
}) {
  const { setModalContent } = useModal();

  const handleEditTrip = () => {
    setModalContent(<TripEditModal trip={trip} />);
  }

  const handleDeleteTrip = () => {
    setModalContent(<DeleteTripModal trip={trip} onDelete={onTripDeleted} />);
  }

  const handleDeleteActivity = (activity, e) => {
    e.stopPropagation();
    setModalContent(<ActivityDeleteModal activity={activity} trip={trip} />);
  }

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className="activity-sidebar">
      <div className="sidebar-header">
        <div className="trip-info">
          <h2>{trip?.name}</h2>
          <div className="trip-summary">
            <p><strong>Date:</strong> {formatDate(trip?.date)}</p>
            <p><strong>Location:</strong> {trip?.location}</p>
            <p><strong>Activities:</strong> {activities.length} planned</p>
          </div>
        </div>
        <div className="trip-actions">
          <button className="edit-button" onClick={handleEditTrip} title="Edit Trip">
            <MdOutlineEditLocationAlt />
          </button>
          <button className="delete-button" onClick={handleDeleteTrip} title="Delete Trip">
            <MdDeleteForever />
          </button>
        </div>
      </div>

      <div className="sidebar-main-content">
        <div className="activities-list">
          <h3>Activities</h3>
          {activities.length === 0 ? (
            <div className="no-activities">
              <p>No activities planned yet</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={`activity-item ${selectedActivity?.id === activity.id ? 'selected' : ''}`}
                onClick={() => onActivitySelect(activity)}
              >
                <div className="activity-basic-info">
                  <div className="activity-header">
                    <div className="activity-info">
                      <h4>{activity.title}</h4>
                      <p className="activity-address">{activity.address}</p>
                    </div>
                    <div className="activity-header-right">
                      <span className="activity-number">#{activity.orderNumber}</span>
                    </div>
                  </div>

                  <div className="activity-basic-details">
                    {activity.startTime && (
                      <div className="activity-time">
                        {formatTime(activity.startTime)}
                        {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                      </div>
                    )}

                    <div className="activity-cost">
                      ${activity.costEstimate || 0}
                    </div>

                    {activity.durationMin && (
                      <div className="activity-duration">
                        {activity.durationMin} min
                      </div>
                    )}
                  </div>
                </div>

                {selectedActivity?.id === activity?.id && (
                  <div className="activity-expanded-details">
                    <div className="details-section">
                      <p><strong>Type:</strong> {activity.type}</p>
                      <p><strong>Duration:</strong> {activity.durationMin} minutes</p>
                      <p><strong>Cost:</strong> ${activity.costEstimate || 0}</p>
                      {activity.transportType && (
                        <p><strong>Transportation Method:</strong> {activity.transportType}</p>
                      )}
                    </div>

                    {activity.notes && (
                      <div className="activity-notes">
                        <strong>Notes:</strong>
                        <p><em>{activity.notes}</em></p>
                      </div>
                    )}

                    <div className="activity-detail-actions">
                      <button
                        className="activity-delete-button"
                        onClick={(e) => handleDeleteActivity(activity, e)}
                        title="Delete Activity"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivitySidebar;
