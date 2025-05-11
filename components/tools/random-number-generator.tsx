"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dices, Copy, RefreshCw, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [quantity, setQuantity] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [randomNumbers, setRandomNumbers] = useState<number[]>([])
  const [error, setError] = useState("")
  const { toast } = useToast()

  const generateRandomNumbers = () => {
    setError("")

    // Validate inputs
    if (min > max) {
      setError("Minimum value cannot be greater than maximum value")
      return
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1")
      return
    }

    const range = max - min + 1
    if (!allowDuplicates && quantity > range) {
      setError(`Cannot generate ${quantity} unique numbers in the range ${min}-${max}`)
      return
    }

    // Generate random numbers
    let numbers: number[] = []
    if (allowDuplicates) {
      for (let i = 0; i < quantity; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
    } else {
      // Fisher-Yates shuffle algorithm for unique numbers
      const pool = Array.from({ length: range }, (_, i) => min + i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      numbers = pool.slice(0, quantity)
    }

    setRandomNumbers(numbers)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(randomNumbers.join(", "))
    toast({
      title: "Copied!",
      description: "Random numbers copied to clipboard",
    })
  }

  const handleClear = () => {
    setRandomNumbers([])
    setError("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Random Number Generator</CardTitle>
            <CardDescription>Generate random numbers with custom ranges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">Number of random numbers to generate (1-1000)</p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
              <Label htmlFor="duplicates" className="cursor-pointer">
                Allow Duplicates
              </Label>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button onClick={generateRandomNumbers} className="w-full">
              <Dices className="mr-2 h-4 w-4" />
              Generate Random Numbers
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Your generated random numbers</CardDescription>
          </CardHeader>
          <CardContent>
            {randomNumbers.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md max-h-[300px] overflow-y-auto">
                  {randomNumbers.length <= 20 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {randomNumbers.map((num, index) => (
                        <div key={index} className="bg-background p-2 rounded text-center font-mono">
                          {num}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono whitespace-pre-wrap break-all">{randomNumbers.join(", ")}</div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <List className="inline-block mr-1 h-3 w-3" />
                  Generated {randomNumbers.length} number{randomNumbers.length !== 1 ? "s" : ""}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Dices className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Click "Generate Random Numbers" to see results</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear} disabled={randomNumbers.length === 0}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCopy} disabled={randomNumbers.length === 0}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Numbers
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
