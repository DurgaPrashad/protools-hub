"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench } from "lucide-react"

export function HeroSection() {
  return (
    <div className="py-12 md:py-24 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-primary/10 p-4">
            <Wrench className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">ProToolsHub - Your Online Toolkit</h1>
        <p className="text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto mb-8">
          Free online tools to help you with everyday tasks. No downloads, no sign-ups, just tools that work.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#tools">Explore Tools</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
