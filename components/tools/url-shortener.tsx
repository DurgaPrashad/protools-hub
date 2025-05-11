"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Mock function to simulate URL shortening
const shortenUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate URL
    try {
      new URL(url)
    } catch (e) {
      reject(new Error("Invalid URL. Please enter a valid URL including http:// or https://"))
      return
    }

    // Generate a random short code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let shortCode = ""
    for (let i = 0; i < 6; i++) {
      shortCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    // In a real app, this would save to a database
    setTimeout(() => {
      resolve(`https://short.url/${shortCode}`)
    }, 500)
  })
}

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isValidUrl, setIsValidUrl] = useState(false)
  const { toast } = useToast()

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      setIsValidUrl(true)
      setError("")
    } catch (e) {
      setIsValidUrl(false)
      if (url) {
        setError("Please enter a valid URL including http:// or https://")
      } else {
        setError("")
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setLongUrl(url)
    validateUrl(url)
  }

  const handleShorten = async () => {
    if (!longUrl) {
      setError("Please enter a URL to shorten")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await shortenUrl(longUrl)
      setShortUrl(result)
      toast({
        title: "URL shortened",
        description: "Your shortened URL is ready to use",
      })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    })
  }

  const handleClear = () => {
    setLongUrl("")
    setShortUrl("")
    setError("")
    setIsValidUrl(false)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>URL Shortener</CardTitle>
            <CardDescription>Shorten long URLs for easier sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="long-url">Enter Long URL</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="long-url"
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    value={longUrl}
                    onChange={handleUrlChange}
                    className="pr-10"
                  />
                  {longUrl && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Enter a complete URL including http:// or https://</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleShorten} disabled={!isValidUrl || isLoading}>
              {isLoading ? (
                "Shortening..."
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Shorten URL
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Shortened URL</CardTitle>
            <CardDescription>Use this link to share with others</CardDescription>
          </CardHeader>
          <CardContent>
            {shortUrl ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-mono break-all">{shortUrl}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground truncate">{longUrl}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Your shortened URL will appear here</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCopy} disabled={!shortUrl}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Shortened URL
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About URL Shortening</CardTitle>
          <CardDescription>Benefits of using shortened URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Shortened URLs are easier to share in emails, messages, and social media posts.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Track Clicks</h3>
              <p className="text-sm text-muted-foreground">
                Many URL shorteners provide analytics to track how many people click your links.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Cleaner Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Short URLs look cleaner and more professional than long, complex URLs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
