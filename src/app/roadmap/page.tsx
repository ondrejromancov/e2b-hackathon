"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import RoadmapDisplay from "@/components/roadmap/roadmap-display"
import { OnboardingFormData } from "@/lib/types"
import { useRoadmap } from "@/context/roadmap-context"

function RoadmapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { roadmapData, setRoadmapData } = useRoadmap()

  useEffect(() => {
    // Check if we already have saved roadmaps
    const savedRoadmapsString = localStorage.getItem("savedRoadmaps")
    const savedRoadmaps = savedRoadmapsString ? JSON.parse(savedRoadmapsString) : []

    // If we have saved roadmaps and no specific parameters, just show the saved roadmaps
    if (savedRoadmaps.length > 0 && !searchParams.has("subject")) {
      setRoadmapData(savedRoadmaps[0]) // Use the first roadmap as the primary one
      setIsLoading(false)
      return
    }

    // Generate roadmap using the API
    const generateRoadmap = async (id: string) => {
      try {
        const onboardingResponse = await fetch(`/api/onboarding/${id}`)

        if (!onboardingResponse.ok) {
          throw new Error("Failed to generate roadmap")
        }

        const { subject, level, activityDuration, learningMethod, interests } =
          (await onboardingResponse.json()) as OnboardingFormData

        const response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            level,
            activityDuration: activityDuration,
            learningMethod,
            interests,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate roadmap")
        }

        const data = await response.json()
        const newRoadmap = data.roadmap
        setRoadmapData(newRoadmap)

        // Check if this roadmap already exists in saved roadmaps by ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roadmapExists = savedRoadmaps.some((roadmap: any) => roadmap.id === newRoadmap.id)

        if (!roadmapExists) {
          // Add the new roadmap to saved roadmaps
          const updatedRoadmaps = [...savedRoadmaps, newRoadmap]
          localStorage.setItem("savedRoadmaps", JSON.stringify(updatedRoadmaps))
        }
      } catch (err) {
        console.error("Error generating roadmap:", err)
        setError("Failed to generate your learning roadmap. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateRoadmap(searchParams.get("id") ?? "")
  }, [searchParams, router, setRoadmapData])

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            Generating your personalized learning roadmap...
          </p>
        </div>
      </div>
    )
  }

  // If there was an error, show an error message
  if (error) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-4 md:p-8">
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

  // If we have roadmap data, display it
  if (roadmapData) {
    return (
      <div className="container py-8 max-w-full flex items-center justify-center">
        <RoadmapDisplay roadmap={roadmapData} />
        <div className="mt-8 flex justify-center"></div>
      </div>
    )
  }

  // Fallback - should not reach here
  return (
    <div className="flex min-h-full flex-col p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">Something went wrong</CardTitle>
          <CardDescription className="text-muted-foreground">
            Unable to display your roadmap. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Button onClick={() => router.push("/onboarding")}>Go to Onboarding</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-col items-center justify-center p-4 md:p-8">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading roadmap...</p>
          </div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  )
}
