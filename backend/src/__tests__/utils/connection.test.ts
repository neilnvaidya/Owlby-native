// Connection test for Vercel backend
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

describe('Connection Test', () => {
  it('can connect to Vercel backend /api/test', async () => {
    if (typeof fetch !== 'function') {
      console.warn('Skipping fetch test: fetch is not available in this environment');
      return;
    }
    const res = await fetch(`${BACKEND_URL}/api/test`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/API is working/i);
  });
}); 