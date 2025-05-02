const { Expo } = require('expo-server-sdk');
require('dotenv').config();

module.exports = async (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Initialize Expo SDK
    const expo = new Expo();

    // Set the development URL to the preview or Vercel deployment URL
    const developmentUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://preview.owlby.com';

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
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in development server:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 