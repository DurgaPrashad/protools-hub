"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Languages, ArrowRightLeft, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock translation function (in a real app, this would call a translation API)
const mockTranslate = (text: string, from: string, to: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is just a mock - in a real app, you would call a translation API
      if (from === to) {
        resolve(text)
        return
      }

      // For demo purposes, we'll just append a note
      resolve(`[Translated from ${from} to ${to}]: ${text}`)
    }, 500)
  })
}

// Language options
const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
]

export default function TextTranslator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to translate",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      const result = await mockTranslate(sourceText, sourceLanguage, targetLanguage)
      setTranslatedText(result)
    } catch (error) {
      toast({
        title: "Translation error",
        description: "An error occurred during translation",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText("")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText)
    toast({
      title: "Copied!",
      description: "Translated text copied to clipboard",
    })
  }

  const handleClear = () => {
    setSourceText("")
    setTranslatedText("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Text Translator</CardTitle>
            <CardDescription>Translate text between different languages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="source-language">Source Language</Label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger id="source-language" className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={`source-${lang.value}`} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwapLanguages} disabled={isTranslating}>
                <ArrowRightLeft className="h-4 w-4" />
                <span className="sr-only">Swap languages</span>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="target-language">Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger id="target-language" className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={`target-${lang.value}`} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={translatedText}
                readOnly
                rows={6}
                className="resize-none"
                placeholder="Translation will appear here..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear} disabled={isTranslating}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button onClick={handleTranslate} disabled={!sourceText.trim() || isTranslating}>
                {isTranslating ? (
                  "Translating..."
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Translate
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!translatedText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Information</CardTitle>
            <CardDescription>About our translation service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 text-sm">
              <p className="font-medium mb-2">Demo Mode Notice</p>
              <p>
                This is a demonstration of the translator interface. In a production environment, this would connect to
                a translation API like Google Translate, DeepL, or Microsoft Translator.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Supported Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">Text translation</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">Multiple languages</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">Language detection</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">Copy translated text</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Popular Translations</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setSourceLanguage("en")
                    setTargetLanguage("es")
                    setSourceText("Hello, how are you?")
                  }}
                >
                  English → Spanish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setSourceLanguage("en")
                    setTargetLanguage("fr")
                    setSourceText("Thank you for your help.")
                  }}
                >
                  English → French
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Simple check icon component
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
