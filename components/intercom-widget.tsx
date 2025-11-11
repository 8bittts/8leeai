"use client"

import { useEffect } from "react"

interface WindowWithIntercom extends Window {
  Intercom?: (config: { app_id: string }) => void
}

export function IntercomWidget() {
  useEffect(() => {
    // biome-ignore lint/complexity/useLiteralKeys: Next.js environment variable inlining requires bracket notation
    const appId = (process.env as Record<string, string | undefined>)["NEXT_PUBLIC_INTERCOM_APP_ID"]

    if (!appId) {
      console.warn("Intercom app ID not configured")
      return
    }

    // Load Intercom messenger script
    const script = document.createElement("script")
    script.async = true
    script.src = "https://js.intercom-static.com/frame.js"

    const onLoadHandler = () => {
      // Safe to access window here - useEffect only runs on client
      const win = window as WindowWithIntercom
      if (win.Intercom) {
        win.Intercom({
          app_id: appId,
        })
      }
    }

    script.addEventListener("load", onLoadHandler)
    document.body.appendChild(script)

    return () => {
      script.removeEventListener("load", onLoadHandler)
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return null
}
