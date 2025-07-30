import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/lib/i18n/i18n-context"
import { LanguageDirectionWrapper } from "@/components/language-direction-wrapper"

export const metadata: Metadata = {
  title: "Hulet Fish Tourism",
  description: "Authentic Ethiopian cultural experiences with local host families",
    generator: 'v0.dev'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <LanguageDirectionWrapper>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
              <Toaster />
            </LanguageDirectionWrapper>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
