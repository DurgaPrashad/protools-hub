"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, Key, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PasswordGenerator() {
  const [passwordLength, setPasswordLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let chars = ""
    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    let generatedPassword = ""
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      generatedPassword += chars[randomIndex]
    }

    setPassword(generatedPassword)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  const getPasswordStrength = () => {
    if (!password) return { text: "None", color: "bg-gray-200" }

    let strength = 0
    if (includeUppercase) strength += 1
    if (includeLowercase) strength += 1
    if (includeNumbers) strength += 1
    if (includeSymbols) strength += 1

    if (passwordLength < 8) {
      return { text: "Weak", color: "bg-red-500" }
    } else if (passwordLength < 12) {
      return strength <= 2 ? { text: "Weak", color: "bg-red-500" } : { text: "Medium", color: "bg-yellow-500" }
    } else if (passwordLength < 16) {
      return strength <= 2 ? { text: "Medium", color: "bg-yellow-500" } : { text: "Strong", color: "bg-green-500" }
    } else {
      return strength <= 2 ? { text: "Medium", color: "bg-yellow-500" } : { text: "Very Strong", color: "bg-green-700" }
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Password Generator</CardTitle>
            <CardDescription>Create secure, random passwords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password-length">Password Length: {passwordLength}</Label>
              </div>
              <Slider
                id="password-length"
                min={4}
                max={32}
                step={1}
                value={[passwordLength]}
                onValueChange={(value) => setPasswordLength(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>16</span>
                <span>32</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Character Types</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="cursor-pointer">
                    Include Uppercase Letters (A-Z)
                  </Label>
                  <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="cursor-pointer">
                    Include Lowercase Letters (a-z)
                  </Label>
                  <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="cursor-pointer">
                    Include Numbers (0-9)
                  </Label>
                  <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="cursor-pointer">
                    Include Symbols (!@#$%^&*)
                  </Label>
                  <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generatePassword} className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Password</CardTitle>
            <CardDescription>Generated secure password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Input
                value={password}
                readOnly
                type={showPassword ? "text" : "password"}
                placeholder="Your password will appear here"
                className="pr-10 font-mono"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>

            {password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Password Strength</Label>
                  <span className="text-sm font-medium">{passwordStrength.text}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color}`}
                    style={{ width: `${(password.length / 32) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setPassword("")} disabled={!password}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCopy} disabled={!password}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Password
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
