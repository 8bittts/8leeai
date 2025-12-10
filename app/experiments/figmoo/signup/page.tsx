"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FigmooHeader } from "../components/figmoo-header"

/**
 * Figmoo Sign Up Page
 * Clean signup flow with Google and email options
 * All actions redirect to hire-eight page
 */
export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push("/experiments/figmoo/hire-eight")
  }

  const handleGoogleSignIn = () => {
    router.push("/experiments/figmoo/hire-eight")
  }

  return (
    <div className="min-h-screen bg-figmoo-bg">
      <FigmooHeader />

      <main id="main-content" className="mx-auto max-w-md px-4 py-16">
        <Card className="border-figmoo-border bg-white shadow-sm">
          <CardContent className="p-8">
            <h1 className="mb-2 text-2xl font-bold text-figmoo-text">Sign up for Figmoo</h1>
            <p className="mb-8 text-figmoo-muted">Get started for free. No credit card required.</p>

            {/* Google Sign In */}
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full justify-center gap-3 rounded-lg border-figmoo-border py-6 text-figmoo-text hover:bg-figmoo-surface"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-figmoo-muted">
                or
              </span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-figmoo-text">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="h-12 rounded-lg border-figmoo-border bg-white px-4 text-figmoo-text placeholder:text-figmoo-muted focus:border-figmoo-accent focus:ring-figmoo-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-figmoo-text">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  minLength={8}
                  className="h-12 rounded-lg border-figmoo-border bg-white px-4 text-figmoo-text placeholder:text-figmoo-muted focus:border-figmoo-accent focus:ring-figmoo-accent"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-figmoo-accent py-6 text-base font-medium text-white hover:bg-figmoo-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-figmoo-muted">
              By clicking the "Create Account" or "Continue with Google" button, you agree to the{" "}
              <Link
                href="/experiments/figmoo"
                className="font-medium text-figmoo-text hover:text-figmoo-accent"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/experiments/figmoo"
                className="font-medium text-figmoo-text hover:text-figmoo-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-figmoo-muted">
              Already have an account?{" "}
              <Link
                href="/experiments/figmoo"
                className="font-medium text-figmoo-text hover:text-figmoo-accent"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
