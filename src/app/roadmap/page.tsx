"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import RoadmapDisplay from "@/components/roadmap/roadmap-display"
import type { OnboardingFormData } from "@/components/onboarding/onboarding-form"

export default function RoadmapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we already have saved roadmaps
    const savedRoadmapsString = localStorage.getItem("savedRoadmaps")
    const savedRoadmaps = savedRoadmapsString ? JSON.parse(savedRoadmapsString) : []
    
    // Get query parameters
    const subject = searchParams.get("subject")
    const level = searchParams.get("level")
    const ageGroup = searchParams.get("ageGroup")
    const learningMethod = searchParams.get("learningMethod")
    const interests = searchParams.get("interests")
    
    // If we have saved roadmaps and no specific parameters, just show the saved roadmaps
    if (savedRoadmaps.length > 0 && !searchParams.has('subject')) {
      setRoadmapData(savedRoadmaps[0]) // Use the first roadmap as the primary one
      setIsLoading(false)
      return
    }

    // If we have saved roadmaps and no specific parameters, just show the saved roadmaps
    if (savedRoadmaps.length > 0 && !searchParams.has("subject")) {
      setRoadmapData(savedRoadmaps[0]) // Use the first roadmap as the primary one
      setIsLoading(false)
      return
    }
    
    // Check if we already have a roadmap with the same subject, level, and ageGroup
    const existingRoadmap = savedRoadmaps.find(
      (roadmap: any) => 
        roadmap.subject === subject && 
        roadmap.level === level && 
        roadmap.ageGroup === ageGroup
    )
    
    if (existingRoadmap) {
      console.log("Found existing roadmap with the same parameters, using it instead of generating a new one")
      setRoadmapData(existingRoadmap)
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
        const newRoadmap = data.roadmap;
        setRoadmapData(newRoadmap);
        
        // Check if this roadmap already exists in saved roadmaps by ID
        const roadmapExists = savedRoadmaps.some(
          (roadmap: any) => roadmap.id === newRoadmap.id
        );
        
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
  }, [searchParams, router])

  const handleStartLearning = () => {
    router.push("/learn")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
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

  // If we have roadmap data, display it
  if (roadmapData) {
    return (
      <div className="container py-8 max-w-6xl">
        <RoadmapDisplay roadmap={roadmapData} />
        <div className="mt-8 flex justify-center">
        </div>
      </div>
    )
  }

  // Fallback - should not reach here
  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
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
