const crypto = require('crypto');
const User = require('../../models/auth/User');
const AuthService = require('./AuthService');

class GoogleAuthService {
  static config() {
    const config = process.env;
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REDIRECT_URI) throw new Error('Google OAuth is not configured');
    return config;
  }
  static createState() { return crypto.randomBytes(32).toString('hex'); }
  static getAuthorizationUrl(state) {
    const c = this.config();
    const params = new URLSearchParams({ client_id: c.GOOGLE_CLIENT_ID, redirect_uri: c.GOOGLE_REDIRECT_URI, response_type: 'code', scope: 'openid email profile', state, prompt: 'select_account' });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }
  static async signIn(code) {
    const c = this.config();
    const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: c.GOOGLE_CLIENT_ID, client_secret: c.GOOGLE_CLIENT_SECRET, redirect_uri: c.GOOGLE_REDIRECT_URI, grant_type: 'authorization_code' }) });
    if (!response.ok) throw new Error('Google token exchange failed');
    const tokens = await response.json();
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!profileResponse.ok) throw new Error('Google profile lookup failed');
    const profile = await profileResponse.json();
    if (!profile.email || profile.email_verified !== true) throw new Error('A verified Google email is required');
    let user = await User.findByEmail(profile.email.toLowerCase());
    if (!user) user = await User.createOAuthUser({ name: profile.name || profile.email, email: profile.email.toLowerCase() });
    return { token: await AuthService.generateToken(user.id) };
  }
}
module.exports = GoogleAuthService;
