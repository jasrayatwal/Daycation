import { useState } from 'react';
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import './TripSearchBar.css';

function TripSearchBar({ onSearch }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceChange = async (e) => {
    const place = e.target.value;

    if (!place || !place.formattedAddress) return;

    try {
      setIsLoading(true);
      console.log('Place selected:', place);

      if (onSearch) {
        console.log('Calling search with:', place.formattedAddress);
        await onSearch(place.formattedAddress, place);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="trip-search-bar">
      <div className="search-input-container">
        <PlacePicker
          placeholder="Where would you like to go?"
          type="(cities)"
          onPlaceChange={handlePlaceChange}
          className="place-picker-input"
        />

        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripSearchBar;
