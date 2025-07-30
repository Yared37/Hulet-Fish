import Link from "next/link"
import ChatWidget from "@/components/chat/chat-widget"

export function SiteFooter() {
  // In a real app, get this from auth context
  const isLoggedIn = true
  const currentUserId = "user_123"
  const currentUserRole = "tourist" as const

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2024 Hulet Fish Tourism. All rights reserved.
          </p>
        </div>
        <div className="flex items-center">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>

        {/* Chat Widget */}
        {isLoggedIn && <ChatWidget currentUserId={currentUserId} currentUserRole={currentUserRole} />}
      </div>
    </footer>
  )
}
