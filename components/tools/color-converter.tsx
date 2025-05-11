"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Palette, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ColorConverter() {
  const [hexColor, setHexColor] = useState("#1e88e5")
  const [rgbColor, setRgbColor] = useState({ r: 30, g: 136, b: 229 })
  const [hslColor, setHslColor] = useState({ h: 210, s: 82, l: 51 })
  const [activeTab, setActiveTab] = useState("hex")
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return null
    return {
      r: Number.parseInt(result[1], 16),
      g: Number.parseInt(result[2], 16),
      b: Number.parseInt(result[3], 16),
    }
  }

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Update all colors when hex changes
  const updateFromHex = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setError("")
      const rgb = hexToRgb(hex)
      if (rgb) {
        setRgbColor(rgb)
        setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b))
      }
    } else {
      setError("Invalid HEX color format. Use #RRGGBB")
    }
  }

  // Update all colors when RGB changes
  const updateFromRgb = (r: number, g: number, b: number) => {
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      setError("")
      setHexColor(rgbToHex(r, g, b))
      setHslColor(rgbToHsl(r, g, b))
    } else {
      setError("RGB values must be between 0 and 255")
    }
  }

  // Update all colors when HSL changes
  const updateFromHsl = (h: number, s: number, l: number) => {
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      setError("")
      const rgb = hslToRgb(h, s, l)
      setRgbColor(rgb)
      setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    } else {
      setError("H must be 0-360, S and L must be 0-100")
    }
  }

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setHexColor(hex)
    if (hex.length === 7) {
      updateFromHex(hex)
    }
  }

  // Handle RGB input change
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newRgb = { ...rgbColor, [component]: numValue }
    setRgbColor(newRgb)
    updateFromRgb(newRgb.r, newRgb.g, newRgb.b)
  }

  // Handle HSL input change
  const handleHslChange = (component: "h" | "s" | "l", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newHsl = { ...hslColor, [component]: numValue }
    setHslColor(newHsl)
    updateFromHsl(newHsl.h, newHsl.s, newHsl.l)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Color value copied to clipboard",
    })
  }

  const handleReset = () => {
    setHexColor("#1e88e5")
    setRgbColor({ r: 30, g: 136, b: 229 })
    setHslColor({ h: 210, s: 82, l: 51 })
    setError("")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Color Converter</CardTitle>
            <CardDescription>Convert between HEX, RGB, and HSL color formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="hex" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
              <TabsContent value="hex" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="hex-color">HEX Color</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(hexColor) ? hexColor : "#CCCCCC" }}
                    />
                    <Input
                      id="hex-color"
                      value={hexColor}
                      onChange={handleHexChange}
                      placeholder="#RRGGBB"
                      className="font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="rgb" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rgb-r">R</Label>
                    <Input
                      id="rgb-r"
                      type="number"
                      min="0"
                      max="255"
                      value={rgbColor.r}
                      onChange={(e) => handleRgbChange("r", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rgb-g">G</Label>
                    <Input
                      id="rgb-g"
                      type="number"
                      min="0"
                      max="255"
                      value={rgbColor.g}
                      onChange={(e) => handleRgbChange("g", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rgb-b">B</Label>
                    <Input
                      id="rgb-b"
                      type="number"
                      min="0"
                      max="255"
                      value={rgbColor.b}
                      onChange={(e) => handleRgbChange("b", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="hsl" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsl-h">H</Label>
                    <Input
                      id="hsl-h"
                      type="number"
                      min="0"
                      max="360"
                      value={hslColor.h}
                      onChange={(e) => handleHslChange("h", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsl-s">S (%)</Label>
                    <Input
                      id="hsl-s"
                      type="number"
                      min="0"
                      max="100"
                      value={hslColor.s}
                      onChange={(e) => handleHslChange("s", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsl-l">L (%)</Label>
                    <Input
                      id="hsl-l"
                      type="number"
                      min="0"
                      max="100"
                      value={hslColor.l}
                      onChange={(e) => handleHslChange("l", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={() =>
                handleCopy(
                  activeTab === "hex"
                    ? hexColor
                    : activeTab === "rgb"
                      ? `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
                      : `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`,
                )
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy {activeTab.toUpperCase()}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Preview</CardTitle>
            <CardDescription>See your color in different formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="w-full h-32 rounded-md border"
              style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(hexColor) ? hexColor : "#CCCCCC" }}
            ></div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>HEX</Label>
                <div className="flex items-center">
                  <Input value={hexColor} readOnly className="font-mono" />
                  <Button variant="ghost" size="icon" />
                  <Button variant="ghost" size="icon" className="ml-2" onClick={() => handleCopy(hexColor)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy HEX</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>RGB</Label>
                <div className="flex items-center">
                  <Input value={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`} readOnly className="font-mono" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleCopy(`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy RGB</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>HSL</Label>
                <div className="flex items-center">
                  <Input value={`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`} readOnly className="font-mono" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleCopy(`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy HSL</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setActiveTab("hex")}>
              <Palette className="mr-2 h-4 w-4" />
              Edit This Color
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
