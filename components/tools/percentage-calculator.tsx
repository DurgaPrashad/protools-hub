"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Percent, RotateCcw } from "lucide-react"

export default function PercentageCalculator() {
  const [mode, setMode] = useState("percentage")
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const calculatePercentage = () => {
    if (!value1 || !value2) return

    const num1 = Number.parseFloat(value1)
    const num2 = Number.parseFloat(value2)

    if (isNaN(num1) || isNaN(num2)) return

    // Calculate X% of Y
    const percentage = (num1 * num2) / 100
    setResult(`${num1}% of ${num2} = ${percentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}`)
  }

  const calculatePercentageChange = () => {
    if (!value1 || !value2) return

    const oldValue = Number.parseFloat(value1)
    const newValue = Number.parseFloat(value2)

    if (isNaN(oldValue) || isNaN(newValue) || oldValue === 0) return

    // Calculate percentage change
    const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100
    const isIncrease = change >= 0

    setResult(
      `Change: ${Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 2 })}% ${
        isIncrease ? "increase" : "decrease"
      }`,
    )
  }

  const calculatePercentageOf = () => {
    if (!value1 || !value2) return

    const part = Number.parseFloat(value1)
    const whole = Number.parseFloat(value2)

    if (isNaN(part) || isNaN(whole) || whole === 0) return

    // Calculate what percentage X is of Y
    const percentage = (part / whole) * 100
    setResult(`${part} is ${percentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}% of ${whole}`)
  }

  const handleCalculate = () => {
    switch (mode) {
      case "percentage":
        calculatePercentage()
        break
      case "change":
        calculatePercentageChange()
        break
      case "percentageOf":
        calculatePercentageOf()
        break
    }
  }

  const handleReset = () => {
    setValue1("")
    setValue2("")
    setResult(null)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Percentage Calculator</CardTitle>
            <CardDescription>Calculate percentages, increases, and decreases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="percentage" value={mode} onValueChange={setMode}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="percentage">X% of Y</TabsTrigger>
                <TabsTrigger value="change">% Change</TabsTrigger>
                <TabsTrigger value="percentageOf">X is % of Y</TabsTrigger>
              </TabsList>
              <TabsContent value="percentage" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    placeholder="e.g., 25"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g., 200"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="change" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="old-value">Old Value</Label>
                  <Input
                    id="old-value"
                    type="number"
                    placeholder="e.g., 100"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-value">New Value</Label>
                  <Input
                    id="new-value"
                    type="number"
                    placeholder="e.g., 125"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="percentageOf" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="part">Part</Label>
                  <Input
                    id="part"
                    type="number"
                    placeholder="e.g., 25"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whole">Whole</Label>
                  <Input
                    id="whole"
                    type="number"
                    placeholder="e.g., 100"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleCalculate} disabled={!value1 || !value2}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Calculation result</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              {result ? (
                <div className="text-center">
                  <Percent className="mx-auto h-12 w-12 mb-4 text-primary opacity-80" />
                  <p className="text-2xl font-bold">{result}</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Percent className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter values and click "Calculate" to see the result</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Percentage Calculations</CardTitle>
          <CardDescription>Quick reference for percentage calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Finding a percentage of a number</h3>
              <p className="text-sm text-muted-foreground">
                To find X% of Y, multiply Y by X/100.
                <br />
                <br />
                Example: 25% of 80 = 80 × (25/100) = 20
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Percentage increase/decrease</h3>
              <p className="text-sm text-muted-foreground">
                Percentage change = ((New - Old) / |Old|) × 100
                <br />
                <br />
                Example: From 100 to 125 = ((125 - 100) / 100) × 100 = 25% increase
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Finding what percentage X is of Y</h3>
              <p className="text-sm text-muted-foreground">
                Percentage = (X / Y) × 100
                <br />
                <br />
                Example: 20 is what % of 80? = (20 / 80) × 100 = 25%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
