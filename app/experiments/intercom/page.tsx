"use client"

import { useEffect, useState } from "react"
import { IntercomChatContainer } from "./components/intercom-chat-container"

const CORRECT_PASSWORD = "booya"
const SESSION_KEY = "intercom_auth"

/**
 * Intercom Intelligence Portal
 * A terminal-styled chat interface for querying all Intercom APIs
 * Password protected (password: booya)
 */
export default function IntercomPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check sessionStorage on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SESSION_KEY)
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, "true")
      setError("")
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  // Show nothing while checking session
  if (isLoading) {
    return null
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-black border border-green-500 p-8 rounded">
            <h1 className="text-green-500 text-2xl mb-6 font-mono text-center">
              Intercom Intelligence Portal
            </h1>
            <p className="text-green-500 text-sm mb-6 font-mono text-center opacity-70">
              Enter password to access
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  // biome-ignore lint/a11y/noAutofocus: Password input should auto-focus for better UX on password gate
                  autoFocus={true}
                  className="w-full bg-black text-green-500 border border-green-500 px-4 py-2 font-mono focus:outline-none focus:border-green-400"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-mono text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-green-500 text-black px-4 py-2 font-mono font-bold hover:bg-green-400 transition-colors"
              >
                Access
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Show main interface if authenticated
  return <IntercomChatContainer />
}
