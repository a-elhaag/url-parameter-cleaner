"use client"
import LinkProcessor from "@/components/link-processor"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 md:p-12 transition-colors duration-500">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12 neo rounded-[2rem] p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3 tracking-tight">
            URL Magic
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Clean and prepare your Microsoft links
          </p>
        </div>

        <LinkProcessor />
      </div>
    </main>
  )
}
