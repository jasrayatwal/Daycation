import { csrfFetch } from './csrf';

const LOAD_TRIPS = 'trips/LOAD_TRIPS';
const LOAD_SINGLE_TRIP = 'trips/LOAD_SINGLE_TRIP';
const SET_CURRENT_TRIP = 'trips/SET_CURRENT_TRIP';
const DELETE_TRIP = 'trips/DELETE_TRIP';
const UPDATE_TRIP = 'trips/UPDATE_TRIP';

const loadTrips = (trips) => ({
  type: LOAD_TRIPS,
  payload: trips,
});

const loadSingleTrip = (trip) => ({
  type: LOAD_SINGLE_TRIP,
  payload: trip,
});

const setCurrentTrip = (tripId) => ({
  type: SET_CURRENT_TRIP,
  payload: tripId,
});

const deleteTrip = (tripId) => ({
  type: DELETE_TRIP,
  payload: tripId,
});

const updateTrip = (trip) => ({
  type: UPDATE_TRIP,
  payload: trip,
});

export const getAllTrips = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/trips');

    if (response.ok) {
      const data = await response.json();
      dispatch(loadTrips(data.trips));
      return data;
    }
  } catch (error) {
    console.error('Error getting trips: ', error);
    throw error;
  }
};

export const getTripById = (tripId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/trips/${tripId}`);

    if (response.ok) {
      const trip = await response.json();
      dispatch(loadSingleTrip(trip));
      return trip;
    }
  } catch (error) {
    console.error(`Error getting trip ${tripId}: `, error);
    throw error;
  }
};

export const selectTrip = (tripId) => (dispatch) => {
  dispatch(setCurrentTrip(tripId));
};

export const deleteTripById = (tripId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/trips/${tripId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      dispatch(deleteTrip(tripId));
      return true;
    }
  } catch (error) {
    console.error(`Error deleting trip ${tripId}:`, error);
    throw error;
  }
};

export const updateTripById = (tripId, tripData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripData)
    });

    if (response.ok) {
      const updatedTrip = await response.json();
      dispatch(updateTrip(updatedTrip));
      return updatedTrip;
    }
  } catch (error) {
    console.error(`Error updating trip ${tripId}:`, error);
    throw error;
  }
};

const initialState = {
  allTrips: {},
  currentTrip: null,
  selectedTripId: null
}

const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRIPS: {
      const newState = { ...state, allTrips: {}};
      action.payload.forEach(trip => {
        newState.allTrips[trip.id] = trip;
      });
      return newState;
    }
    case LOAD_SINGLE_TRIP: {
      return {
        ...state,
        currentTrip: action.payload,
        allTrips: {
          ...state.allTrips,
          [action.payload.id]: action.payload
        }
      };
    }
    case SET_CURRENT_TRIP: {
      return {
        ...state,
        selectedTripId: action.payload
      };
    }
    case DELETE_TRIP: {
      const newState = { ...state };
      delete newState.allTrips[action.payload];
      return newState;
    }
    case UPDATE_TRIP: {
      return {
        ...state,
        currentTrip: action.payload,
        allTrips: {
          ...state.allTrips,
          [action.payload.id]: action.payload
        }
      };
    }
    default:
      return state;
  }
};

export default tripsReducer;
