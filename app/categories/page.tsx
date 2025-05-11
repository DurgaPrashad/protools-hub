"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { allTools } from "@/data/tools"

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  // Get unique categories
  const categories = ["all", ...new Set(allTools.map((tool) => tool.category))]

  // Filter tools by category
  const filteredTools =
    activeCategory === "all" ? allTools : allTools.filter((tool) => tool.category === activeCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Tool Categories</h1>
        <p className="text-muted-foreground md:text-xl">Browse tools by category</p>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
