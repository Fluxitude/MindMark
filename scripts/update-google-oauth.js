#!/usr/bin/env node

/**
 * Script to update Google OAuth credentials in Supabase
 * Usage: node update-google-oauth.js <client_id> <client_secret>
 */

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node update-google-oauth.js <client_id> <client_secret>');
  console.error('');
  console.error('Example:');
  console.error('node update-google-oauth.js "123456789-abc123.apps.googleusercontent.com" "GOCSPX-your_client_secret"');
  process.exit(1);
}

const [clientId, clientSecret] = args;

console.log('🔧 Updating Google OAuth credentials in Supabase...');
console.log('');
console.log('You need to run this curl command:');
console.log('');
console.log(`curl -X PATCH \\
  "https://api.supabase.com/v1/projects/dleomfjzipqggnavakql/config/auth" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "external_google_client_id": "${clientId}",
    "external_google_secret": "${clientSecret}"
  }'`);
console.log('');
console.log('Or use the Supabase dashboard:');
console.log('1. Go to https://supabase.com/dashboard/project/dleomfjzipqggnavakql/auth/providers');
console.log('2. Enable Google provider');
console.log('3. Enter your Client ID and Secret');
console.log('4. Set redirect URL to: https://dleomfjzipqggnavakql.supabase.co/auth/v1/callback');
console.log('');
console.log('✅ After updating, your Google OAuth should work!');
