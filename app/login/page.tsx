"use client"

import LoginForm from "@/components/auth/login-form"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    // NextAuth Google sign-in integration
    // Example: await signIn('google', { callbackUrl: '/dashboard' })
    console.log("Google sign-in initiated")
    // Temporary redirect for demo
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    // NextAuth credentials sign-in integration
    // Example: await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
    console.log("Email sign-in:", { email, password })
    // Temporary redirect for demo
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleContinueAsGuest = () => {
    // Navigate to main site as guest user
    console.log("Continue as guest")
    router.push("/")
  }

  return (
    <LoginForm
      onGoogleSignIn={handleGoogleSignIn}
      onEmailSignIn={handleEmailSignIn}
      onContinueAsGuest={handleContinueAsGuest}
    />
  )
}
