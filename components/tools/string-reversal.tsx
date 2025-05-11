"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StringReversal() {
  const [inputText, setInputText] = useState("")
  const [reversedText, setReversedText] = useState("")
  const { toast } = useToast()

  const handleReverse = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to reverse",
        variant: "destructive",
      })
      return
    }

    const reversed = inputText.split("").reverse().join("")
    setReversedText(reversed)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText)
    toast({
      title: "Copied!",
      description: "Reversed text copied to clipboard",
    })
  }

  const handleClear = () => {
    setInputText("")
    setReversedText("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>String Reversal</CardTitle>
            <CardDescription>Reverse any given string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to reverse..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                value={reversedText}
                readOnly
                rows={6}
                className="resize-none"
                placeholder="Reversed text will appear here..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button onClick={handleReverse} disabled={!inputText.trim()}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Reverse
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!reversedText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About String Reversal</CardTitle>
            <CardDescription>How and why to reverse strings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What is String Reversal?</h3>
              <p className="text-sm text-muted-foreground">
                String reversal is the process of changing the order of characters in a string so that the last
                character becomes the first, the second-to-last becomes the second, and so on.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Common Uses</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Checking for palindromes</li>
                <li>Creating word puzzles and games</li>
                <li>Text obfuscation</li>
                <li>Programming exercises and challenges</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Examples</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-medium">Original</p>
                  <p>Hello World</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-medium">Reversed</p>
                  <p>dlroW olleH</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-medium">Original</p>
                  <p>ProToolsHub</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="font-medium">Reversed</p>
                  <p>buHslooTorP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
