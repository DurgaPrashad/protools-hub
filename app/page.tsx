import { ToolGrid } from "@/components/tool-grid"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <ToolGrid />
    </div>
  )
}
