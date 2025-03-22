"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeepPartial } from "react-hook-form"
import { InteractiveAppSchema } from "@/lib/schema"
import { ExecutionResult, ExecutionResultWeb } from "@/lib/types"
import { InteractiveAppView } from "./interactive-app-view"

const SAMPLE_APP: InteractiveAppSchema = {
  commentary:
    "I'll create an interactive visualization app for mathematical powers. This app will allow users to input a number and see how different power functions (quadratic, cubic, etc.) affect it. I'll use JavaScript with a React frontend and Chart.js for visualization. The app will feature a simple input field for the base number and display multiple curves representing different powers (x^1, x^2, x^3, x^4, x^5) on a responsive graph. Users will be able to see how the input value changes when raised to different powers, with visual highlights on the graph showing these points.",
  template: "nextjs-developer",
  title: "Power Visualizer",
  description:
    "Interactive tool to visualize how different powers affect numbers with real-time graphing.",
  additional_dependencies: ["chart.js", "react-chartjs-2"],
  has_additional_dependencies: true,
  install_dependencies_command: "npm install chart.js react-chartjs-2",
  port: 3000,
  file_path: "power-visualizer/App.js",
  code: "",
}

export function InteractivePanel() {
  const [result, setResult] = useState<ExecutionResult>()
  const [interactiveApp, setInteractiveApp] = useState<DeepPartial<InteractiveAppSchema>>()

  function setCurrentPreview(preview: {
    interactiveApp: DeepPartial<InteractiveAppSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setInteractiveApp(preview.interactiveApp)
    setResult(preview.result)
  }

  const handleStartExercise = async () => {
    const response = await fetch("/api/sandbox", {
      method: "POST",
      body: JSON.stringify({
        fragment: SAMPLE_APP,
        userID: "sample-user-id",
      }),
    })

    const result = await response.json()
    console.log("result", result)

    setResult(result)
    setCurrentPreview({ interactiveApp, result })
  }

  if (result) {
    return <InteractiveAppView result={result as ExecutionResultWeb} />
  }

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
            <Button variant="outline" onClick={handleStartExercise}>
              Start Interactive Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
