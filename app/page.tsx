"use client"
import LinkProcessor from "@/components/link-processor"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Microsoft ECU Link Generator</h1>
        </div>

        <LinkProcessor />
      </div>
    </main>
  )
}
