"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Smile } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample emoji data
const emojiCategories = [
  { id: "smileys", name: "Smileys & Emotion" },
  { id: "people", name: "People & Body" },
  { id: "animals", name: "Animals & Nature" },
  { id: "food", name: "Food & Drink" },
  { id: "travel", name: "Travel & Places" },
  { id: "activities", name: "Activities" },
  { id: "objects", name: "Objects" },
  { id: "symbols", name: "Symbols" },
  { id: "flags", name: "Flags" },
]

// Sample emoji data
const emojis = [
  // Smileys & Emotion
  { emoji: "😀", name: "Grinning Face", category: "smileys", keywords: ["smile", "happy", "joy", "grin"] },
  {
    emoji: "😃",
    name: "Grinning Face with Big Eyes",
    category: "smileys",
    keywords: ["smile", "happy", "joy", "grin"],
  },
  { emoji: "😄", name: "Grinning Face with Smiling Eyes", category: "smileys", keywords: ["smile", "happy", "joy"] },
  { emoji: "😁", name: "Beaming Face with Smiling Eyes", category: "smileys", keywords: ["smile", "happy", "joy"] },
  { emoji: "😆", name: "Grinning Squinting Face", category: "smileys", keywords: ["laugh", "happy", "joy"] },
  { emoji: "😅", name: "Grinning Face with Sweat", category: "smileys", keywords: ["hot", "happy", "laugh"] },
  { emoji: "🤣", name: "Rolling on the Floor Laughing", category: "smileys", keywords: ["lol", "laugh", "haha"] },
  { emoji: "😂", name: "Face with Tears of Joy", category: "smileys", keywords: ["lol", "laugh", "cry", "haha"] },
  { emoji: "🙂", name: "Slightly Smiling Face", category: "smileys", keywords: ["smile", "happy"] },
  { emoji: "🙃", name: "Upside-Down Face", category: "smileys", keywords: ["silly", "sarcasm", "irony"] },

  // People & Body
  { emoji: "👋", name: "Waving Hand", category: "people", keywords: ["hello", "hi", "bye", "wave"] },
  { emoji: "🤚", name: "Raised Back of Hand", category: "people", keywords: ["hand", "backhand"] },
  { emoji: "✋", name: "Raised Hand", category: "people", keywords: ["hand", "high five", "stop"] },
  { emoji: "👌", name: "OK Hand", category: "people", keywords: ["perfect", "okay", "nice"] },
  { emoji: "👍", name: "Thumbs Up", category: "people", keywords: ["good", "approve", "like"] },
  { emoji: "👎", name: "Thumbs Down", category: "people", keywords: ["bad", "disapprove", "dislike"] },
  { emoji: "👏", name: "Clapping Hands", category: "people", keywords: ["applause", "praise", "clap"] },
  { emoji: "🙏", name: "Folded Hands", category: "people", keywords: ["please", "thank you", "pray"] },
  { emoji: "👨", name: "Man", category: "people", keywords: ["male", "guy", "person"] },
  { emoji: "👩", name: "Woman", category: "people", keywords: ["female", "lady", "person"] },

  // Animals & Nature
  { emoji: "🐶", name: "Dog Face", category: "animals", keywords: ["pet", "puppy", "animal"] },
  { emoji: "🐱", name: "Cat Face", category: "animals", keywords: ["pet", "kitten", "animal"] },
  { emoji: "🐭", name: "Mouse Face", category: "animals", keywords: ["animal", "rodent"] },
  { emoji: "🐰", name: "Rabbit Face", category: "animals", keywords: ["bunny", "animal", "pet"] },
  { emoji: "🦊", name: "Fox Face", category: "animals", keywords: ["animal", "nature"] },
  { emoji: "🐻", name: "Bear Face", category: "animals", keywords: ["animal", "nature"] },
  { emoji: "🌸", name: "Cherry Blossom", category: "animals", keywords: ["flower", "spring", "nature"] },
  { emoji: "🌹", name: "Rose", category: "animals", keywords: ["flower", "love", "nature"] },
  { emoji: "🌳", name: "Deciduous Tree", category: "animals", keywords: ["tree", "nature", "plant"] },
  { emoji: "🌵", name: "Cactus", category: "animals", keywords: ["plant", "desert", "nature"] },

  // Food & Drink
  { emoji: "🍎", name: "Red Apple", category: "food", keywords: ["fruit", "food", "healthy"] },
  { emoji: "🍌", name: "Banana", category: "food", keywords: ["fruit", "food"] },
  { emoji: "🍕", name: "Pizza", category: "food", keywords: ["food", "italian", "cheese"] },
  { emoji: "🍔", name: "Hamburger", category: "food", keywords: ["food", "burger", "fast food"] },
  { emoji: "🍟", name: "French Fries", category: "food", keywords: ["food", "potato", "fast food"] },
  { emoji: "🍦", name: "Soft Ice Cream", category: "food", keywords: ["dessert", "sweet", "food"] },
  { emoji: "🍰", name: "Shortcake", category: "food", keywords: ["dessert", "cake", "sweet", "food"] },
  { emoji: "☕", name: "Hot Beverage", category: "food", keywords: ["coffee", "tea", "drink"] },
  { emoji: "🍷", name: "Wine Glass", category: "food", keywords: ["wine", "alcohol", "drink"] },
  { emoji: "🍺", name: "Beer Mug", category: "food", keywords: ["beer", "alcohol", "drink"] },

  // Travel & Places
  { emoji: "🚗", name: "Automobile", category: "travel", keywords: ["car", "vehicle", "transport"] },
  { emoji: "✈️", name: "Airplane", category: "travel", keywords: ["flight", "travel", "vacation"] },
  { emoji: "🚢", name: "Ship", category: "travel", keywords: ["boat", "cruise", "travel"] },
  { emoji: "🏠", name: "House", category: "travel", keywords: ["home", "building"] },
  { emoji: "🏢", name: "Office Building", category: "travel", keywords: ["work", "building"] },
  { emoji: "🏙️", name: "Cityscape", category: "travel", keywords: ["city", "skyline", "buildings"] },
  { emoji: "🌉", name: "Bridge at Night", category: "travel", keywords: ["bridge", "night", "city"] },
  { emoji: "🏝️", name: "Desert Island", category: "travel", keywords: ["beach", "vacation", "island"] },

  // Objects
  { emoji: "⌚", name: "Watch", category: "objects", keywords: ["time", "accessory"] },
  { emoji: "📱", name: "Mobile Phone", category: "objects", keywords: ["phone", "device", "smartphone"] },
  { emoji: "💻", name: "Laptop", category: "objects", keywords: ["computer", "device", "work"] },
  { emoji: "🖨️", name: "Printer", category: "objects", keywords: ["office", "device"] },
  { emoji: "💡", name: "Light Bulb", category: "objects", keywords: ["idea", "light", "electricity"] },
  { emoji: "🔑", name: "Key", category: "objects", keywords: ["lock", "security", "access"] },
]

export default function EmojiSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchResults, setSearchResults] = useState<typeof emojis>([])
  const [recentlyUsed, setRecentlyUsed] = useState<typeof emojis>([])
  const { toast } = useToast()

  // Initialize with all emojis
  useEffect(() => {
    if (searchQuery === "" && activeCategory === "all") {
      setSearchResults(emojis)
    } else {
      handleSearch()
    }
    // Load recently used emojis from localStorage
    const savedRecent = localStorage.getItem("recentEmojis")
    if (savedRecent) {
      try {
        setRecentlyUsed(JSON.parse(savedRecent))
      } catch (e) {
        console.error("Error loading recent emojis:", e)
      }
    }
  }, [])

  const handleSearch = () => {
    let results = [...emojis]

    // Filter by category if not "all"
    if (activeCategory !== "all") {
      results = results.filter((emoji) => emoji.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (emoji) =>
          emoji.name.toLowerCase().includes(query) || emoji.keywords.some((keyword) => keyword.includes(query)),
      )
    }

    setSearchResults(results)
  }

  // Update search results when query or category changes
  useEffect(() => {
    handleSearch()
  }, [searchQuery, activeCategory])

  const copyEmoji = (emoji: string, name: string) => {
    navigator.clipboard.writeText(emoji)
    toast({
      title: "Copied!",
      description: `${emoji} ${name} copied to clipboard`,
    })

    // Add to recently used
    const emojiObj = emojis.find((e) => e.emoji === emoji)
    if (emojiObj) {
      const newRecent = [emojiObj, ...recentlyUsed.filter((e) => e.emoji !== emoji)].slice(0, 16)
      setRecentlyUsed(newRecent)
      localStorage.setItem("recentEmojis", JSON.stringify(newRecent))
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Emoji Search</CardTitle>
            <CardDescription>Search for emojis by name or description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap h-auto p-1 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {emojiCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeCategory} className="mt-0">
                {activeCategory === "all" && recentlyUsed.length > 0 && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Recently Used</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {recentlyUsed.map((emoji, index) => (
                        <Button
                          key={`recent-${index}`}
                          variant="outline"
                          className="h-12 text-2xl"
                          onClick={() => copyEmoji(emoji.emoji, emoji.name)}
                          title={emoji.name}
                        >
                          {emoji.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-8 gap-2">
                    {searchResults.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12 text-2xl"
                        onClick={() => copyEmoji(emoji.emoji, emoji.name)}
                        title={emoji.name}
                      >
                        {emoji.emoji}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Smile className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p>No emojis found. Try a different search term.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Click on an emoji to copy it to your clipboard</p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emoji Tips</CardTitle>
          <CardDescription>How to use emojis effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Social Media</h3>
              <p className="text-sm text-muted-foreground">
                Use emojis to make your social media posts more engaging and expressive.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Messages</h3>
              <p className="text-sm text-muted-foreground">
                Add tone and emotion to your messages with appropriate emojis.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Presentations</h3>
              <p className="text-sm text-muted-foreground">
                Use emojis sparingly in presentations to highlight key points and add visual interest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
