import type { Metadata } from "next"
import { allTools } from "@/data/tools"
import { notFound } from "next/navigation"
import { ToolPageClient } from "./ToolPageClient"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = allTools.find((tool) => tool.id === params.id)

  if (!tool) {
    return {
      title: "Tool Not Found | ProToolsHub",
      description: "The requested tool could not be found.",
    }
  }

  return {
    title: `${tool.title} | ProToolsHub`,
    description: tool.description,
    keywords: tool.tags.join(", "),
  }
}

export default function ToolPage({ params }: Props) {
  const tool = allTools.find((tool) => tool.id === params.id)

  if (!tool) {
    notFound()
  }

  return <ToolPageClient tool={tool} />
}
