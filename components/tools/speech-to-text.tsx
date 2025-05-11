"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the SpeechRecognition type
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: any) => void
  onresult: (event: any) => void
  onend: () => void
}

// Define the window with SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition: new () => SpeechRecognition
  webkitSpeechRecognition: new () => SpeechRecognition
}

export default function SpeechToText() {
  const [text, setText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()

  // Language options
  const languages = [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "es-ES", label: "Spanish" },
    { value: "fr-FR", label: "French" },
    { value: "de-DE", label: "German" },
    { value: "it-IT", label: "Italian" },
    { value: "pt-BR", label: "Portuguese (Brazil)" },
    { value: "ru-RU", label: "Russian" },
    { value: "zh-CN", label: "Chinese (Simplified)" },
    { value: "ja-JP", label: "Japanese" },
    { value: "ko-KR", label: "Korean" },
    { value: "ar-SA", label: "Arabic" },
    { value: "hi-IN", label: "Hindi" },
  ]

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithSpeech = window as unknown as WindowWithSpeechRecognition
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setIsSupported(false)
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser",
          variant: "destructive",
        })
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = selectedLanguage

      recognition.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = text

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "
          } else {
            interimTranscript += transcript
          }
        }

        setText(finalTranscript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event)
        toast({
          title: "Error",
          description: "An error occurred during speech recognition",
          variant: "destructive",
        })
        setIsListening(false)
      }

      recognition.onend = () => {
        if (isListening) {
          recognition.start()
        } else {
          setIsListening(false)
        }
      }

      recognitionRef.current = recognition
    }
  }, [selectedLanguage, text, toast, isListening])

  // Update language when changed
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage
    }
  }, [selectedLanguage])

  const toggleListening = () => {
    if (!isSupported) return

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.start()
      setIsListening(true)
      toast({
        title: "Listening...",
        description: "Speak now to convert your speech to text",
      })
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Error",
        description: "Could not start speech recognition",
        variant: "destructive",
      })
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
      setIsListening(false)
      toast({
        title: "Stopped listening",
        description: "Speech recognition has been stopped",
      })
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleClear = () => {
    setText("")
    if (isListening) {
      stopListening()
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Speech to Text</CardTitle>
            <CardDescription>Convert spoken words to text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                disabled={!isSupported || isListening}
              >
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Your speech will appear here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="resize-none"
                readOnly={isListening}
              />
            </div>

            {!isSupported && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm">
                <p className="font-medium mb-2">Browser Not Supported</p>
                <p>
                  Your browser doesn't support the Web Speech API. Please try using a modern browser like Chrome or
                  Edge.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear} disabled={!isSupported || (!text && !isListening)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={toggleListening}
                disabled={!isSupported}
                variant={isListening ? "destructive" : "default"}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Listening
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!isSupported || !text}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Speech to Text</CardTitle>
            <CardDescription>How to use the speech recognition tool</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSupported ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm">
                <p className="font-medium mb-2">Browser Not Supported</p>
                <p>
                  Your browser doesn't support the Web Speech API. Please try using a modern browser like Chrome or
                  Edge.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How to Use</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                    <li>Select your language from the dropdown menu</li>
                    <li>Click the "Start Listening" button</li>
                    <li>Speak clearly into your microphone</li>
                    <li>Your speech will be converted to text in real-time</li>
                    <li>Click "Stop Listening" when you're done</li>
                    <li>Copy the text or clear it to start again</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Tips for Better Results</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Use a good quality microphone</li>
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Minimize background noise</li>
                    <li>Use proper pronunciation</li>
                    <li>Speak in complete sentences</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy Note</h3>
                  <p className="text-sm text-muted-foreground">
                    This tool uses your browser's built-in speech recognition capabilities. Audio data is processed
                    locally by your browser and may be sent to the browser vendor's servers for processing. No audio
                    data is stored by ProToolsHub.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
