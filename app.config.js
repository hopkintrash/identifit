// Expo config – delegates to config/expo for organization
const config = require('./config/expo/app.json');

// When building for demo (served from /app/), set baseUrl so routing & assets work
if (process.env.DEMO_BUILD === 'true') {
  config.expo.experiments = config.expo.experiments || {};
  config.expo.experiments.baseUrl = '/app';
}

module.exports = config;
