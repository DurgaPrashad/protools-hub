"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Calculator, Clock } from "lucide-react"

export default function DateDifference() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [difference, setDifference] = useState<null | {
    years: number
    months: number
    days: number
    totalMonths: number
    totalWeeks: number
    totalDays: number
    totalHours: number
    isNegative: boolean
  }>(null)
  const [error, setError] = useState("")

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates")
      return
    }

    setError("")

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate difference in milliseconds
    const diffMs = end.getTime() - start.getTime()
    const isNegative = diffMs < 0
    const absDiffMs = Math.abs(diffMs)

    // Calculate total values
    const totalDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = Math.floor(totalDays / 30.436875) // Average days in a month
    const totalHours = Math.floor(absDiffMs / (1000 * 60 * 60))

    // Calculate years, months, days
    const tempEnd = new Date(Math.max(start.getTime(), end.getTime()))
    const tempStart = new Date(Math.min(start.getTime(), end.getTime()))

    let years = tempEnd.getFullYear() - tempStart.getFullYear()
    let months = tempEnd.getMonth() - tempStart.getMonth()
    let days = tempEnd.getDate() - tempStart.getDate()

    // Adjust for negative days or months
    if (days < 0) {
      months--
      // Get days in the previous month
      const prevMonthDate = new Date(tempEnd.getFullYear(), tempEnd.getMonth(), 0)
      days += prevMonthDate.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    setDifference({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      isNegative,
    })
  }

  const resetCalculator = () => {
    setStartDate("")
    setEndDate("")
    setDifference(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Date Difference Calculator</CardTitle>
            <CardDescription>Calculate the difference between two dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
            <Button onClick={calculateDifference} disabled={!startDate || !endDate}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Difference
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Time difference between the two dates</CardDescription>
          </CardHeader>
          <CardContent>
            {difference ? (
              <div className="space-y-6">
                {difference.isNegative && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm">
                    Note: The end date is earlier than the start date. Results show the absolute difference.
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">{difference.years}</p>
                    <p className="text-sm text-muted-foreground">Years</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">{difference.months}</p>
                    <p className="text-sm text-muted-foreground">Months</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">{difference.days}</p>
                    <p className="text-sm text-muted-foreground">Days</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Or expressed as:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total months:</span>
                      <span className="font-medium">{difference.totalMonths}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total weeks:</span>
                      <span className="font-medium">{difference.totalWeeks}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total days:</span>
                      <span className="font-medium">{difference.totalDays}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total hours:</span>
                      <span className="font-medium">{difference.totalHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Select both dates and click "Calculate Difference" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
