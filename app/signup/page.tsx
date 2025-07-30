"use client"

import SignUpForm from "@/components/auth/signup-form"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  const handleGoogleSignUp = async () => {
    // NextAuth Google sign-up integration
    console.log("Google sign-up initiated")
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleEmailSignUp = async (data: any) => {
    // NextAuth credentials sign-up integration
    console.log("Email sign-up:", data)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return <SignUpForm onGoogleSignUp={handleGoogleSignUp} onEmailSignUp={handleEmailSignUp} />
}
