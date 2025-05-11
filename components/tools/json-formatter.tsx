"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, FileCode, RotateCcw, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [error, setError] = useState("")
  const [indentSize, setIndentSize] = useState(2)
  const { toast } = useToast()

  const formatJson = () => {
    if (!inputJson.trim()) {
      setError("Please enter JSON to format")
      setOutputJson("")
      return
    }

    try {
      setError("")
      const parsedJson = JSON.parse(inputJson)
      const formattedJson = JSON.stringify(parsedJson, null, indentSize)
      setOutputJson(formattedJson)
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutputJson("")
    }
  }

  const minifyJson = () => {
    if (!inputJson.trim()) {
      setError("Please enter JSON to minify")
      setOutputJson("")
      return
    }

    try {
      setError("")
      const parsedJson = JSON.parse(inputJson)
      const minifiedJson = JSON.stringify(parsedJson)
      setOutputJson(minifiedJson)
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutputJson("")
    }
  }

  const validateJson = () => {
    if (!inputJson.trim()) {
      setError("Please enter JSON to validate")
      setOutputJson("")
      return
    }

    try {
      setError("")
      JSON.parse(inputJson)
      setOutputJson("JSON is valid!")
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid",
      })
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutputJson("")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson)
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputJson("")
    setOutputJson("")
    setError("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>JSON Input</CardTitle>
            <CardDescription>Enter or paste your JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <FileCode className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                placeholder="Paste your JSON here..."
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Tabs defaultValue="2" onValueChange={(value) => setIndentSize(Number.parseInt(value))}>
                <TabsList>
                  <TabsTrigger value="2">2 Spaces</TabsTrigger>
                  <TabsTrigger value="4">4 Spaces</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions & Output</CardTitle>
            <CardDescription>Format, minify, or validate your JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={formatJson} disabled={!inputJson}>
                Format
              </Button>
              <Button onClick={minifyJson} disabled={!inputJson}>
                Minify
              </Button>
              <Button variant="outline" onClick={validateJson} disabled={!inputJson}>
                <Check className="mr-2 h-4 w-4" />
                Validate
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Textarea
              value={outputJson}
              readOnly
              rows={10}
              className={`font-mono text-sm ${!outputJson ? "text-muted-foreground" : ""}`}
              placeholder="Output will appear here..."
            />
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handleCopy} disabled={!outputJson}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Result
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
