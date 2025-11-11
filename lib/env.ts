/**
 * Environment variables with proper typing
 * Safely accesses environment variables for Zendesk integration
 *
 * NOTE: Only NEXT_PUBLIC_* variables are available on the client side.
 * Server-only variables (ZENDESK_KEY_ID, ZENDESK_SECRET) are only used in API routes.
 */

const getEnvVar = (key: string): string | undefined => {
  return (process.env as Record<string, string | undefined>)[key]
}

export const env = {
  ZENDESK_API_URL: "https://api.zendesk.com/sunshine-conversations-api/v2",

  get NEXT_PUBLIC_ZENDESK_APP_ID() {
    return getEnvVar("NEXT_PUBLIC_ZENDESK_APP_ID")
  },

  get ZENDESK_KEY_ID() {
    return getEnvVar("ZENDESK_KEY_ID")
  },

  get ZENDESK_SECRET() {
    return getEnvVar("ZENDESK_SECRET")
  },

  /** Check if Zendesk is configured (client-side check - only checks NEXT_PUBLIC variables) */
  isConfiguredClient() {
    const appId = getEnvVar("NEXT_PUBLIC_ZENDESK_APP_ID")
    return !!appId && appId.length > 0
  },
}
