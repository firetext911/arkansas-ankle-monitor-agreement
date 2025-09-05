import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68af56ee3e6ef99fc977b500", 
  requiresAuth: true // Ensure authentication is required for all operations
});
