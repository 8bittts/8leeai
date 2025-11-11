/**
 * Environment variables with proper typing
 * Safely accesses environment variables for Zendesk integration
 * Uses bracket notation for TypeScript strict property access compatibility
 */

export const env = {
  ZENDESK_API_URL: "https://api.zendesk.com/sunshine-conversations-api/v2",
  get NEXT_PUBLIC_ZENDESK_APP_ID() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation
    return (process.env as Record<string, string | undefined>)["NEXT_PUBLIC_ZENDESK_APP_ID"]
  },
  get ZENDESK_KEY_ID() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation
    return (process.env as Record<string, string | undefined>)["ZENDESK_KEY_ID"]
  },
  get ZENDESK_SECRET() {
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation
    return (process.env as Record<string, string | undefined>)["ZENDESK_SECRET"]
  },
}
