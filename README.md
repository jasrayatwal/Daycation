# [Daycation](https://daycation-3t2f.onrender.com/)
An AI-powered day trip planner that generates personalized one-day itineraries for cities worldwide. Built as a full-stack project with interactive maps, user preferences, and AI integration.

---

## Features
- User Authentication
- CRUD for Trips & Activities – create, edit, regenerate, and delete trips or activities.  
- AI-Powered Itinerary Generation – based on:  
  - Location  
  - Date & time range  
  - Trip pace (relaxed, balanced, packed)  
  - Trip type (family, foodie, history, cultural, friends, romantic, etc.)  
  - Budget & group size  
- Interactive Map UI – powered by Google Maps & Places API with:  
  - Autocomplete city search
  - Clickable trip markers with hoverable trip details
  - Activity markers with itinerary list view

---

## Tech Stack
**Frontend**  
- React, Redux, Vite  
- vis.gl/react-google-maps
- Google Extended Component Library

**Backend**  
- Express.js (Node.js)  
- Sequelize ORM  
- PostgreSQL

**APIs / AI**  
- Google Maps API  
- Google Places API  
- Vercel AI SDK
