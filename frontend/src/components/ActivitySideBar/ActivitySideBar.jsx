import './ActivitySidebar.css';

function ActivitySidebar({
  trip,
  activities,
  selectedActivity,
  onActivitySelect
}) {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  return (
    <div className="activity-sidebar">
      <div className="sidebar-header">
        <h2>{trip?.name}</h2>
        <div className="trip-summary">
          <p>{trip?.location}</p>
          <p>{activities.length} activities planned</p>
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
                    <span className="activity-number">#{activity.orderNumber}</span>
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
