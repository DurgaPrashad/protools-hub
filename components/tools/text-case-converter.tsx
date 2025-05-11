"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, CaseSensitive, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("uppercase")
  const { toast } = useToast()

  const handleConvert = () => {
    if (!inputText) return

    let result = ""
    switch (activeTab) {
      case "uppercase":
        result = inputText.toUpperCase()
        break
      case "lowercase":
        result = inputText.toLowerCase()
        break
      case "titlecase":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        break
      case "sentencecase":
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case "alternatingcase":
        result = inputText
          .split("")
          .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join("")
        break
      case "inversecase":
        result = inputText
          .split("")
          .map((char) => {
            if (char === char.toUpperCase()) return char.toLowerCase()
            return char.toUpperCase()
          })
          .join("")
        break
      default:
        result = inputText
    }

    setOutputText(result)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter or paste your text below</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleConvert} disabled={!inputText}>
              <CaseSensitive className="mr-2 h-4 w-4" />
              Convert
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Text</CardTitle>
            <CardDescription>Your converted text will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="uppercase" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="uppercase">UPPERCASE</TabsTrigger>
                <TabsTrigger value="lowercase">lowercase</TabsTrigger>
                <TabsTrigger value="titlecase">Title Case</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="sentencecase">Sentence case</TabsTrigger>
                <TabsTrigger value="alternatingcase">aLtErNaTiNg</TabsTrigger>
                <TabsTrigger value="inversecase">iNVERSE</TabsTrigger>
              </TabsList>
            </Tabs>
            <Textarea
              value={outputText}
              readOnly
              rows={8}
              className="resize-none"
              placeholder="Converted text will appear here..."
            />
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handleCopy} disabled={!outputText}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Result
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
