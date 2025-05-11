"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Clock, ArrowRightLeft, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Common time zones
const timeZones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
  { value: "America/Denver", label: "Denver (MST/MDT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
]

export default function TimeZoneConverter() {
  const [sourceDate, setSourceDate] = useState("")
  const [sourceTime, setSourceTime] = useState("")
  const [sourceTimeZone, setSourceTimeZone] = useState("UTC")
  const [targetTimeZone, setTargetTimeZone] = useState("America/New_York")
  const [convertedDateTime, setConvertedDateTime] = useState<Date | null>(null)
  const [currentTimes, setCurrentTimes] = useState<{ source: string; target: string }>({
    source: "",
    target: "",
  })
  const { toast } = useToast()

  // Set default date and time to now
  useEffect(() => {
    const now = new Date()
    setSourceDate(now.toISOString().split("T")[0])
    setSourceTime(now.toTimeString().slice(0, 5))
    updateCurrentTimes()

    // Update current times every minute
    const interval = setInterval(updateCurrentTimes, 60000)
    return () => clearInterval(interval)
  }, [])

  // Update current times in both time zones
  const updateCurrentTimes = () => {
    const now = new Date()

    setCurrentTimes({
      source: formatTimeInTimeZone(now, sourceTimeZone),
      target: formatTimeInTimeZone(now, targetTimeZone),
    })
  }

  // Format a date in a specific time zone
  const formatTimeInTimeZone = (date: Date, timeZone: string): string => {
    try {
      return date.toLocaleString("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid time zone"
    }
  }

  // Convert time between time zones
  const convertTime = () => {
    if (!sourceDate || !sourceTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    try {
      // Create date object from source date and time
      const dateTimeString = `${sourceDate}T${sourceTime}:00`
      const sourceDateTime = new Date(dateTimeString)

      // Get source time zone offset
      const sourceOffset = getTimeZoneOffset(sourceDateTime, sourceTimeZone)

      // Adjust for source time zone
      const utcTime = new Date(sourceDateTime.getTime() + sourceOffset)

      // Get target time zone offset
      const targetOffset = getTimeZoneOffset(utcTime, targetTimeZone)

      // Adjust for target time zone
      const targetTime = new Date(utcTime.getTime() - targetOffset)

      setConvertedDateTime(targetTime)
    } catch (e) {
      toast({
        title: "Conversion error",
        description: "Could not convert between these time zones",
        variant: "destructive",
      })
    }
  }

  // Get time zone offset in milliseconds
  const getTimeZoneOffset = (date: Date, timeZone: string): number => {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }))
    return utcDate.getTime() - tzDate.getTime()
  }

  const handleSwapTimeZones = () => {
    const temp = sourceTimeZone
    setSourceTimeZone(targetTimeZone)
    setTargetTimeZone(temp)
    updateCurrentTimes()
    setConvertedDateTime(null)
  }

  const handleCopy = () => {
    if (!convertedDateTime) return

    const formattedDateTime = convertedDateTime.toLocaleString("en-US", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    navigator.clipboard.writeText(formattedDateTime)
    toast({
      title: "Copied!",
      description: "Converted time copied to clipboard",
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Time Zone Converter</CardTitle>
            <CardDescription>Convert times between different time zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source-timezone">From Time Zone</Label>
                <Select value={sourceTimeZone} onValueChange={setSourceTimeZone}>
                  <SelectTrigger id="source-timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Current time: {currentTimes.source}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-date">Date</Label>
                  <Input
                    id="source-date"
                    type="date"
                    value={sourceDate}
                    onChange={(e) => setSourceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-time">Time</Label>
                  <Input
                    id="source-time"
                    type="time"
                    value={sourceTime}
                    onChange={(e) => setSourceTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" onClick={handleSwapTimeZones}>
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">Swap time zones</span>
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-timezone">To Time Zone</Label>
                <Select value={targetTimeZone} onValueChange={setTargetTimeZone}>
                  <SelectTrigger id="target-timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Current time: {currentTimes.target}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={convertTime} className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              Convert Time
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>Converted time in target time zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted rounded-md flex items-center justify-center min-h-[200px]">
              {convertedDateTime ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(`${sourceDate}T${sourceTime}`).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    in {timeZones.find((tz) => tz.value === sourceTimeZone)?.label.split(" ")[0]} =
                  </p>
                  <p className="text-3xl font-bold">
                    {convertedDateTime.toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    })}
                  </p>
                  <p className="text-lg mt-1">
                    {convertedDateTime.toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    in {timeZones.find((tz) => tz.value === targetTimeZone)?.label.split(" ")[0]}
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Globe className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Select date, time, and time zones, then click "Convert Time"</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCopy} disabled={!convertedDateTime}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Converted Time
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Zone Facts</CardTitle>
          <CardDescription>Interesting information about time zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">How Many Time Zones?</h3>
              <p className="text-sm text-muted-foreground">
                There are 24 standard time zones around the world, each typically one hour apart.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Daylight Saving Time</h3>
              <p className="text-sm text-muted-foreground">
                Many regions observe Daylight Saving Time, shifting their clocks forward by one hour in spring and back
                in fall.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">International Date Line</h3>
              <p className="text-sm text-muted-foreground">
                The International Date Line marks where each calendar day begins and ends around the world.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
