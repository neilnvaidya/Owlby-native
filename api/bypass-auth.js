// This is a public endpoint that doesn't require Vercel authentication
const { Expo } = require('expo-server-sdk');
require('dotenv').config();

module.exports = async (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Initialize Expo SDK
    const expo = new Expo();

    // Set the development URL to the current Vercel deployment URL
    const developmentUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://owlby-native-pnp4wef85-neilnvaidyas-projects.vercel.app';

    // Get environment
    const environment = process.env.NODE_ENV || 'development';

    // Return the development URL and configuration
    res.status(200).json({
      url: developmentUrl,
      status: environment,
      apiEndpoints: {
        auth: `${developmentUrl}/api/auth`,
        users: `${developmentUrl}/api/users`,
        sessions: `${developmentUrl}/api/sessions`
      },
      serverVersion: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      message: "This is a public API endpoint that bypasses authentication"
    });
  } catch (error) {
    console.error('Error in bypass-auth server:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
