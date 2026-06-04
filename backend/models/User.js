// This file is kept for backward compatibility but is not used in the Supabase version.
// User data is accessed directly through the Supabase client in the routes.
// Authentication is handled via Supabase Auth (to be implemented).

module.exports = {
  // Legacy Mongoose model - not used
  // All user operations are handled via Supabase client
  // Password hashing logic moved to userSeed.js for seeding purposes only
};
