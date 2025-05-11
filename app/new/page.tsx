"use client"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { allTools } from "@/data/tools"

export default function NewToolsPage() {
  // For demonstration, we'll just show all tools but could be filtered by date added
  const newTools = [...allTools].slice(0, 20) // Show first 20 tools as "new"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">New Tools</h1>
        <p className="text-muted-foreground md:text-xl">Our latest additions to the toolkit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newTools.map((tool) => (
          <Link key={tool.id} href={`/tools/${tool.id}`} className="block group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start">
                <div className="flex flex-wrap gap-1 mb-2">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-sm text-primary group-hover:underline">Try it now →</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
