"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Check, Globe } from "lucide-react"
import { motion } from "framer-motion"

// Language data with proper codes, names and flags
const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", direction: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", direction: "ltr" },
  { code: "or", name: "Afaan Oromoo", nativeName: "Afaan Oromoo", flag: "🇪🇹", direction: "ltr" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useI18n()

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 gap-2 border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        >
          <Globe className="h-4 w-4" />
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="font-medium">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "am" | "or")}
            className="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">{lang.name}</span>
              </div>
            </div>
            {language === lang.code && (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Check className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector
