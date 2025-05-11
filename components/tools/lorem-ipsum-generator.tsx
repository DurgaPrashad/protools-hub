"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, AlignJustify, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

// Lorem ipsum text
const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.`

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3)
  const [words, setWords] = useState(50)
  const [type, setType] = useState("paragraphs")
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [generatedText, setGeneratedText] = useState("")
  const { toast } = useToast()

  const generateLoremIpsum = () => {
    let result = ""

    if (type === "paragraphs") {
      for (let i = 0; i < paragraphs; i++) {
        let paragraph = ""
        if (i === 0 && startWithLorem) {
          paragraph = loremIpsumText
        } else {
          // Generate a random paragraph
          paragraph = loremIpsumText
            .split(" ")
            .sort(() => 0.5 - Math.random())
            .join(" ")
        }
        result += paragraph + "\n\n"
      }
    } else {
      // Generate words
      const allWords = loremIpsumText.split(" ")
      let selectedWords = []

      if (startWithLorem) {
        selectedWords = ["Lorem", "ipsum", "dolor", "sit", "amet"]
        const remaining = words - 5
        if (remaining > 0) {
          selectedWords = selectedWords.concat(
            allWords
              .slice(5)
              .sort(() => 0.5 - Math.random())
              .slice(0, remaining),
          )
        }
      } else {
        selectedWords = allWords.sort(() => 0.5 - Math.random()).slice(0, words)
      }

      result = selectedWords.join(" ")
    }

    setGeneratedText(result.trim())
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText)
    toast({
      title: "Copied!",
      description: "Lorem ipsum text copied to clipboard",
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Lorem Ipsum Generator</CardTitle>
            <CardDescription>Generate placeholder text for your designs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="paragraphs" onValueChange={(value) => setType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                <TabsTrigger value="words">Words</TabsTrigger>
              </TabsList>
              <TabsContent value="paragraphs" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="paragraphs"
                      type="number"
                      min="1"
                      max="10"
                      value={paragraphs}
                      onChange={(e) => setParagraphs(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="words" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="words">Number of Words</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="words"
                      type="number"
                      min="5"
                      max="1000"
                      value={words}
                      onChange={(e) => setWords(Number.parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>Options</Label>
              <RadioGroup defaultValue="lorem" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="lorem"
                    id="lorem"
                    checked={startWithLorem}
                    onClick={() => setStartWithLorem(true)}
                  />
                  <Label htmlFor="lorem">Start with "Lorem ipsum dolor sit amet..."</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="random"
                    id="random"
                    checked={!startWithLorem}
                    onClick={() => setStartWithLorem(false)}
                  />
                  <Label htmlFor="random">Start with random text</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generateLoremIpsum} className="w-full">
              <AlignJustify className="mr-2 h-4 w-4" />
              Generate Lorem Ipsum
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Text</CardTitle>
            <CardDescription>Your lorem ipsum text will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedText}
              readOnly
              rows={12}
              className="resize-none"
              placeholder="Click 'Generate Lorem Ipsum' to create text..."
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedText("")} disabled={!generatedText}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCopy} disabled={!generatedText}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
