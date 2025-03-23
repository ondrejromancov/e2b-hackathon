"use client"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, CircleDashed } from "lucide-react"
import { useRoadmap } from "@/context/roadmap-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function LearningSidebar() {
  const { roadmapData } = useRoadmap()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current active item from URL
  const activeType = searchParams.get("type")
  const activeTitle = searchParams.get("title")

  useEffect(() => {
    if (roadmapData) {
      setProgress(roadmapData.progress || 0)
    }
  }, [roadmapData])

  const handleGenerateNewLessons = () => {
    // This would typically trigger a new API call to generate more content
    alert("This feature would generate new lessons based on your progress and interests.")
  }

  const navigateToModule = (moduleId: string | number, moduleTitle: string) => {
    router.push(`/learn?type=module&id=${moduleId}&title=${encodeURIComponent(moduleTitle)}`)
  }

  const navigateToLesson = (lessonId: string | number, lessonTitle: string) => {
    router.push(`/learn?type=lesson&id=${lessonId}&title=${encodeURIComponent(lessonTitle)}`)
  }

  // Check if a lesson is currently active based on title
  const isLessonActive = (lessonTitle: string) => {
    return activeType === "lesson" && activeTitle === lessonTitle
  }

  if (!roadmapData) {
    return <div className="p-4">Loading roadmap data...</div>
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-4">
        <h3 className="font-semibold text-lg">{roadmapData.courseName}</h3>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Separator />

      <div className="flex-1 p-4 space-y-6">
        {roadmapData.modules.map(module => (
          <div key={module.id} className="space-y-2">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors px-2 py-1"
              onClick={() => navigateToModule(module.id, module.title)}
            >
              {module.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <CircleDashed className="h-5 w-5 text-muted-foreground" />
              )}
              <h4 className="font-medium">{module.title}</h4>
            </div>

            <div className="ml-7 space-y-1">
              {module.lessons.map(lesson => (
                <Button
                  key={lesson.id}
                  variant={isLessonActive(lesson.title) ? "secondary" : "ghost"}
                  className={`w-full justify-start text-sm h-auto py-1 px-2 ${
                    lesson.completed && !isLessonActive(lesson.title) ? "text-muted-foreground" : ""
                  }`}
                  onClick={() => navigateToLesson(lesson.id, lesson.title)}
                >
                  <div className="flex items-center gap-2">
                    {lesson.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <CircleDashed
                        className={`h-4 w-4 shrink-0 ${
                          isLessonActive(lesson.title) ? "text-primary" : ""
                        }`}
                      />
                    )}
                    <span
                      className={`truncate ${isLessonActive(lesson.title) ? "font-medium" : ""}`}
                    >
                      {lesson.title}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full" onClick={handleGenerateNewLessons}>
          Generate New Lessons
        </Button>
      </div>
    </div>
  )
}
