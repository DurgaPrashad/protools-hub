"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Calculator, Clock } from "lucide-react"

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("")
  const [calculationDate, setCalculationDate] = useState("")
  const [age, setAge] = useState<null | {
    years: number
    months: number
    days: number
    totalMonths: number
    totalWeeks: number
    totalDays: number
    totalHours: number
  }>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const calculation = calculationDate ? new Date(calculationDate) : new Date()

    // Validate dates
    if (birth > calculation) {
      alert("Birth date cannot be in the future!")
      return
    }

    // Calculate difference in milliseconds
    const diffMs = calculation.getTime() - birth.getTime()

    // Calculate total values
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = Math.floor(totalDays / 30.436875) // Average days in a month
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60))

    // Calculate years, months, days
    let years = calculation.getFullYear() - birth.getFullYear()
    let months = calculation.getMonth() - birth.getMonth()
    let days = calculation.getDate() - birth.getDate()

    // Adjust for negative days or months
    if (days < 0) {
      months--
      // Get days in the previous month
      const prevMonthDate = new Date(calculation.getFullYear(), calculation.getMonth(), 0)
      days += prevMonthDate.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    setAge({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
    })
  }

  const resetCalculator = () => {
    setBirthDate("")
    setCalculationDate("")
    setAge(null)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Age Calculator</h1>
          <p className="text-muted-foreground md:text-xl">Calculate your exact age or time between two dates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Dates</CardTitle>
              <CardDescription>Enter birth date and optional calculation date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birth-date">Birth Date</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculation-date">Calculation Date (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="calculation-date"
                    type="date"
                    value={calculationDate}
                    onChange={(e) => setCalculationDate(e.target.value)}
                    placeholder="Today's date will be used if empty"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Leave empty to use today's date</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetCalculator}>
                Reset
              </Button>
              <Button onClick={calculateAge} disabled={!birthDate}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Age
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age Results</CardTitle>
              <CardDescription>Your calculated age details</CardDescription>
            </CardHeader>
            <CardContent>
              {age ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-3xl font-bold">{age.years}</p>
                      <p className="text-sm text-muted-foreground">Years</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-3xl font-bold">{age.months}</p>
                      <p className="text-sm text-muted-foreground">Months</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-3xl font-bold">{age.days}</p>
                      <p className="text-sm text-muted-foreground">Days</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Or expressed as:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total months:</span>
                        <span className="font-medium">{age.totalMonths}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total weeks:</span>
                        <span className="font-medium">{age.totalWeeks}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total days:</span>
                        <span className="font-medium">{age.totalDays}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total hours:</span>
                        <span className="font-medium">{age.totalHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter a birth date and click "Calculate Age" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About Age Calculator</h2>
          <p className="mb-4">
            Our age calculator tool helps you determine your exact age or the time between any two dates. It provides
            results in years, months, and days, as well as total months, weeks, days, and hours.
          </p>
          <h3 className="text-lg font-semibold mb-2">Common Uses:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Calculating exact age for official documents</li>
            <li>Determining time periods for contracts or agreements</li>
            <li>Planning events based on specific time intervals</li>
            <li>Tracking milestones for children or projects</li>
            <li>Calculating retirement eligibility</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
