/**
 * Environment variables with proper typing
 * Safely accesses environment variables for Zendesk integration
 *
 * NOTE: Only NEXT_PUBLIC_* variables are available on the client side.
 * Server-only variables (ZENDESK_KEY_ID, ZENDESK_SECRET) are only used in API routes.
 * Uses bracket notation to work around TypeScript's strict environment variable typing.
 */

export const env = {
  ZENDESK_API_URL: "https://api.zendesk.com/sunshine-conversations-api/v2",
  get NEXT_PUBLIC_ZENDESK_APP_ID() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for environment variables
    return (process.env as Record<string, string | undefined>)["NEXT_PUBLIC_ZENDESK_APP_ID"]
  },
  get ZENDESK_KEY_ID() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for environment variables
    return (process.env as Record<string, string | undefined>)["ZENDESK_KEY_ID"]
  },
  get ZENDESK_SECRET() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript strict mode requires bracket notation for environment variables
    return (process.env as Record<string, string | undefined>)["ZENDESK_SECRET"]
  },
  /** Check if Zendesk is configured (client-side check - only checks NEXT_PUBLIC variables) */
  isConfiguredClient() {
    return !!this.NEXT_PUBLIC_ZENDESK_APP_ID
  },
}
