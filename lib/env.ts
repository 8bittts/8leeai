/**
 * Environment variables for Intercom messenger widget
 * NEXT_PUBLIC_INTERCOM_APP_ID is available on client side
 */

export const env = {
  getIntercomAppId: () => {
    // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
    return (process.env as Record<string, string | undefined>)["NEXT_PUBLIC_INTERCOM_APP_ID"]
  },
}
