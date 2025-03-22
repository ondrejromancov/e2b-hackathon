"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CircleDashed } from "lucide-react";

// Default roadmap data in case nothing is in localStorage
const defaultRoadmapData = {
  courseName: "Introduction to Computer Science",
  progress: 0,
  modules: [
    {
      id: 1,
      title: "Getting Started with Programming",
      completed: false,
      lessons: [
        { id: 1, title: "Introduction to Computing", completed: false },
        { id: 2, title: "Setting Up Your Environment", completed: false },
        { id: 3, title: "Your First Program", completed: false },
      ],
    },
  ],
};

export default function LearningSidebar() {
  const [roadmapData, setRoadmapData] = useState(defaultRoadmapData);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Retrieve roadmap data from localStorage
    const storedRoadmap = localStorage.getItem("roadmapData");
    if (storedRoadmap) {
      try {
        const parsedRoadmap = JSON.parse(storedRoadmap);
        
        // Add completed property to modules and lessons if not present
        const processedRoadmap = {
          ...parsedRoadmap,
          modules: parsedRoadmap.modules.map((module: any) => ({
            ...module,
            completed: false,
            lessons: module.lessons.map((lesson: any) => ({
              ...lesson,
              completed: false,
            })),
          })),
        };
        
        setRoadmapData(processedRoadmap);
        
        // Calculate progress (all lessons start as not completed)
        setProgress(0);
      } catch (error) {
        console.error("Error parsing roadmap data:", error);
      }
    }
  }, []);

  const handleGenerateNewLessons = () => {
    // This would typically trigger a new API call to generate more content
    alert("This feature would generate new lessons based on your progress and interests.");
  };

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
        <Button variant="outline" className="w-full" onClick={handleGenerateNewLessons}>
          Generate New Lessons
        </Button>
      </div>
    </div>
  );
}
