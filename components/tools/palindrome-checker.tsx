"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Search, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function PalindromeChecker() {
  const [inputText, setInputText] = useState("")
  const [result, setResult] = useState<{ isPalindrome: boolean; text: string } | null>(null)
  const [ignoreCase, setIgnoreCase] = useState(true)
  const [ignoreSpaces, setIgnoreSpaces] = useState(true)
  const [ignorePunctuation, setIgnorePunctuation] = useState(true)
  const { toast } = useToast()

  const checkPalindrome = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to check",
        variant: "destructive",
      })
      return
    }

    let processedText = inputText

    // Apply filters based on options
    if (ignoreCase) {
      processedText = processedText.toLowerCase()
    }

    if (ignoreSpaces) {
      processedText = processedText.replace(/\s/g, "")
    }

    if (ignorePunctuation) {
      processedText = processedText.replace(/[^\w\s]|_/g, "")
    }

    // Check if it's a palindrome
    const reversed = processedText.split("").reverse().join("")
    const isPalindrome = processedText === reversed

    setResult({
      isPalindrome,
      text: processedText,
    })

    toast({
      title: isPalindrome ? "It's a palindrome!" : "Not a palindrome",
      description: isPalindrome
        ? `"${inputText}" reads the same forward and backward.`
        : `"${inputText}" is not a palindrome.`,
      variant: isPalindrome ? "default" : "destructive",
    })
  }

  const handleClear = () => {
    setInputText("")
    setResult(null)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Palindrome Checker</CardTitle>
            <CardDescription>Check if a word or phrase is a palindrome</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to check..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignore-case"
                    checked={ignoreCase}
                    onCheckedChange={(checked) => setIgnoreCase(checked === true)}
                  />
                  <Label htmlFor="ignore-case">Ignore case (A = a)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignore-spaces"
                    checked={ignoreSpaces}
                    onCheckedChange={(checked) => setIgnoreSpaces(checked === true)}
                  />
                  <Label htmlFor="ignore-spaces">Ignore spaces</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignore-punctuation"
                    checked={ignorePunctuation}
                    onCheckedChange={(checked) => setIgnorePunctuation(checked === true)}
                  />
                  <Label htmlFor="ignore-punctuation">Ignore punctuation</Label>
                </div>
              </div>

              {result && (
                <div
                  className={`p-4 rounded-md ${result.isPalindrome ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}
                >
                  <div className="flex items-center">
                    {result.isPalindrome ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <p className="font-medium">{result.isPalindrome ? "It's a palindrome!" : "Not a palindrome"}</p>
                  </div>
                  <p className="text-sm mt-2">
                    {result.isPalindrome
                      ? `"${result.text}" reads the same forward and backward.`
                      : `"${result.text}" is not the same when reversed.`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={checkPalindrome} disabled={!inputText.trim()}>
              <Search className="mr-2 h-4 w-4" />
              Check
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Palindromes</CardTitle>
            <CardDescription>Words or phrases that read the same backward as forward</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What is a Palindrome?</h3>
              <p className="text-sm text-muted-foreground">
                A palindrome is a word, number, phrase, or other sequence of characters that reads the same forward and
                backward, ignoring spaces, punctuation, and capitalization.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Famous Palindromes</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>"A man, a plan, a canal, Panama!"</li>
                <li>"Madam, I'm Adam"</li>
                <li>"Never odd or even"</li>
                <li>"Able was I ere I saw Elba"</li>
                <li>"Rats live on no evil star"</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Single Word Palindromes</h3>
              <div className="flex flex-wrap gap-2">
                {["radar", "level", "civic", "madam", "refer", "racecar", "kayak", "reviver", "redivider"].map(
                  (word) => (
                    <div key={word} className="px-2 py-1 bg-muted rounded-md text-sm">
                      {word}
                    </div>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
