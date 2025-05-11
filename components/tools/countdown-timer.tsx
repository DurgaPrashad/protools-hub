"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timer, Play, Pause, RotateCcw, Bell } from "lucide-react"

export default function CountdownTimer() {
  const [mode, setMode] = useState("quick")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [targetDate, setTargetDate] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [timeLeft, setTimeLeft] = useState<null | {
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for alarm
    audioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const calculateTimeLeft = () => {
    let targetTime: Date

    if (mode === "quick") {
      // Calculate from hours, minutes, seconds
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      if (totalSeconds <= 0) return null

      targetTime = new Date()
      targetTime.setSeconds(targetTime.getSeconds() + totalSeconds)
    } else {
      // Calculate from date and time
      if (!targetDate || !targetTime) return null

      const dateTimeString = `${targetDate}T${targetTime}`
      targetTime = new Date(dateTimeString)

      if (isNaN(targetTime.getTime()) || targetTime <= new Date()) return null
    }

    const now = new Date()
    const difference = targetTime.getTime() - now.getTime()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    }
  }

  const startTimer = () => {
    const initialTimeLeft = calculateTimeLeft()
    if (!initialTimeLeft) return

    setTimeLeft(initialTimeLeft)
    setIsRunning(true)
    setIsComplete(false)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (!prevTimeLeft || prevTimeLeft.total <= 1000) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setIsComplete(true)

          // Play alarm sound
          if (audioRef.current) {
            audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
          }

          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
          }
        }

        const newTotal = prevTimeLeft.total - 1000
        return {
          days: Math.floor(newTotal / (1000 * 60 * 60 * 24)),
          hours: Math.floor((newTotal / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((newTotal / (1000 * 60)) % 60),
          seconds: Math.floor((newTotal / 1000) % 60),
          total: newTotal,
        }
      })
    }, 1000)
  }

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsRunning(false)
    setIsComplete(false)
    setTimeLeft(null)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (mode === "quick") {
      setHours(0)
      setMinutes(0)
      setSeconds(0)
    } else {
      setTargetDate("")
      setTargetTime("")
    }
  }

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsComplete(false)
  }

  // Format time with leading zeros
  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Countdown Timer</CardTitle>
            <CardDescription>Set a timer for a specific duration or date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="quick" value={mode} onValueChange={setMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Quick Timer</TabsTrigger>
                <TabsTrigger value="date">Date & Time</TabsTrigger>
              </TabsList>
              <TabsContent value="quick" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                      id="seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Number.parseInt(e.target.value) || 0)}
                      disabled={isRunning}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="date" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-time">Target Time</Label>
                  <Input
                    id="target-time"
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            {isRunning ? (
              <Button onClick={pauseTimer}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={startTimer}
                disabled={
                  (mode === "quick" && hours === 0 && minutes === 0 && seconds === 0) ||
                  (mode === "date" && (!targetDate || !targetTime))
                }
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Remaining</CardTitle>
            <CardDescription>Countdown display</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              {timeLeft ? (
                <div className="text-center">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold">{timeLeft.days}</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold">{formatTime(timeLeft.hours)}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold">{formatTime(timeLeft.minutes)}</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold">{formatTime(timeLeft.seconds)}</div>
                      <div className="text-xs text-muted-foreground">Seconds</div>
                    </div>
                  </div>

                  {isComplete && (
                    <div className="mt-4">
                      <div className="animate-pulse flex items-center justify-center mb-2">
                        <Bell className="h-6 w-6 text-red-500 mr-2" />
                        <span className="text-lg font-bold text-red-500">Time's Up!</span>
                      </div>
                      <Button onClick={stopAlarm} variant="destructive">
                        Stop Alarm
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Timer className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Set and start the timer to begin countdown</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
