module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  dbFile: process.env.DB_FILE,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  googleMapsAPIKey: process.env.MAPS_API_KEY,
  dashboardMapId: process.env.DASHBOARD_MAP_ID,
  landingMapId: process.env.DEFAULT_MAP_ID,
  aiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
};
