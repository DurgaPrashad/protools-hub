"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Play, Pause, Square, Volume2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TextToSpeech() {
  const [text, setText] = useState("")
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const { toast } = useToast()
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.speechSynthesis) {
        setIsSupported(false)
        toast({
          title: "Not supported",
          description: "Text-to-speech is not supported in your browser",
          variant: "destructive",
        })
      } else {
        // Load available voices
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices()
          if (availableVoices.length > 0) {
            setVoices(availableVoices)
            // Set default voice (prefer English)
            const defaultVoice = availableVoices.find((voice) => voice.lang.includes("en-")) || availableVoices[0]
            setSelectedVoice(defaultVoice.name)
          }
        }

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices
        }

        loadVoices()
      }
    }
  }, [toast])

  // Handle speech end
  useEffect(() => {
    const handleSpeechEnd = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onend = handleSpeechEnd
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onend = null
      }
    }
  }, [])

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to speak",
        variant: "destructive",
      })
      return
    }

    if (!isSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Set voice
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice)
      if (voice) utterance.voice = voice
    }

    // Set other properties
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    // Start speaking
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
    setIsPaused(false)
  }

  const pause = () => {
    if (!isSupported || !isSpeaking) return
    window.speechSynthesis.pause()
    setIsPaused(true)
  }

  const resume = () => {
    if (!isSupported || !isSpeaking) return
    window.speechSynthesis.resume()
    setIsPaused(false)
  }

  const stop = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const handleClear = () => {
    setText("")
    stop()
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Text to Speech</CardTitle>
            <CardDescription>Convert text to spoken audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="resize-none"
                disabled={!isSupported}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voice-select">Voice</Label>
                <Select
                  value={selectedVoice}
                  onValueChange={setSelectedVoice}
                  disabled={!isSupported || voices.length === 0}
                >
                  <SelectTrigger id="voice-select">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rate-slider">Rate: {rate.toFixed(1)}</Label>
                </div>
                <Slider
                  id="rate-slider"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                  disabled={!isSupported}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="pitch-slider">Pitch: {pitch.toFixed(1)}</Label>
                </div>
                <Slider
                  id="pitch-slider"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  disabled={!isSupported}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="volume-slider" className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Volume: {(volume * 100).toFixed(0)}%
                  </Label>
                </div>
                <Slider
                  id="volume-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  disabled={!isSupported}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear} disabled={!isSupported || !text}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              {isSpeaking ? (
                <>
                  {isPaused ? (
                    <Button onClick={resume} disabled={!isSupported}>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  ) : (
                    <Button onClick={pause} disabled={!isSupported}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button variant="outline" onClick={stop} disabled={!isSupported}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                </>
              ) : (
                <Button onClick={speak} disabled={!isSupported || !text.trim()}>
                  <Play className="mr-2 h-4 w-4" />
                  Speak
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Text to Speech</CardTitle>
            <CardDescription>How to use the text-to-speech converter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSupported ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm">
                <p className="font-medium mb-2">Browser Not Supported</p>
                <p>
                  Your browser doesn't support the Web Speech API. Please try using a modern browser like Chrome, Edge,
                  or Safari.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How to Use</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                    <li>Enter or paste the text you want to convert to speech</li>
                    <li>Select a voice from the dropdown menu</li>
                    <li>Adjust the rate, pitch, and volume sliders as desired</li>
                    <li>Click the "Speak" button to hear the text</li>
                    <li>Use the pause, resume, and stop buttons to control playback</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Tips for Better Results</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Use punctuation to create natural pauses in speech</li>
                    <li>Try different voices to find the one that sounds best</li>
                    <li>Adjust the rate for faster or slower speech</li>
                    <li>For longer texts, consider breaking them into paragraphs</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sample Texts</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-2 px-3"
                      onClick={() =>
                        setText("Hello! This is a test of the text-to-speech converter. How does it sound?")
                      }
                    >
                      <span className="text-left text-sm">
                        Hello! This is a test of the text-to-speech converter. How does it sound?
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => setText("The quick brown fox jumps over the lazy dog.")}
                    >
                      <span className="text-left text-sm">The quick brown fox jumps over the lazy dog.</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
