import { csrfFetch } from './csrf';
import { z } from 'zod';

const ActivitySchema = z.object({
  title: z.string(),
  orderNumber: z.number().min(1),
  type: z.string(),
  address: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  durationMin: z.number(),
  transportType: z.string().optional(),
  costEstimate: z.number().optional(),
  notes: z.string().optional()
});

const TripDataSchema = z.object({
  name: z.string(),
  date: z.string(),
  location: z.string(),
  refLat: z.number(),
  refLng: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  groupSize: z.number(),
  primaryTransportation: z.string(),
  budget: z.number(),
  tripPace: z.string(),
  tripType: z.string(),
  notes: z.string().optional(),
  activities: z.array(ActivitySchema),
  estimatedDuration: z.string()
});

const SET_LOADING = 'ai/SET_LOADING';
const SET_GENERATED_TRIP = 'ai/SET_GENERATED_TRIP';
const SET_ERROR = 'ai/SET_ERROR';
const CLEAR_GENERATED_TRIP = 'ai/CLEAR_GENERATED_TRIP';

const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

const setGeneratedTrip = (tripData) => ({
  type: SET_GENERATED_TRIP,
  payload: tripData
});

const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

const clearGeneratedTrip = () => ({
  type: CLEAR_GENERATED_TRIP
});

export const generateTrip = (location, requirements = {}, coordinates = null) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await csrfFetch('/api/ai/generate-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({location, requirements, coordinates})
    });

    if (response.ok) {
      const data = await response.json();

      try {
        const validatedTrip = TripDataSchema.parse(data.tripData);
        dispatch(setGeneratedTrip(validatedTrip));
        return validatedTrip;
      } catch (validationError) {
        console.error('Trip data validation failed:', validationError);
        throw new Error('Generated trip data is invalid');
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate trip');
    }
  } catch (error) {
    console.error('Error generating trip:', error);
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
}

export const saveGeneratedTrip = (generatedTripData) => async (dispatch) => {
  try {
    const tripData = {
      name: generatedTripData.name,
      date: generatedTripData.date,
      location: generatedTripData.location,
      refLat: generatedTripData.refLat,
      refLng: generatedTripData.refLng,
      startTime: generatedTripData.startTime,
      endTime: generatedTripData.endTime,
      groupSize: generatedTripData.groupSize,
      primaryTransportation: generatedTripData.primaryTransportation,
      budget: generatedTripData.budget,
      tripType: generatedTripData.tripType,
      tripPace: generatedTripData.tripPace,
      notes: generatedTripData.notes,
      activities: generatedTripData.activities
    };

    const response = await csrfFetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripData)
    });

    if (response.ok) {
      const savedTrip = await response.json();
      dispatch(clearGeneratedTrip());
      return savedTrip;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save trip');
    }
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
}

export const clearTrip = () => (dispatch) => {
  dispatch(clearGeneratedTrip());
};

const initialState = {
  isLoading: false,
  generatedTrip: null
};

const aiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case SET_GENERATED_TRIP: {
      return {
        ...state,
        generatedTrip: action.payload
      };
    }
    case CLEAR_GENERATED_TRIP: {
      return {
        ...state,
        generatedTrip: null
      };
    }
    default:
      return state;
  }
};

export default aiReducer;
