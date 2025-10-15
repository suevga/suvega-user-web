export const envConfig = {
  clerkPulishableKey: String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
  apiUrl: String(import.meta.env.VITE_PUBLIC_API_URL),
  googleApiKey: String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
  formspreeApiKey: String(import.meta.env.VITE_FORMSPREE_ENDPOINT),
  clerkTestPublishableKey: String(import.meta.env.VITE_CLERK_TEST_PUBLISHABLE_KEY),
};