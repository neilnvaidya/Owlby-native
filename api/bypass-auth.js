// Simple bypass auth endpoint
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
    
    // Current deployment URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://owlby-native-i1tb9xow6-neilnvaidyas-projects.vercel.app';

    // Return API info
    res.status(200).json({
      url: baseUrl,
      status: "production",
      apiEndpoints: {
        auth: `${baseUrl}/api/auth`,
        test: `${baseUrl}/api/test`
      },
      timestamp: new Date().toISOString(),
      message: "Public API endpoint - no authentication required"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
