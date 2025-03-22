"use client"

import { Button } from "@/components/ui/button"
import { DeepPartial } from "react-hook-form"
import { InteractiveApp, interactiveAppSchema } from "@/lib/schema"
import { ExecutionResult, LessonInput } from "@/lib/types"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"

interface InteractiveExerciseGeneratorProps {
  onExerciseGenerated: (preview: {
    interactiveApp: DeepPartial<InteractiveApp> | undefined
    result: ExecutionResult | undefined
  }) => void
  onStartSampleExercise: (interactiveApp: InteractiveApp) => void
}

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

  console.log("isLoading", isLoading)
  console.log("error", error)
  console.log("object", object)

  function generateExercise(input: LessonInput) {
    submit(input)
    // When the object is updated, it will trigger a re-render with the new object
    // We don't need to explicitly call onExerciseGenerated here as it will happen in the effect below
  }

  // When the object changes, notify the parent component
  if (object) {
    onExerciseGenerated({ interactiveApp: object, result: undefined })
  }

  if (isLoading) {
    return <>Loading..</>
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
                onClick={() => onStartSampleExercise(object as InteractiveApp)}
              >
                Start Interactive Exercise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          generateExercise({
            title: lessonTitle,
            description:
              "A graph, chart or small app showing the selected lesson title in an interactive way. For example sliders, input fields or buttons playing animations",
          })
        }
      >
        Generate Lesson
      </Button>
    </>
  )
}
