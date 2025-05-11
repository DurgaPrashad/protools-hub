import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Shield, Zap, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">About ProToolsHub</h1>
          <p className="text-muted-foreground md:text-xl">Your go-to platform for free online tools</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
          <p className="lead">
            ProToolsHub is a collection of free online tools designed to help you with everyday tasks. Our mission is to
            provide simple, efficient, and accessible tools that make your digital life easier.
          </p>

          <p>
            We believe that useful tools should be available to everyone, without the need for downloads, installations,
            or sign-ups. That's why we've created ProToolsHub - a one-stop destination for all the online utilities you
            need.
          </p>

          <p>
            Whether you're a student, professional, developer, or just someone looking to get things done, our tools are
            designed with you in mind. From generating QR codes to counting words, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Simple & Intuitive</CardTitle>
                <CardDescription>Easy-to-use tools with clean interfaces</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                We focus on creating tools that are straightforward and intuitive. No complicated settings or confusing
                options - just tools that work the way you expect them to.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Privacy-Focused</CardTitle>
                <CardDescription>Your data stays on your device</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Most of our tools process your data directly in your browser. We don't store your information on our
                servers, ensuring your privacy and data security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Fast & Efficient</CardTitle>
                <CardDescription>Get results instantly</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our tools are designed to be lightweight and fast. No waiting for page loads or server processing - get
                your results instantly and move on with your day.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Always Accessible</CardTitle>
                <CardDescription>Available on any device, anytime</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Access our tools from any device with a web browser. Whether you're on a desktop, tablet, or smartphone,
                our responsive design ensures a great experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Our Roadmap</h2>
          <p className="mb-4">
            We're constantly working to improve ProToolsHub and add new tools. Here's what we're planning for the
            future:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>More text manipulation tools (text case converter, lorem ipsum generator)</li>
            <li>Image tools (resizer, format converter)</li>
            <li>PDF tools (merger, splitter, compressor)</li>
            <li>Developer tools (JSON formatter, CSS minifier)</li>
            <li>Math and calculation tools (unit converters, calculators)</li>
          </ul>
          <p className="mt-4">Have a suggestion for a tool you'd like to see? Let us know through our contact page!</p>
        </div>
      </div>
    </div>
  )
}
