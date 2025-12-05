"use client"

import { useEffect, useState } from "react"

const CORRECT_PASSWORD = "booya"

interface PasswordGateProps {
  title: string
  sessionKey: string
  children: React.ReactNode
}

/**
 * Shared Password Gate Component
 * Terminal-styled authentication gate for all experiments
 * Uses main site brand colors (black bg, green-500 text)
 */
export function PasswordGate({ title, sessionKey, children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(sessionKey)
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [sessionKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(sessionKey, "true")
      setError("")
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-green-500 text-xl font-mono mb-2">{title}</h1>
          <p className="text-green-500/70 text-sm font-mono mb-8">Enter password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              // biome-ignore lint/a11y/noAutofocus: Password gate requires immediate focus
              autoFocus={true}
              className="w-full bg-black text-green-500 border border-green-500 px-4 py-3 font-mono focus:outline-none focus:border-green-400"
            />

            {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-500 text-black px-4 py-3 font-mono font-bold hover:bg-green-400 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
