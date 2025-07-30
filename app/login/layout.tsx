import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Hulet Fish",
  description: "Sign in to your Hulet Fish account to discover authentic Ethiopian experiences",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
