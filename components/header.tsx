"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Wrench, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wrench className="h-6 w-6" />
          <span className="font-bold text-xl">ProToolsHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="w-full pl-9"
              onClick={() => (window.location.href = "/search")}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (window.location.href = `/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`)
              }
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/categories" className="text-sm font-medium hover:underline">
              Categories
            </Link>
            <Link href="/popular" className="text-sm font-medium hover:underline">
              Popular
            </Link>
            <Link href="/new" className="text-sm font-medium hover:underline">
              New
            </Link>
          </nav>
          <ModeToggle />
        </div>

        <div className="flex md:hidden items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/categories" className="text-sm font-medium hover:underline">
                  Categories
                </Link>
                <Link href="/popular" className="text-sm font-medium hover:underline">
                  Popular
                </Link>
                <Link href="/new" className="text-sm font-medium hover:underline">
                  New
                </Link>
                <div className="h-px bg-border my-2"></div>
                <Link href="/tools/text-tools" className="text-sm font-medium hover:underline">
                  Text Tools
                </Link>
                <Link href="/tools/converters" className="text-sm font-medium hover:underline">
                  Converters
                </Link>
                <Link href="/tools/generators" className="text-sm font-medium hover:underline">
                  Generators
                </Link>
                <Link href="/tools/calculators" className="text-sm font-medium hover:underline">
                  Calculators
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
