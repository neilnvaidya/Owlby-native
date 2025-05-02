const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in your environment variables.');
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

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

    // Handle POST request for authentication
    if (req.method === 'POST') {
      const { action, email, password, provider } = req.body;

      switch (action) {
        case 'sign-in': {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) return res.status(400).json({ error: error.message });
          return res.status(200).json(data);
        }
        
        case 'sign-up': {
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (error) return res.status(400).json({ error: error.message });
          return res.status(200).json(data);
        }
        
        case 'sign-out': {
          const { error } = await supabase.auth.signOut();
          
          if (error) return res.status(400).json({ error: error.message });
          return res.status(200).json({ message: 'Signed out successfully' });
        }
        
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    }

    // Handle GET request for session check
    if (req.method === 'GET') {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 