"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, FileText, Clock, RotateCcw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Calculate stats when text changes
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(words / 200)

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    })
  }, [text])

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleClear = () => {
    setText("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Text</CardTitle>
            <CardDescription>Paste or type your text below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="resize-y min-h-[200px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCopy} disabled={!text}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Statistics</CardTitle>
            <CardDescription>Analysis of your text</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Stats</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{stats.words}</p>
                    <p className="text-sm text-muted-foreground">Words</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{stats.characters}</p>
                    <p className="text-sm text-muted-foreground">Characters</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{stats.charactersNoSpaces}</p>
                    <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{stats.sentences}</p>
                    <p className="text-sm text-muted-foreground">Sentences</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{stats.paragraphs}</p>
                    <p className="text-sm text-muted-foreground">Paragraphs</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <p className="text-3xl font-bold">{stats.readingTime}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Min. reading time</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
