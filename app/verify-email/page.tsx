"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userToken, setUserToken] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please check your email for the correct link.")
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/${verificationToken}`)
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setUserToken(data.token)

        // Store token for automatic login
        if (data.token) {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      } else {
        setStatus("error")
        setMessage(data.message || "Email verification failed")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setStatus("error")
      setMessage("Network error. Please try again later.")
    }
  }

  const handleContinue = () => {
    if (userToken) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  const handleResendEmail = () => {
    router.push("/resend-verification")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            {status === "loading" && <Loader2 className="h-8 w-8 text-white animate-spin" />}
            {status === "success" && <CheckCircle className="h-8 w-8 text-white" />}
            {status === "error" && <XCircle className="h-8 w-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  🎉 Welcome to Hulet Fish Tourism! Your account is now active and ready to use.
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Continue to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  The verification link may have expired or is invalid. You can request a new verification email.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleResendEmail} variant="outline" className="w-full bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
                <Button onClick={() => router.push("/login")} variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">Please wait while we verify your email address...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
