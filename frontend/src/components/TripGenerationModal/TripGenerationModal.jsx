import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { generateTrip, saveGeneratedTrip } from '../../store/ai';
import { getAllTrips } from '../../store/trips';
import './TripGenerationModal.css';

function TripGenerationModal({searchLocation, placeData}) {
  console.log('TripGenerationModal rendered with searchLocation:', searchLocation);

  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const [requirements, setRequirements] = useState({ //default for now, will setrequirements in modal
    date: '',
    startTime: '09:00',
    endTime: '18:00',
    budget: 50,
    groupSize: 2,
    tripPace: 'balanced',
    tripType: 'general',
    transportation: 'mixed'
  })

  const [isSaving, setIsSaving] = useState(false);

  const {isLoading, generatedTrip} = useSelector(state => state.ai);

  const handleGenerateTrip = async () => {
    try {
      const coordinates = placeData?.location ? {lat: placeData.location.lat, lng: placeData.location.lng} : null; //check after changing from using autocomplete coordinates to geocoding results

      await dispatch(generateTrip(searchLocation, requirements, coordinates));
    } catch (error) {
      console.error('Failed to generate trip:', error);
    }
  }

  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      await dispatch(saveGeneratedTrip(generatedTrip));
      await dispatch(getAllTrips());
      closeModal();
    } catch (error) {
      console.error('Failed to save trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  const handleGenerateNew = () => {
    dispatch({type: 'ai/CLEAR_GENERATED_TRIP'});
  }

  if (generatedTrip) { //show trip summary
    return (
      <div className="trip-generation-modal">
        <div className="modal-header">
          <h2>Your Trip Overview...</h2>
          <button className="close-button" onClick={closeModal}>&times;</button>
        </div>

        <div className="generated-trip-content">
          <div className="trip-overview">
            <h3>{generatedTrip.name}</h3>
            <p>Location: {generatedTrip.location}</p>
            <p>Start Time: {generatedTrip.startTime}</p>
            <p>End Time: {generatedTrip.endTime}</p>
            <p>Budget: ${generatedTrip.budget}</p>
            <p className="description">{generatedTrip.notes}</p>
          </div>

          <div className="activities-preview">
            <h4>Activities</h4>
            <div className="activities-list">
              {generatedTrip.activities?.slice(0, 3).map((activity, index) => ( //show preview
                <div key={index} className="activity-preview">
                  <span className="activity-time">{activity.startTime}</span>
                  <div className="activity-info">
                    <h5>{activity.title}</h5>
                    <p>{activity.address}</p>
                    <p className="activity-description">{activity.notes}</p>
                  </div>
                  <span className="activity-cost">${activity.costEstimate}</span>
                </div>
              ))}
              {generatedTrip.activities?.length > 3 && (
                <div className="more-activities">
                  +{generatedTrip.activities.length - 3} more activities, save to view all activites...
                </div>
              )}
            </div>
          </div>

          <div className="trip-generation-modal-buttons">
            <button
              className="save-trip-button"
              onClick={handleSaveTrip}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save This Trip'}
            </button>
            <button
              className="generate-new-button"
              onClick={handleGenerateNew}
            >
              Generate New Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-generation-modal">
      <div className="modal-header">
        <h2>Generate Trip for {searchLocation}!</h2>
      </div>

      <div className="preferences-form">

        <div className="form-section">
          <div className="section-fields">
            <div className="form-group">
              <label>Date:</label>
              <input type="date" value={requirements.date} onChange={(e) => setRequirements(prev => ({ ...prev, date: e.target.value }))} />
            </div>
            <div className="time-row">
              <div className="form-group">
                <label>Start:</label>
                <select value={requirements.startTime} onChange={(e) => setRequirements(prev => ({ ...prev, startTime: e.target.value }))}>
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
              <div className="form-group">
                <label>End:</label>
                <select value={requirements.endTime} onChange={(e) => setRequirements(prev => ({ ...prev, endTime: e.target.value }))}>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-fields budget-group-row">
            <div className="form-group">
              <label>Budget ($):</label>
              <input type="number" min="0" max="9999.99"
                value={requirements.budget} onChange={(e) => setRequirements(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label>Group Size:</label>
              <input type="number" min="1" max="20"
                value={requirements.groupSize} onChange={(e) => setRequirements(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-fields experience-row">
            <div className="form-group">
              <label>Trip Pace:</label>
              <select value={requirements.tripPace} onChange={(e) => setRequirements(prev => ({ ...prev, tripPace: e.target.value }))}>
                <option value="relaxed">Relaxed</option>
                <option value="balanced">Balanced</option>
                <option value="packed">Packed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transportation:</label>
              <select value={requirements.transportation} onChange={(e) => setRequirements(prev => ({ ...prev, transportation: e.target.value }))}>
                <option value="walking">Walking</option>
                <option value="public_transit">Public Transit</option>
                <option value="car">Car</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Trip Type:</label>
            <select value={requirements.tripType} onChange={(e) => setRequirements(prev => ({ ...prev, tripType: e.target.value }))}>
              <option value="general">General Sightseeing</option>
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
      </div>

      <div className="trip-generation-modal-buttons">
        <button
          className="generate-button"
          onClick={handleGenerateTrip}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate My Trip'}
        </button>
      </div>
    </div>
  );
}

export default TripGenerationModal;
