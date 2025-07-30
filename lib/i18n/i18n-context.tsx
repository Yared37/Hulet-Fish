"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Language = "en" | "am" | "or"
type Currency = "USD" | "EUR" | "GBP" | "ETB"

interface I18nContextType {
  language: Language
  setLanguage: (language: Language) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (amount: number) => string
  t: (key: string) => string
  dir: () => "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const exchangeRates = {
  ETB: 1,
  USD: 0.018,
  EUR: 0.015,
  GBP: 0.013,
}

const currencySymbols = {
  ETB: "ETB",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

// Language direction mapping
const languageDirections: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  am: "ltr", // Amharic is actually left-to-right
  or: "ltr", // Oromo is left-to-right
}

// Import translations from separate file
import { translations } from "./translations"

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [currency, setCurrency] = useState<Currency>("ETB") // Default to ETB

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("huletfish-language") as Language
      const savedCurrency = localStorage.getItem("huletfish-currency") as Currency

      if (savedLanguage && ["en", "am", "or"].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      }
      if (savedCurrency && ["ETB", "USD", "EUR", "GBP"].includes(savedCurrency)) {
        setCurrency(savedCurrency)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("huletfish-language", language)
      localStorage.setItem("huletfish-currency", currency)

      // Set the dir attribute on the html element
      document.documentElement.dir = languageDirections[language]
      document.documentElement.lang = language
    }
  }, [language, currency])

  // Get text direction based on current language
  const dir = (): "ltr" | "rtl" => {
    return languageDirections[language]
  }

  // Translation function that navigates nested objects
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    // Navigate through the nested object
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        // If key not found, try English as fallback
        let fallback = translations.en
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk]
          } else {
            return key // Return the key if not found in fallback
          }
        }
        return typeof fallback === "string" ? fallback : key
      }
    }

    return typeof value === "string" ? value : key
  }

  const formatPrice = (amount: number): string => {
    const convertedAmount = amount * exchangeRates[currency]
    const symbol = currencySymbols[currency]

    if (currency === "ETB") {
      return `${convertedAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} ${symbol}`
    } else {
      return `${symbol}${convertedAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    }
  }

  const value: I18nContextType = {
    language,
    setLanguage,
    currency,
    setCurrency,
    formatPrice,
    t,
    dir,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within a I18nProvider")
  }
  return context
}
