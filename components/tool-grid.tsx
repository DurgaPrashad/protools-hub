"use client"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { allTools } from "@/data/tools"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Get the most popular tools
const popularTools = [...allTools].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 12)

export function ToolGrid() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/search")
    }
  }

  return (
    <section id="tools" className="py-12">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter mb-2">Our Tools</h2>
          <p className="text-muted-foreground md:text-xl">Explore our collection of free online tools</p>
        </div>

        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search from over 50+ tools..."
              className="pl-10 pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button className="absolute right-1 top-1 h-8" size="sm" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
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

        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link href="/search">View All 50+ Tools</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
