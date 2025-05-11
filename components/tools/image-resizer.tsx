"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ImageIcon, Download, RefreshCw, Crop } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resizedUrl, setResizedUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [resizeMethod, setResizeMethod] = useState("dimensions")
  const [scalePercent, setScalePercent] = useState(50)
  const [quality, setQuality] = useState(90)
  const [format, setFormat] = useState("jpeg")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (resizedUrl) URL.revokeObjectURL(resizedUrl)
    }
  }, [previewUrl, resizedUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Clean up previous preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (resizedUrl) URL.revokeObjectURL(resizedUrl)

    setSelectedFile(file)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setResizedUrl(null)

    // Get original dimensions
    const img = new Image()
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height })

      // Set default resize dimensions to original
      setWidth(img.width)
      setHeight(img.height)
    }
    img.src = objectUrl
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseInt(e.target.value) || 0
    setWidth(newWidth)

    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseInt(e.target.value) || 0
    setHeight(newHeight)

    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number.parseInt(e.target.value) || 0
    setScalePercent(newScale)

    if (originalDimensions.width > 0) {
      setWidth(Math.round((originalDimensions.width * newScale) / 100))
      setHeight(Math.round((originalDimensions.height * newScale) / 100))
    }
  }

  const resizeImage = () => {
    if (!selectedFile || !previewUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Set canvas dimensions to target size
      canvas.width = width
      canvas.height = height

      // Draw image at new size
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return

          // Clean up previous resized URL
          if (resizedUrl) URL.revokeObjectURL(resizedUrl)

          // Create new URL for resized image
          const newResizedUrl = URL.createObjectURL(blob)
          setResizedUrl(newResizedUrl)

          toast({
            title: "Image resized",
            description: `New dimensions: ${width}×${height} pixels`,
          })
        },
        `image/${format}`,
        quality / 100,
      )
    }

    img.src = previewUrl
  }

  const downloadResizedImage = () => {
    if (!resizedUrl) return

    const link = document.createElement("a")
    link.href = resizedUrl
    link.download = `resized-${selectedFile?.name || "image"}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetImage = () => {
    if (selectedFile && previewUrl) {
      // Reset dimensions to original
      setWidth(originalDimensions.width)
      setHeight(originalDimensions.height)
      setScalePercent(100)
      setResizedUrl(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Image Resizer</CardTitle>
            <CardDescription>Resize images to specific dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Original size: {originalDimensions.width}×{originalDimensions.height} pixels
                </p>
              )}
            </div>

            {selectedFile && (
              <>
                <Tabs defaultValue="dimensions" value={resizeMethod} onValueChange={setResizeMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dimensions">Custom Dimensions</TabsTrigger>
                    <TabsTrigger value="scale">Scale Percentage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dimensions" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" min="1" value={width} onChange={handleWidthChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" min="1" value={height} onChange={handleHeightChange} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                      <Label htmlFor="aspect-ratio" className="cursor-pointer">
                        Maintain aspect ratio
                      </Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="scale" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="scale">Scale: {scalePercent}%</Label>
                      </div>
                      <Input
                        id="scale"
                        type="range"
                        min="1"
                        max="100"
                        value={scalePercent}
                        onChange={handleScaleChange}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      New dimensions: {width}×{height} pixels
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality: {quality}%</Label>
                    <Input
                      id="quality"
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Tabs defaultValue="jpeg" value={format} onValueChange={setFormat}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="jpeg">JPEG</TabsTrigger>
                        <TabsTrigger value="png">PNG</TabsTrigger>
                        <TabsTrigger value="webp">WebP</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetImage} disabled={!selectedFile}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={resizeImage} disabled={!selectedFile}>
              <Crop className="mr-2 h-4 w-4" />
              Resize Image
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Original and resized image preview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFile ? (
              <div className="space-y-4">
                <div className="border rounded-md p-2">
                  <p className="text-sm font-medium mb-2">Original Image:</p>
                  <div className="flex justify-center">
                    <img src={previewUrl || ""} alt="Original" className="max-w-full max-h-[200px] object-contain" />
                  </div>
                </div>

                {resizedUrl && (
                  <div className="border rounded-md p-2">
                    <p className="text-sm font-medium mb-2">Resized Image:</p>
                    <div className="flex justify-center">
                      <img
                        src={resizedUrl || "/placeholder.svg"}
                        alt="Resized"
                        className="max-w-full max-h-[200px] object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload an image to preview</p>
                <p className="text-xs mt-2">Supported formats: JPEG, PNG, WebP, GIF</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={downloadResizedImage} disabled={!resizedUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
