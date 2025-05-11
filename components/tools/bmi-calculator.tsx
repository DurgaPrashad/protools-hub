"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Weight, Calculator, RotateCcw } from "lucide-react"

export default function BmiCalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState("metric")
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState("")

  const calculateBmi = () => {
    if (!height || !weight) return

    let bmiValue: number

    if (unit === "metric") {
      // Metric: weight (kg) / height (m)^2
      const heightInMeters = Number.parseFloat(height) / 100
      bmiValue = Number.parseFloat(weight) / (heightInMeters * heightInMeters)
    } else {
      // Imperial: (weight (lbs) * 703) / height (inches)^2
      bmiValue = (Number.parseFloat(weight) * 703) / (Number.parseFloat(height) * Number.parseFloat(height))
    }

    setBmi(bmiValue)

    // Determine BMI category
    if (bmiValue < 18.5) {
      setCategory("Underweight")
    } else if (bmiValue < 25) {
      setCategory("Normal weight")
    } else if (bmiValue < 30) {
      setCategory("Overweight")
    } else {
      setCategory("Obesity")
    }
  }

  const resetCalculator = () => {
    setHeight("")
    setWeight("")
    setBmi(null)
    setCategory("")
  }

  const getBmiColor = () => {
    if (!bmi) return "bg-gray-200"
    if (bmi < 18.5) return "bg-blue-500"
    if (bmi < 25) return "bg-green-500"
    if (bmi < 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>BMI Calculator</CardTitle>
            <CardDescription>Calculate your Body Mass Index</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="metric" value={unit} onValueChange={setUnit}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>
              <TabsContent value="metric" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="height-cm">Height (cm)</Label>
                  <Input
                    id="height-cm"
                    type="number"
                    placeholder="e.g., 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-kg">Weight (kg)</Label>
                  <Input
                    id="weight-kg"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="imperial" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="height-in">Height (inches)</Label>
                  <Input
                    id="height-in"
                    type="number"
                    placeholder="e.g., 69"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight-lb">Weight (lbs)</Label>
                  <Input
                    id="weight-lb"
                    type="number"
                    placeholder="e.g., 154"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetCalculator}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={calculateBmi} disabled={!height || !weight}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate BMI
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your BMI Result</CardTitle>
            <CardDescription>Body Mass Index analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {bmi ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-40 h-40 rounded-full flex items-center justify-center bg-primary/10">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{bmi.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">BMI</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-center font-medium text-lg">
                    Your BMI indicates: <span className="font-bold">{category}</span>
                  </p>

                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBmiColor()}`}
                      style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium mb-2">What your BMI means:</p>
                  <ul className="space-y-1 list-disc pl-4">
                    <li>Below 18.5 – Underweight</li>
                    <li>18.5 to 24.9 – Normal weight</li>
                    <li>25 to 29.9 – Overweight</li>
                    <li>30 and above – Obesity</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Note: BMI is a screening tool, not a diagnostic tool. Consult a healthcare provider for a complete
                    health assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Weight className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Enter your height and weight, then click "Calculate BMI" to see your results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
