// Simple test endpoint that doesn't require Vercel authentication
module.exports = async (req, res) => {
  res.status(200).json({
    message: "API is working correctly",
    timestamp: new Date().toISOString()
  });
}; 