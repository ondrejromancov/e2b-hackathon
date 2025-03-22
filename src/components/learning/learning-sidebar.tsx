import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CircleDashed } from "lucide-react";

// Mock data for learning roadmap
// In a real application, this would come from an API
const roadmapData = {
  courseName: "Introduction to Computer Science",
  progress: 35,
  modules: [
    {
      id: 1,
      title: "Getting Started with Programming",
      completed: true,
      lessons: [
        { id: 1, title: "Introduction to Computing", completed: true },
        { id: 2, title: "Setting Up Your Environment", completed: true },
        { id: 3, title: "Your First Program", completed: true },
      ],
    },
    {
      id: 2,
      title: "Basic Programming Concepts",
      completed: false,
      lessons: [
        { id: 4, title: "Variables and Data Types", completed: true },
        { id: 5, title: "Control Structures", completed: false },
        { id: 6, title: "Functions and Methods", completed: false },
      ],
    },
    {
      id: 3,
      title: "Data Structures",
      completed: false,
      lessons: [
        { id: 7, title: "Arrays and Lists", completed: false },
        { id: 8, title: "Dictionaries and Maps", completed: false },
        { id: 9, title: "Objects and Classes", completed: false },
      ],
    },
    {
      id: 4,
      title: "Advanced Topics",
      completed: false,
      lessons: [
        { id: 10, title: "Algorithms", completed: false },
        { id: 11, title: "Software Design Principles", completed: false },
        { id: 12, title: "Final Project", completed: false },
      ],
    },
  ],
};

export default function LearningSidebar() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-4">
        <h3 className="font-semibold text-lg">{roadmapData.courseName}</h3>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{roadmapData.progress}%</span>
          </div>
          <Progress value={roadmapData.progress} className="h-2" />
        </div>
      </div>

      <Separator />

      <div className="flex-1 p-4 space-y-6">
        {roadmapData.modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <div className="flex items-center gap-2">
              {module.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <CircleDashed className="h-5 w-5 text-muted-foreground" />
              )}
              <h4 className="font-medium">{module.title}</h4>
            </div>

            <div className="ml-7 space-y-1">
              {module.lessons.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant="ghost"
                  className={`w-full justify-start text-sm h-auto py-1 px-2 ${
                    lesson.completed ? "text-muted-foreground" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {lesson.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <CircleDashed className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full">
          Generate New Lessons
        </Button>
      </div>
    </div>
  );
}
