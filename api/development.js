const { Expo } = require('expo-server-sdk');

module.exports = async (req, res) => {
  try {
    // Initialize Expo SDK
    const expo = new Expo();

    // Set the development URL to the preview domain
    const developmentUrl = 'https://preview.owlby.com';

    // Return the development URL
    res.status(200).json({
      url: developmentUrl,
      status: 'development'
    });
  } catch (error) {
    console.error('Error in development server:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 