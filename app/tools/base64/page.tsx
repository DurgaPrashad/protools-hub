"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, FileCode, ArrowDownUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Base64Tool() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState("encode")
  const [error, setError] = useState("")

  const handleEncode = () => {
    try {
      setError("")
      const encoded = btoa(inputText)
      setOutputText(encoded)
    } catch (e) {
      setError("Error encoding: Text contains characters that cannot be encoded to Base64")
    }
  }

  const handleDecode = () => {
    try {
      setError("")
      const decoded = atob(inputText)
      setOutputText(decoded)
    } catch (e) {
      setError("Error decoding: Input is not valid Base64")
    }
  }

  const handleProcess = () => {
    if (mode === "encode") {
      handleEncode()
    } else {
      handleDecode()
    }
  }

  const handleSwap = () => {
    setInputText(outputText)
    setOutputText("")
    setError("")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError("")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Base64 Encoder/Decoder</h1>
          <p className="text-muted-foreground md:text-xl">Convert text to and from Base64 encoding</p>
        </div>

        <Tabs defaultValue="encode" onValueChange={(value) => setMode(value)}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{mode === "encode" ? "Text to Encode" : "Base64 to Decode"}</CardTitle>
                <CardDescription>
                  {mode === "encode"
                    ? "Enter the text you want to convert to Base64"
                    : "Enter the Base64 string you want to decode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-2">
                  <FileCode className="h-4 w-4 text-muted-foreground mt-2" />
                  <Textarea
                    placeholder={
                      mode === "encode" ? "Type or paste your text here..." : "Paste Base64 encoded text here..."
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleClear}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleSwap} disabled={!outputText}>
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    Swap
                  </Button>
                  <Button onClick={handleProcess} disabled={!inputText}>
                    {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>{mode === "encode" ? "Base64 encoded output" : "Decoded text output"}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={outputText}
                  readOnly
                  rows={6}
                  placeholder={
                    mode === "encode" ? "Base64 output will appear here..." : "Decoded text will appear here..."
                  }
                  className={!outputText ? "text-muted-foreground" : ""}
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
        </Tabs>

        <div className="mt-12 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About Base64 Encoding</h2>
          <p className="mb-4">
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's
            commonly used when there's a need to encode binary data that needs to be stored and transferred over media
            that are designed to deal with text.
          </p>
          <h3 className="text-lg font-semibold mb-2">Common Uses:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encoding binary data in JSON</li>
            <li>Embedding image data in CSS or HTML</li>
            <li>Encoding email attachments (MIME)</li>
            <li>Storing complex data in cookies or local storage</li>
            <li>Basic data obfuscation (not secure encryption)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
