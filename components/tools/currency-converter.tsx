"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Copy, RefreshCw, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock exchange rates (in a real app, these would come from an API)
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.23,
  CAD: 1.36,
  AUD: 1.52,
  CNY: 7.24,
  INR: 83.12,
  BRL: 5.05,
  MXN: 16.73,
  CHF: 0.89,
  RUB: 91.25,
  SGD: 1.34,
  NZD: 1.63,
  ZAR: 18.42,
}

type CurrencyCode = keyof typeof exchangeRates

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD")
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("EUR")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { toast } = useToast()

  useEffect(() => {
    // Convert on initial load
    handleConvert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    const numAmount = Number.parseFloat(amount)

    // Convert to USD first (base currency)
    const amountInUSD = numAmount / exchangeRates[fromCurrency]

    // Convert from USD to target currency
    const result = amountInUSD * exchangeRates[toCurrency]

    setConvertedAmount(result.toFixed(2))
    setLastUpdated(new Date())
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    // Trigger conversion after swap
    setTimeout(handleConvert, 0)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedAmount)
    toast({
      title: "Copied!",
      description: "Amount copied to clipboard",
    })
  }

  const formatCurrencyName = (code: string): string => {
    const currencyNames: Record<string, string> = {
      USD: "US Dollar",
      EUR: "Euro",
      GBP: "British Pound",
      JPY: "Japanese Yen",
      CAD: "Canadian Dollar",
      AUD: "Australian Dollar",
      CNY: "Chinese Yuan",
      INR: "Indian Rupee",
      BRL: "Brazilian Real",
      MXN: "Mexican Peso",
      CHF: "Swiss Franc",
      RUB: "Russian Ruble",
      SGD: "Singapore Dollar",
      NZD: "New Zealand Dollar",
      ZAR: "South African Rand",
    }
    return `${code} - ${currencyNames[code] || code}`
  }

  const getCurrencySymbol = (code: string): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CNY: "¥",
      INR: "₹",
      BRL: "R$",
      MXN: "Mex$",
      CHF: "Fr",
      RUB: "₽",
      SGD: "S$",
      NZD: "NZ$",
      ZAR: "R",
    }
    return symbols[code] || code
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Currency Converter</CardTitle>
            <CardDescription>Convert between different currencies with live rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 items-center gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="from-currency">From</Label>
                <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as CurrencyCode)}>
                  <SelectTrigger id="from-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(exchangeRates).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {formatCurrencyName(currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" onClick={handleSwapCurrencies}>
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">Swap currencies</span>
                </Button>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="to-currency">To</Label>
                <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as CurrencyCode)}>
                  <SelectTrigger id="to-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(exchangeRates).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {formatCurrencyName(currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleConvert} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Convert
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>Current exchange rate result</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted rounded-md flex items-center justify-center min-h-[150px]">
              {convertedAmount ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {amount} {fromCurrency} =
                  </p>
                  <p className="text-3xl font-bold">
                    {getCurrencySymbol(toCurrency)} {convertedAmount} {toCurrency}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)}{" "}
                    {toCurrency}
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Coins className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter an amount and click "Convert" to see the result</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <Button onClick={handleCopy} disabled={!convertedAmount}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Result
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate Disclaimer</CardTitle>
          <CardDescription>Important information about our currency converter</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The exchange rates provided are for informational purposes only and are not intended for trading purposes.
            These rates are not verified in real-time and may not be accurate or current. For actual exchange rates,
            please consult your financial institution or currency exchange service.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
