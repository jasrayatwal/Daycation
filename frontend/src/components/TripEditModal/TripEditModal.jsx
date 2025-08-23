import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { updateTripById, getAllTrips } from '../../store/trips';
import { generateTrip } from '../../store/ai';
import './TripEditModal.css';

function TripEditModal({ trip }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [formData, setFormData] = useState({
    name: trip.name,
    date: trip.date.split('T')[0],
    startTime: trip.startTime.slice(0, 5),
    endTime: trip.endTime.slice(0, 5),
    groupSize: trip.groupSize,
    primaryTransportation: trip.primaryTransportation,
    tripPace: trip.tripPace,
    budget: trip.budget,
    tripType: trip.tripType
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const needsRegeneration = () => {
    const regenerationFields = ['startTime', 'endTime', 'groupSize', 'primaryTransportation', 'tripPace', 'budget', 'tripType'];
    return regenerationFields.some(field => formData[field] !== trip[field]);
  };

  const handleSave = async () => {
    if (needsRegeneration()) {
      setIsLoading(true);
      try {
        const requirements = {
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          groupSize: formData.groupSize,
          transportation: formData.primaryTransportation,
          tripPace: formData.tripPace,
          budget: formData.budget,
          tripType: formData.tripType
        };

        const coordinates = {
          lat: parseFloat(trip.refLat),
          lng: parseFloat(trip.refLng)
        };

        const newTrip = await dispatch(generateTrip(trip.location, requirements, coordinates));
        setGeneratedTrip({ ...newTrip, name: formData.name, date: formData.date });
        setShowPreview(true);
      } catch (error) {
        console.error('Failed to regenerate trip:', error);
        alert('Failed to regenerate trip. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSaving(true);
      try {
        await dispatch(updateTripById(trip.id, {
          name: formData.name,
          date: formData.date
        }));
        await dispatch(getAllTrips());
        closeModal();
      } catch (error) {
        console.error('Failed to update trip:', error);
        alert('Failed to update trip. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveNewTrip = async () => {
    setIsSaving(true);
    try {
      const tripUpdateData = {
        name: generatedTrip.name,
        date: generatedTrip.date,
        location: generatedTrip.location,
        refLat: parseFloat(generatedTrip.refLat),
        refLng: parseFloat(generatedTrip.refLng),
        startTime: generatedTrip.startTime,
        endTime: generatedTrip.endTime,
        groupSize: generatedTrip.groupSize,
        primaryTransportation: generatedTrip.primaryTransportation,
        budget: generatedTrip.budget,
        tripType: generatedTrip.tripType,
        tripPace: generatedTrip.tripPace,
        notes: generatedTrip.notes,
        activities: generatedTrip.activities
      };

      console.log('Updating trip with data:', tripUpdateData);
      await dispatch(updateTripById(trip.id, tripUpdateData));
      await dispatch(getAllTrips());
      closeModal();
    } catch (error) {
      console.error('Failed to save new trip:', error);
      alert('Failed to save new trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeepOriginal = () => {
    setShowPreview(false);
    setGeneratedTrip(null);
  };

  if (showPreview && generatedTrip) {
    return (
      <div className="edit-trip-modal">
        <div className="modal-header">
          <h2>New Trip Preview</h2>
          <button className="close-button" onClick={closeModal}>&times;</button>
        </div>

        <div className="preview-content">
          <div className="trip-overview">
            <h3>{generatedTrip.name}</h3>
            <p>Location: {generatedTrip.location}</p>
            <p>Date: {generatedTrip.date}</p>
            <p>Time: {generatedTrip.startTime} - {generatedTrip.endTime}</p>
            <p>Budget: ${generatedTrip.budget}</p>
            <p>Group Size: {generatedTrip.groupSize} people</p>
          </div>

          <div className="activities-preview">
            <h4>Activities ({generatedTrip.activities?.length})</h4>
            {generatedTrip.activities?.slice(0, 3).map((activity, index) => (
              <div key={index} className="activity-preview">
                <span className="activity-time">{activity.startTime}</span>
                <div className="activity-info">
                  <h5>{activity.title}</h5>
                  <p>{activity.address}</p>
                </div>
                <span className="activity-cost">${activity.costEstimate}</span>
              </div>
            ))}
            {generatedTrip.activities?.length > 3 && (
              <div className="more-activities">
                +{generatedTrip.activities.length - 3} more activities
              </div>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <button
            className="cancel-button"
            onClick={handleKeepOriginal}
            disabled={isSaving}
          >
            Keep Original Trip
          </button>
          <button
            className="save-button"
            onClick={handleSaveNewTrip}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save New Trip'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-trip-modal">
      <div className="modal-header">
        <h2>Edit Trip</h2>
        <button className="close-button" onClick={closeModal}>&times;</button>
      </div>

      <div className="edit-form">
        <div className="form-group">
          <label>Trip Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

        <div className="time-row">
          <div className="form-group">
            <label>Start Time:</label>
            <select
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            >
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
            </select>
          </div>
          <div className="form-group">
            <label>End Time:</label>
            <select
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            >
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Budget ($):</label>
            <input
              type="number"
              min="0"
              max="9999"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Group Size:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.groupSize}
              onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Trip Pace:</label>
            <select
              value={formData.tripPace}
              onChange={(e) => handleInputChange('tripPace', e.target.value)}
            >
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="packed">Packed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Transportation:</label>
            <select
              value={formData.primaryTransportation}
              onChange={(e) => handleInputChange('primaryTransportation', e.target.value)}
            >
              <option value="walking">Walking</option>
              <option value="public_transit">Public Transit</option>
              <option value="car">Car</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Trip Type:</label>
          <select
            value={formData.tripType}
            onChange={(e) => handleInputChange('tripType', e.target.value)}
          >
            <option value="custom">General Sightseeing</option>
            <option value="cultural">Cultural</option>
            <option value="history">History</option>
            <option value="foodie">Food & Dining</option>
            <option value="friends">Friend Trip</option>
            <option value="nature">Nature & Outdoors</option>
            <option value="adventure">Adventure</option>
            <option value="shopping">Shopping</option>
            <option value="family">Family Friendly</option>
            <option value="romantic">Romantic</option>
          </select>
        </div>
      </div>

      <div className="modal-buttons">
        <button
          className="cancel-button"
          onClick={closeModal}
          disabled={isLoading || isSaving}
        >
          Cancel
        </button>
        <button
          className="save-button"
          onClick={handleSave}
          disabled={isLoading || isSaving}
        >
          {isLoading ? 'Generating...' : isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default TripEditModal;
