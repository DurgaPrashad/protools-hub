"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Copy, RefreshCw, Ruler } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Conversion units
const lengthUnits = [
  { value: "mm", label: "Millimeters (mm)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "m", label: "Meters (m)" },
  { value: "km", label: "Kilometers (km)" },
  { value: "in", label: "Inches (in)" },
  { value: "ft", label: "Feet (ft)" },
  { value: "yd", label: "Yards (yd)" },
  { value: "mi", label: "Miles (mi)" },
]

const weightUnits = [
  { value: "mg", label: "Milligrams (mg)" },
  { value: "g", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "oz", label: "Ounces (oz)" },
  { value: "lb", label: "Pounds (lb)" },
  { value: "st", label: "Stone (st)" },
  { value: "t", label: "Metric Tons (t)" },
]

const volumeUnits = [
  { value: "ml", label: "Milliliters (ml)" },
  { value: "l", label: "Liters (l)" },
  { value: "m3", label: "Cubic Meters (m³)" },
  { value: "pt", label: "Pints (pt)" },
  { value: "qt", label: "Quarts (qt)" },
  { value: "gal", label: "Gallons (gal)" },
  { value: "floz", label: "Fluid Ounces (fl oz)" },
]

const temperatureUnits = [
  { value: "c", label: "Celsius (°C)" },
  { value: "f", label: "Fahrenheit (°F)" },
  { value: "k", label: "Kelvin (K)" },
]

// Conversion factors (to base unit)
const conversionFactors: Record<string, number> = {
  // Length (base: meters)
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,

  // Weight (base: grams)
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  st: 6350.29,
  t: 1000000,

  // Volume (base: liters)
  ml: 0.001,
  l: 1,
  m3: 1000,
  pt: 0.473176,
  qt: 0.946353,
  gal: 3.78541,
  floz: 0.0295735,
}

// Special case for temperature conversions
const convertTemperature = (value: number, from: string, to: string): number => {
  // Convert to Celsius first
  let celsius
  switch (from) {
    case "c":
      celsius = value
      break
    case "f":
      celsius = (value - 32) * (5 / 9)
      break
    case "k":
      celsius = value - 273.15
      break
    default:
      celsius = 0
  }

  // Convert from Celsius to target unit
  switch (to) {
    case "c":
      return celsius
    case "f":
      return celsius * (9 / 5) + 32
    case "k":
      return celsius + 273.15
    default:
      return 0
  }
}

export default function UnitConverter() {
  const [category, setCategory] = useState("length")
  const [inputValue, setInputValue] = useState("1")
  const [fromUnit, setFromUnit] = useState(
    category === "length" ? "m" : category === "weight" ? "kg" : category === "volume" ? "l" : "c",
  )
  const [toUnit, setToUnit] = useState(
    category === "length" ? "ft" : category === "weight" ? "lb" : category === "volume" ? "gal" : "f",
  )
  const [result, setResult] = useState("")
  const { toast } = useToast()

  // Get units based on category
  const getUnits = () => {
    switch (category) {
      case "length":
        return lengthUnits
      case "weight":
        return weightUnits
      case "volume":
        return volumeUnits
      case "temperature":
        return temperatureUnits
      default:
        return lengthUnits
    }
  }

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)

    // Set default units for the new category
    switch (newCategory) {
      case "length":
        setFromUnit("m")
        setToUnit("ft")
        break
      case "weight":
        setFromUnit("kg")
        setToUnit("lb")
        break
      case "volume":
        setFromUnit("l")
        setToUnit("gal")
        break
      case "temperature":
        setFromUnit("c")
        setToUnit("f")
        break
    }

    // Recalculate with new units
    handleConvert()
  }

  // Convert units
  const handleConvert = () => {
    const value = Number.parseFloat(inputValue)

    if (isNaN(value)) {
      setResult("Please enter a valid number")
      return
    }

    let convertedValue

    if (category === "temperature") {
      convertedValue = convertTemperature(value, fromUnit, toUnit)
    } else {
      // Convert to base unit, then to target unit
      const baseValue = value * conversionFactors[fromUnit]
      convertedValue = baseValue / conversionFactors[toUnit]
    }

    // Format the result
    setResult(
      convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 8,
        minimumFractionDigits: 0,
      }),
    )
  }

  const handleSwapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    handleConvert()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    toast({
      title: "Copied!",
      description: "Result copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputValue("1")
    setResult("")
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="length" value={category} onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Convert {category.charAt(0).toUpperCase() + category.slice(1)}</CardTitle>
              <CardDescription>Enter a value and select units to convert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="input-value">Value</Label>
                <Input
                  id="input-value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-5 items-center gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="from-unit">From</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger id="from-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnits().map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" size="icon" onClick={handleSwapUnits}>
                    <ArrowRightLeft className="h-4 w-4" />
                    <span className="sr-only">Swap units</span>
                  </Button>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="to-unit">To</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger id="to-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnits().map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleConvert} className="w-full">
                <Ruler className="mr-2 h-4 w-4" />
                Convert
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>Conversion result</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted rounded-md flex items-center justify-center min-h-[150px]">
                {result ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {inputValue} {getUnits().find((u) => u.value === fromUnit)?.label} =
                    </p>
                    <p className="text-3xl font-bold">
                      {result}{" "}
                      {
                        getUnits()
                          .find((u) => u.value === toUnit)
                          ?.label.split(" ")[0]
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Ruler className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p>Click "Convert" to see the result</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleClear} disabled={!result}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button onClick={handleCopy} disabled={!result}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Result
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
