"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import type { ReactNode } from "react"

interface LanguageDirectionWrapperProps {
  children: ReactNode
}

export function LanguageDirectionWrapper({ children }: LanguageDirectionWrapperProps) {
  const { dir } = useI18n()

  return (
    <div dir={dir()} className="transition-all duration-300">
      {children}
    </div>
  )
}
