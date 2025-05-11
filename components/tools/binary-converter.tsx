"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Binary, Copy, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function BinaryConverter() {
  const [inputValue, setInputValue] = useState("")
  const [outputValue, setOutputValue] = useState("")
  const [inputBase, setInputBase] = useState("decimal")
  const [outputBase, setOutputBase] = useState("binary")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const isValidForBase = (value: string, base: number): boolean => {
    if (base === 2) return /^[01]*$/.test(value)
    if (base === 8) return /^[0-7]*$/.test(value)
    if (base === 10) return /^[0-9]*$/.test(value)
    if (base === 16) return /^[0-9A-Fa-f]*$/.test(value)
    return false
  }

  const getBaseFromString = (baseStr: string): number => {
    switch (baseStr) {
      case "binary":
        return 2
      case "octal":
        return 8
      case "decimal":
        return 10
      case "hexadecimal":
        return 16
      default:
        return 10
    }
  }

  const convert = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to convert")
      setOutputValue("")
      return
    }

    setError("")
    const fromBase = getBaseFromString(inputBase)
    const toBase = getBaseFromString(outputBase)

    if (!isValidForBase(inputValue, fromBase)) {
      setError(`Invalid ${inputBase} value`)
      setOutputValue("")
      return
    }

    try {
      // Parse the input value to decimal first
      const decimalValue = Number.parseInt(inputValue, fromBase)

      if (isNaN(decimalValue)) {
        setError("Invalid input value")
        setOutputValue("")
        return
      }

      // Convert from decimal to target base
      let result = decimalValue.toString(toBase)

      // Make hexadecimal uppercase for better readability
      if (toBase === 16) {
        result = result.toUpperCase()
      }

      setOutputValue(result)
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`)
      setOutputValue("")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputValue)
    toast({
      title: "Copied!",
      description: "Value copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputValue("")
    setOutputValue("")
    setError("")
  }

  const handleSwapBases = () => {
    setInputBase(outputBase)
    setOutputBase(inputBase)
    setInputValue(outputValue)
    setOutputValue("")
    setError("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Binary Converter</CardTitle>
            <CardDescription>Convert between binary, decimal, hexadecimal, and octal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="input-base">Input Base</Label>
                <Tabs defaultValue="decimal" value={inputBase} onValueChange={setInputBase}>
                  <TabsList>
                    <TabsTrigger value="binary">Binary</TabsTrigger>
                    <TabsTrigger value="octal">Octal</TabsTrigger>
                    <TabsTrigger value="decimal">Decimal</TabsTrigger>
                    <TabsTrigger value="hexadecimal">Hex</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Input
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Enter ${inputBase} value...`}
                className="font-mono"
              />
              {inputBase === "binary" && <p className="text-xs text-muted-foreground">Enter 0s and 1s only</p>}
              {inputBase === "octal" && <p className="text-xs text-muted-foreground">Enter digits 0-7 only</p>}
              {inputBase === "hexadecimal" && (
                <p className="text-xs text-muted-foreground">Enter digits 0-9 and letters A-F only</p>
              )}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwapBases}>
                <Binary className="h-4 w-4" />
                <span className="sr-only">Swap bases</span>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="output-base">Output Base</Label>
                <Tabs defaultValue="binary" value={outputBase} onValueChange={setOutputBase}>
                  <TabsList>
                    <TabsTrigger value="binary">Binary</TabsTrigger>
                    <TabsTrigger value="octal">Octal</TabsTrigger>
                    <TabsTrigger value="decimal">Decimal</TabsTrigger>
                    <TabsTrigger value="hexadecimal">Hex</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Input
                id="output-value"
                value={outputValue}
                readOnly
                placeholder={`${outputBase} result will appear here...`}
                className="font-mono"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button onClick={convert} disabled={!inputValue}>
                Convert
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!outputValue}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Number System Reference</CardTitle>
            <CardDescription>Quick reference for different number systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Binary (Base 2)</h3>
              <p className="text-sm text-muted-foreground">
                Uses only 0 and 1. Each digit position represents a power of 2.
              </p>
              <div className="bg-muted p-2 rounded text-sm">
                Example: 1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10₁₀
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Octal (Base 8)</h3>
              <p className="text-sm text-muted-foreground">
                Uses digits 0-7. Each digit position represents a power of 8.
              </p>
              <div className="bg-muted p-2 rounded text-sm">Example: 12₈ = 1×8¹ + 2×8⁰ = 8 + 2 = 10₁₀</div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Decimal (Base 10)</h3>
              <p className="text-sm text-muted-foreground">
                Uses digits 0-9. Each digit position represents a power of 10.
              </p>
              <div className="bg-muted p-2 rounded text-sm">Example: 10₁₀ = 1×10¹ + 0×10⁰ = 10</div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Hexadecimal (Base 16)</h3>
              <p className="text-sm text-muted-foreground">
                Uses digits 0-9 and letters A-F. Each digit position represents a power of 16.
              </p>
              <div className="bg-muted p-2 rounded text-sm">Example: A₁₆ = 10₁₀ (A represents 10 in decimal)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
