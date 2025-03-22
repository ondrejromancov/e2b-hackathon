"use client"

import { Button } from "@/components/ui/button"
import { DeepPartial } from "react-hook-form"
import { InteractiveApp, interactiveAppSchema } from "@/lib/schema"
import { ExecutionResult, LessonInput } from "@/lib/types"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { useRoadmap } from "@/context/roadmap-context"
import { useEffect, useState } from "react"
import { Progress } from "../ui/progress"

interface InteractiveExerciseGeneratorProps {
  onExerciseGenerated: (preview: {
    interactiveApp: DeepPartial<InteractiveApp> | undefined
    result: ExecutionResult | undefined
  }) => void
  onStartSampleExercise: (interactiveApp: InteractiveApp) => void
}
const str = Math.random()
const codeOrFunctionsOrInstructions = str > 0.5 ? "Code" : str > 0.25 ? "Functions" : "Instructions"

export function InteractiveExerciseGenerator({
  onExerciseGenerated,
  onStartSampleExercise,
}: InteractiveExerciseGeneratorProps) {
  const { isLoading, object, submit, error } = useObject({
    api: "/api/interactive-app",
    schema: interactiveAppSchema,
  })
  const searchParams = useSearchParams()
  const lessonTitle = searchParams.get("title") || "Interactive Power Function Visualization"
  const activeType = searchParams.get("type")
  const activeId = searchParams.get("id")
  const { roadmapData } = useRoadmap()

  console.log("isLoading", isLoading)
  console.log("error", error)
  console.log("object", object)

  const [exerciseStarting, setExerciseStarting] = useState(false)

  // Find the current lesson based on URL parameters
  const getCurrentLesson = () => {
    if (activeType === "lesson" && roadmapData) {
      for (const moduleItem of roadmapData.modules) {
        const lesson = moduleItem.lessons.find(
          lesson => lesson.id.toString() === activeId || lesson.title === lessonTitle
        )
        if (lesson) {
          return lesson
        }
      }
    }
    return null
  }

  const currentLesson = getCurrentLesson()

  function generateExercise(input: LessonInput) {
    submit(input)
    // When the object is updated, it will trigger a re-render with the new object
    // We don't need to explicitly call onExerciseGenerated here as it will happen in the effect below
  }

  // When the object changes, notify the parent component
  if (object) {
    onExerciseGenerated({ interactiveApp: object, result: undefined })
  }

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prevProgress => Math.min(prevProgress + 1, 100))
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isLoading, progress])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col">
        <p className="text-muted-foreground">Fetching {codeOrFunctionsOrInstructions}</p>
        <Progress value={progress} className="w-[100%]"></Progress>
      </div>
    )
  }

  if (object) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <CardTitle>Interactive Learning</CardTitle>
          <CardDescription>Explore concepts with interactive exercises</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 pt-4">
          <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg h-full">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Interactive Learning Space</h3>
              <p className="text-muted-foreground mb-4">
                This area will contain interactive elements related to your learning topic.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setExerciseStarting(true)
                  setProgress(0)
                  onStartSampleExercise(object as InteractiveApp)
                }}
              >
                Start Interactive Exercise
              </Button>
              {exerciseStarting ? (
                <Progress value={Math.random() * 100} className="m-4 w-[100%]"></Progress>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get the lesson description or use a default if not available
  const lessonDescription =
    currentLesson?.description +
    "A graph, chart or small app showing the selected lesson title in an interactive way. For example sliders, input fields or buttons playing animations"

  return (
    <div className="flex-1 flex items-center justify-center flex-col">
      <Button
        variant="outline"
        onClick={() =>
          generateExercise({
            title: lessonTitle,
            description: lessonDescription,
          })
        }
      >
        Generate Lesson
      </Button>
    </div>
  )
}
