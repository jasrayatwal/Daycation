const express = require('express');
const { generateObject } = require('ai');
const { google } = require('@ai-sdk/google');
const { requireAuth } = require('../../utils/auth');
const { aiKey } = require('../../config');
const { TripSchema } = require('../../schemas/tripSchema');

const router = express.Router();

const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: data.results[0].formatted_address
      }
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

//ai generation of trip & activities
router.post('/generate-trip', requireAuth, async (req, res, next) => {
  try {
    const {location, requirements = {}, coordinates} = req.body;

    if (!location) {
      return res.status(400).json({
        message: "Location is required"
      })
    }

    console.log('Generating trip for:', location, 'with preferences:', requirements, 'coordinates:', coordinates);

    const prompt = `
      You are an expert travel planning assistant. Generate a detailed day trip plan for ${location}.

      User preferences:
      - Date: ${requirements.date}
      - Budget: ${requirements.budget} in dollars
      - Group size: ${requirements.groupSize || 2} people
      - Start Time: ${requirements.startTime || '9:00'}
      - End Time: ${requirements.endTime || '18:00'}
      - Trip pace: ${requirements.tripPace || 'balanced'} (MUST be one of: relaxed, balanced, packed)
      - Trip type: ${requirements.tripType || 'general'} (MUST be one of: family, friends, shopping, nature, foodie, adventure, cultural, history, romantic, custom)
      - Transportation: ${requirements.transportation || 'mixed'} (walking, public_transit, car, mixed)

      You must include ALL of these fields in your trip response:
      - name: Trip name
      - date: ${requirements.date} format: 'YYYY-MM-DD'
      - location: ${location}
      - refLat: Latitude coordinate
      - refLng: Longitude coordinate
      - startTime: Trip start time (${requirements.startTime || '09:00:00'})
      - endTime: Trip end time (${requirements.endTime || '18:00:00'})
      - groupSize: ${requirements.groupSize || 2}
      - primaryTransportation: ${requirements.transportation || 'mixed'}
      - budget: ${requirements.budget}
      - tripPace: ${requirements.tripPace || 'balanced'} (MUST be one of: relaxed, balanced, packed)
      - tripType: ${requirements.tripType || 'general'} (MUST be one of: family, friends, shopping, nature, foodie, adventure, cultural, history, romantic, custom)
      - notes: Brief trip description
      - activities: Array of activities

      Create a realistic, geographically logical day trip plan. Activities should be:
      1. In the given city location provided and in a sensible travel order with sensible locations based on the transportation type(s).
      2. Time-appropriate (restaurants open during meal times, attractions during operating hours
      3. Include a mix of must-see attractions, local food, and authentic experiences
      4. Realistic for the specified duration and budget
      5. Include specific, real addresses
      6. Factors in the trip type. i.e. If for family, include family events. If for shopping include shopping centers/malls etc. If foodie, then places that are popular for eating or activites exploring the areas food or places about food.
      7. Appropriate amount of activities based on the Trip pace. i.e. If packed, then multiple activities with the least amount of appropriate time at each location. If relaxed, a comfortable amount of time between activities. If balanced, not too long at activities and not too short, and not too many actitivties compared to packed, and a bit more than relaxed.
      8. Ensure the total estimated budget aligns with the activities
      9. Budget breakdown should add up correctly

      IMPORTANT TIME REQUIREMENTS:
      - ALL activities must have both startTime AND endTime in HH:MM:SS format (like "09:00:00", "14:30:00")
      - Calculate realistic durations for each activity type based on the trip pace:
        * Meals: 30-90 minutes, For reference: Packed(30 mins), Balanced (60 mins), Relaxed (90 mins)
        * Museums/attractions: 60-120 minutes For reference: Packed (60 mins), Balanced (90 mins), Relaxed (120 mins)
        * Shopping: 60-90 minutes For reference: Packed (60 mins), Balanced (75 mins), Relaxed (90 mins)
        * Outdoor activities: 90-180 minutes For reference: Packed (90 mins), Balanced (120 mins), Relaxed (180 mins)
        * Walking/sightseeing: 30-60 minutes For reference: Packed (30 mins), Balanced (45 mins), Relaxed (60 mins)
        * Transportation: 10-30 minutes For reference: Packed (10 mins), Balanced (20 mins), Relaxed (30 mins)
      - Ensure activities don't overlap in time, create a realistic buffer between activities. i.e. end time of activity is 10AM, based on transportation type the time of travel to next activity is 15 minutes, then next activity start time is 10:15AM
      - Leave 15-30 minutes between activities for travel time

      You must include ALL of these fields in each activity response:
      - title: Exact name of the place/activity
      - orderNumber: Order of the activity in relation to the planned day trip, this tells the user which activity is next in the plan. (1,2,3, etc.)
      - type: Activity type (MUST be one of: place, meal, event, transport, break, shopping, outdoor, cultural, history, custom)
      - address: VERY SPECIFIC street address that someone would type into Google Maps (street number, street name, city, state/country) - IMPORTANT: if activity type is transport, use the same address from the previous activity (if this activity orderNumber is 3 and transport type then same address as activity 2 (orderNumber 2)).
      - lat: 0 (we will geocode the address for accurate coordinates)
      - lng: 0 (we will geocode the address for accurate coordinates)
      - startTime: Activity start time in HH:MM:SS format (like "09:00:00", "14:30:00")
      - endTime: Activity end time in HH:MM:SS format (calculated from start time + realistic duration). (a reasonable amount of time for that activity, factor in the trip pace)
      - durationMin: Duration in minutes as a number
      - transportType: Transportation method (MUST be one of: walk, transit, drive, ridehail) - leave empty for non-transport activities
      - costEstimate: Cost per person as a number (minimum 0)
      - notes: Brief description with helpful visitor tips and what to do there

      IMPORTANT:
      - Every activity MUST have all required fields. Do not omit any fields except transportType for non-transport activities.
      - Don't make the first activity food unless the trip type is "foodie".
      - Do not make the first and last activity a transportation activity. Only include transport activities if needed to get to the next activity.

      CRITICAL: Focus on providing EXACT, SPECIFIC addresses that exist and can be found on Google Maps. Examples:
      - "24 Willie Mays Plaza, San Francisco, CA 94107" (not just "Willie Mays Plaza")
      - "357 Riverside Drive, Memphis, TN 38103" (not just "Tom Lee Park")
      - "100 Pomeroy Ave, Pismo Beach, CA 93449" (not just "Pismo Beach Pier")

      For each location, provide the complete street address including:
      1. Street number
      2. Street name
      3. City
      4. State
      5. ZIP code (if known)

      Generate realistic activities with real, mappable addresses for ${location}.

      If a location is something like a beach/park with no mappable address provide the best/closest mappable address for that location/activity.

      Generate a complete itinerary where every activity has a clear start and end time. Include a time buffer between activities for a reasonable travel time based on the method of transportation that will be used. (${requirements.transportation || 'mixed'} in this case).
      `;

    console.log('Sending prompt to AI...');

    const { object } = await generateObject({
      model: google('models/gemini-2.5-flash'),
      prompt: prompt,
      schema: TripSchema,
    });

    console.log('Received AI response:', JSON.stringify(object, null, 2));

    if (!object) {
      throw new Error('AI generated invalid trip data');
    }

    console.log('Geocoding activity addresses...'); //ai produces inaccurate lat, lng, fix using geocoding to get best possible latlng for marker
    const geocodedActivities = await Promise.all(
      object.activities.map(async (activity) => {
        console.log(`Geocoding activity: "${activity.address}"`);
        const geocoded = await geocodeAddress(activity.address);

        if (geocoded) {
          console.log(`Geocoded successfully:`, geocoded);
          return {
            ...activity,
            lat: geocoded.lat,
            lng: geocoded.lng,
            address: geocoded.formattedAddress
          };
        } else {
          console.log(`Failed to geocode address: ${activity.address}`);

          return {
            ...activity
          }
        }
      })
    );

    //for trip center marker
    const refLat = coordinates?.lat || object.refLat;
    const refLng = coordinates?.lng || object.refLng;

    const tripData = {
      ...object,
      refLat: refLat,
      refLng: refLng,
      activities: geocodedActivities
    }

    console.log('Final trip data with geocoded coordinates:', JSON.stringify(tripData));

    res.json({tripData});

  } catch (error) {
    console.error('Trip generation error:', error);

    if (error.name === 'ZodError') {
      console.error('Zod validation errors:', error.errors);
      return res.status(400).json({
        message: "Generated trip data is invalid",
        errors: error.errors,
        details: "response doesn't match zoc expected format"
      })
    }

    next(error);
  }
})

module.exports = router;
