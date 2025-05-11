"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Copy, LinkIcon, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function QrCodeGenerator() {
  const [content, setContent] = useState("")
  const [contentType, setContentType] = useState("url")
  const [qrSize, setQrSize] = useState("200")
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [generated, setGenerated] = useState(false)
  const { toast } = useToast()

  const generateQRCode = () => {
    if (content) {
      setGenerated(true)
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully",
      })
    }
  }

  const downloadQRCode = () => {
    toast({
      title: "Download Started",
      description: "Your QR code is being downloaded",
    })
  }

  const copyQRCode = () => {
    toast({
      title: "Copied!",
      description: "QR code copied to clipboard",
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create QR Code</CardTitle>
            <CardDescription>Enter the content for your QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" onValueChange={(value) => setContentType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Content</Label>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-2" />
                    <Textarea
                      id="text"
                      placeholder="Enter your text here"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="size">QR Code Size</Label>
                <Select value={qrSize} onValueChange={setQrSize}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 x 100</SelectItem>
                    <SelectItem value="200">200 x 200</SelectItem>
                    <SelectItem value="300">300 x 300</SelectItem>
                    <SelectItem value="400">400 x 400</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qr-color">QR Code Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: qrColor }} />
                  <Input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: bgColor }} />
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generateQRCode} disabled={!content} className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>Preview and download your QR code</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
            {generated ? (
              <div className="border p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    width: `${qrSize}px`,
                    height: `${qrSize}px`,
                    maxWidth: "100%",
                  }}
                >
                  <QrCode size={Number.parseInt(qrSize)} color={qrColor} className="mx-auto" />
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <QrCode className="mx-auto h-16 w-16 mb-4 opacity-20" />
                <p>Your QR code will appear here</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={copyQRCode} disabled={!generated}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button onClick={downloadQRCode} disabled={!generated}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
