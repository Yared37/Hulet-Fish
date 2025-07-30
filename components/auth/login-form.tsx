"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, MapPin } from "lucide-react"
import Image from "next/image"

interface LoginFormProps {
  onGoogleSignIn?: () => void
  onEmailSignIn?: (email: string, password: string) => void
  onContinueAsGuest?: () => void
}

export default function LoginForm({ onGoogleSignIn, onEmailSignIn, onContinueAsGuest }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onEmailSignIn?.(email, password)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await onGoogleSignIn?.()
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-green-950 dark:via-blue-950 dark:to-green-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <Image
                  src="/images/hulet-fish-logo.png"
                  alt="Hulet Fish Logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold ethiopian-text-gradient">Hulet Fish</h1>
            <p className="text-muted-foreground text-sm">Discover Authentic Ethiopian Experiences</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Community-Based Tourism Platform</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to explore authentic Ethiopian tours and experiences
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 ${errors.email ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary p-0">
                Forgot your password?
              </Button>
            </div>

            <Separator />

            {/* Continue as Guest */}
            <Button
              onClick={onContinueAsGuest}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200"
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="text-xs p-0 h-auto font-medium">
                Sign up for free
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <div className="flex justify-center items-center gap-4">
            <Button variant="link" className="text-xs p-0 h-auto">
              Help Center
            </Button>
            <span>•</span>
            <Button variant="link" className="text-xs p-0 h-auto">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
