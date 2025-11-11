/**
 * Environment variables with proper typing
 * Safely accesses environment variables for Intercom integration
 *
 * NOTE: INTERCOM_ACCESS_TOKEN is server-only and only used in API routes.
 */

const getEnvVar = (key: string): string | undefined => {
  return (process.env as Record<string, string | undefined>)[key]
}

export const env = {
  INTERCOM_API_URL: "https://api.intercom.io",

  get INTERCOM_ACCESS_TOKEN() {
    return getEnvVar("INTERCOM_ACCESS_TOKEN")
  },

  /** Check if Intercom is configured */
  isConfigured() {
    const token = getEnvVar("INTERCOM_ACCESS_TOKEN")
    return !!token && token.length > 0
  },
}
