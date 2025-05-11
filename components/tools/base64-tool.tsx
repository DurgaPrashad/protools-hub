"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, FileCode, ArrowDownUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function Base64Tool() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState("encode")
  const [error, setError] = useState("")
  const { toast } = useToast()

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
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError("")
  }

  return (
    <div className="space-y-8">
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
    </div>
  )
}
