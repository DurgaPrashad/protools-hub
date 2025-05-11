"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, FileCode, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string): string => {
  let html = markdown

  // Headers
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>")
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>")
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>")
  html = html.replace(/^#### (.*$)/gm, "<h4>$1</h4>")
  html = html.replace(/^##### (.*$)/gm, "<h5>$1</h5>")
  html = html.replace(/^###### (.*$)/gm, "<h6>$1</h6>")

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>")

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
  html = html.replace(/_(.*?)_/g, "<em>$1</em>")

  // Links
  html = html.replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')

  // Images
  html = html.replace(/!\[(.*?)\]$$(.*?)$$/g, '<img alt="$1" src="$2">')

  // Lists
  html = html.replace(/^\* (.*$)/gm, "<li>$1</li>")
  html = html.replace(/^- (.*$)/gm, "<li>$1</li>")
  html = html.replace(/^(\d+)\. (.*$)/gm, "<li>$2</li>")

  // Wrap lists
  html = html.replace(/<li>(.*)<\/li>/g, "<ul><li>$1</li></ul>")
  html = html.replace(/<\/ul><ul>/g, "")

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")

  // Inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>")

  // Blockquotes
  html = html.replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")

  // Paragraphs
  html = html.replace(/\n\s*\n/g, "</p><p>")
  html = "<p>" + html + "</p>"
  html = html.replace(/<p><\/p>/g, "")

  // Fix nested tags
  html = html.replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, "$1")
  html = html.replace(/<p>(<ul>.*?<\/ul>)<\/p>/g, "$1")
  html = html.replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/g, "$1")
  html = html.replace(/<p>(<pre>.*?<\/pre>)<\/p>/g, "$1")

  return html
}

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState("")
  const [html, setHtml] = useState("")
  const [activeTab, setActiveTab] = useState("html")
  const { toast } = useToast()

  const convertMarkdown = () => {
    if (!markdown) return
    const convertedHtml = markdownToHtml(markdown)
    setHtml(convertedHtml)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
    toast({
      title: "Copied!",
      description: "HTML copied to clipboard",
    })
  }

  const handleClear = () => {
    setMarkdown("")
    setHtml("")
  }

  // Sample markdown for users to try
  const sampleMarkdown = `# Markdown Example

## Formatting

**Bold text** and *italic text*

## Lists

* Item 1
* Item 2
  * Nested item

## Links and Images

[Visit Google](https://google.com)

![Alt text](https://via.placeholder.com/150)

## Code

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

Inline \`code\` example

> This is a blockquote
`

  const loadSample = () => {
    setMarkdown(sampleMarkdown)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Markdown Input</CardTitle>
            <CardDescription>Enter or paste your Markdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <FileCode className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                placeholder="Type or paste your Markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button variant="outline" onClick={loadSample}>
                Load Sample
              </Button>
            </div>
            <Button onClick={convertMarkdown} disabled={!markdown}>
              Convert to HTML
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTML Output</CardTitle>
            <CardDescription>Preview and copy the generated HTML</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="mt-4">
                <Textarea
                  value={html}
                  readOnly
                  rows={12}
                  className="font-mono text-sm"
                  placeholder="HTML output will appear here..."
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-md p-4 min-h-[300px] max-h-[300px] overflow-auto">
                  {html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <p>HTML preview will appear here</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handleCopy} disabled={!html}>
              <Copy className="mr-2 h-4 w-4" />
              Copy HTML
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
