"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { allTools } from "@/data/tools"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredTools, setFilteredTools] = useState(allTools)
  const [activeCategory, setActiveCategory] = useState("all")

  // Get unique categories
  const categories = ["all", ...new Set(allTools.map((tool) => tool.category))]

  useEffect(() => {
    filterTools(searchQuery, activeCategory)
  }, [searchQuery, activeCategory])

  const filterTools = (query: string, category: string) => {
    let filtered = [...allTools]

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.title.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((tool) => tool.category === category)
    }

    setFilteredTools(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Search Tools</h1>
        <p className="text-muted-foreground md:text-xl">Find the perfect tool for your needs</p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search from over 50+ tools..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6">Try a different search term or category</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
