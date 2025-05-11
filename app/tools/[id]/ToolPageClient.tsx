"use client"

import type React from "react"

import { useState } from "react"
import type { Tool } from "@/data/tools"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Import all tool components
import { WordCounter } from "@/components/tools/word-counter"
import { Base64Tool } from "@/components/tools/base64-tool"
import { AgeCalculator } from "@/components/tools/age-calculator"
import { QrCodeGenerator } from "@/components/tools/qr-code-generator"
import { TextCaseConverter } from "@/components/tools/text-case-converter"
import { LoremIpsumGenerator } from "@/components/tools/lorem-ipsum-generator"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { ColorConverter } from "@/components/tools/color-converter"
import { RandomNumberGenerator } from "@/components/tools/random-number-generator"
import { UnitConverter } from "@/components/tools/unit-converter"
import { JsonFormatter } from "@/components/tools/json-formatter"
import { MarkdownToHtml } from "@/components/tools/markdown-to-html"
import { BmiCalculator } from "@/components/tools/bmi-calculator"
import { CountdownTimer } from "@/components/tools/countdown-timer"
import { PercentageCalculator } from "@/components/tools/percentage-calculator"
import { BinaryConverter } from "@/components/tools/binary-converter"
import { CurrencyConverter } from "@/components/tools/currency-converter"
import { DateDifference } from "@/components/tools/date-difference"
import { ImageResizer } from "@/components/tools/image-resizer"
import { UrlShortener } from "@/components/tools/url-shortener"
import { TimeZoneConverter } from "@/components/tools/time-zone-converter"
import { StringReversal } from "@/components/tools/string-reversal"
import { PalindromeChecker } from "@/components/tools/palindrome-checker"
import { TextToSpeech } from "@/components/tools/text-to-speech"
import { SpeechToText } from "@/components/tools/speech-to-text"
import { TextTranslator } from "@/components/tools/text-translator"
import { TextToEmoji } from "@/components/tools/text-to-emoji"
import { EmojiSearch } from "@/components/tools/emoji-search"
import { GrammarChecker } from "@/components/tools/grammar-checker"
import { allTools } from "@/data/tools"

// Map tool IDs to their respective components
const toolComponents: Record<string, React.ComponentType<any>> = {
  "word-counter": WordCounter,
  base64: Base64Tool,
  "age-calculator": AgeCalculator,
  "qr-code-generator": QrCodeGenerator,
  "text-case-converter": TextCaseConverter,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "password-generator": PasswordGenerator,
  "color-converter": ColorConverter,
  "random-number-generator": RandomNumberGenerator,
  "unit-converter": UnitConverter,
  "json-formatter": JsonFormatter,
  "markdown-to-html": MarkdownToHtml,
  "bmi-calculator": BmiCalculator,
  "countdown-timer": CountdownTimer,
  "percentage-calculator": PercentageCalculator,
  "binary-converter": BinaryConverter,
  "currency-converter": CurrencyConverter,
  "date-difference": DateDifference,
  "image-resizer": ImageResizer,
  "url-shortener": UrlShortener,
  "timezone-converter": TimeZoneConverter,
  "string-reversal": StringReversal,
  "palindrome-checker": PalindromeChecker,
  "text-to-speech": TextToSpeech,
  "speech-to-text": SpeechToText,
  "text-translator": TextTranslator,
  "text-to-emoji": TextToEmoji,
  "emoji-search": EmojiSearch,
  "grammar-checker": GrammarChecker,
}

interface ToolPageClientProps {
  tool: Tool
}

export function ToolPageClient({ tool }: ToolPageClientProps) {
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tool.title} | ProToolsHub`,
          text: tool.description,
          url: window.location.href,
        })
        toast({
          title: "Shared successfully",
          description: "Thanks for sharing this tool!",
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share the link!",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing this tool.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Get the component for this tool
  const ToolComponent = toolComponents[tool.id]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <tool.icon className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">{tool.title}</h1>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleShare}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tool.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">We're still working on this tool. Check back soon!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>How to use this tool</CardTitle>
            <CardDescription>Simple instructions to get the most out of this tool</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Enter your input in the provided field(s)</li>
              <li>Adjust any settings or options as needed</li>
              <li>Click the action button to process your input</li>
              <li>View and copy your results</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Tools</CardTitle>
            <CardDescription>You might also find these tools useful</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {allTools
                .filter(
                  (t) =>
                    t.id !== tool.id && (t.category === tool.category || t.tags.some((tag) => tool.tags.includes(tag))),
                )
                .slice(0, 5)
                .map((relatedTool) => (
                  <li key={relatedTool.id}>
                    <a
                      href={`/tools/${relatedTool.id}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <relatedTool.icon className="h-4 w-4" />
                      {relatedTool.title}
                    </a>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
