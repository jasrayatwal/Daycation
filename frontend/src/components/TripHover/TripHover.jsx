import './TripHover.css';

function TripHover({ trip, position, visible }) {
  if (!visible || !trip) return null;

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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  return (
    <div
      className="trip-tooltip"
      style={{
        left: position.x + 10, //set hover details to side of marker
        top: position.y - 10,
      }}
    >
      <div className="tooltip-header">
        <h3>{trip.name}</h3>
      </div>

      <div className="tooltip-content">
        <div className="detail-row">
          <span className="label">Date:</span>
          <span className="value">{formatDate(trip.date)}</span>
        </div>

        <div className="detail-row">
          <span className="label">Location:</span>
          <span className="value">{trip.location}</span>
        </div>

        <div className="detail-row">
          <span className="label">Time:</span>
          <span className="value">{formatTime(trip.startTime)} - {formatTime(trip.endTime)}</span>
        </div>

        <div className="detail-row">
          <span className="label">Group Size:</span>
          <span className="value">{trip.groupSize} people</span>
        </div>

        <div className="detail-row">
          <span className="label">Budget:</span>
          <span className="value">${trip.budget}</span>
        </div>
      </div>

      {trip.notes && (
        <div className="tooltip-notes">
          <p>{trip.notes}</p>
        </div>
      )}
    </div>
  )
}

export default TripHover;
