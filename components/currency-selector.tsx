"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n/i18n-context"
import { DollarSign } from "lucide-react"

const currencies = [
  { code: "ETB", name: "Ethiopian Birr", symbol: "ETB", flag: "🇪🇹" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
]

export function CurrencySelector() {
  const { currency, setCurrency } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <span className="mr-1">{currentCurrency.flag}</span>
          <span className="hidden sm:inline">{currentCurrency.symbol}</span>
          <DollarSign className="h-4 w-4 ml-1 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => {
              setCurrency(curr.code as any)
              setIsOpen(false)
            }}
            className={`flex items-center space-x-2 ${
              currency === curr.code ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" : ""
            }`}
          >
            <span>{curr.flag}</span>
            <span className="flex-1">{curr.name}</span>
            <span className="text-sm text-gray-500">{curr.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Export as default
export default CurrencySelector
