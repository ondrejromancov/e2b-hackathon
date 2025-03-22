"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import RoadmapDisplay from "@/components/roadmap/roadmap-display"

export default function RoadmapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const subject = searchParams.get("subject")
    const level = searchParams.get("level")
    const ageGroup = searchParams.get("ageGroup")

    if (!subject || !level || !ageGroup) {
      setError("Missing required parameters. Please complete the onboarding process.")
      setIsLoading(false)
      return
    }

    // Generate roadmap using the API
    const generateRoadmap = async () => {
      try {
        const response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject, level, ageGroup }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate roadmap")
        }

        const data = await response.json()
        setRoadmapData(data.roadmap)

        // Store the roadmap data in localStorage for future use
        localStorage.setItem("roadmapData", JSON.stringify(data.roadmap))
      } catch (err) {
        console.error("Error generating roadmap:", err)
        setError("Failed to generate your learning roadmap. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateRoadmap()
  }, [searchParams])

  const handleStartLearning = () => {
    router.push("/learn")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Generating Your Learning Roadmap</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please wait while we create a personalized learning plan for you
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-center text-muted-foreground">
              This may take a moment as we craft the perfect learning journey for you...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Oops! Something went wrong</CardTitle>
            <CardDescription className="text-muted-foreground">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Button onClick={() => router.push("/onboarding")}>Return to Onboarding</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">Your Learning Roadmap</CardTitle>
          <CardDescription className="text-muted-foreground">
            Here&apos;s your personalized learning journey based on your preferences
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          {roadmapData && <RoadmapDisplay roadmap={roadmapData} />}

          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={handleStartLearning}>
              Start Learning Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
