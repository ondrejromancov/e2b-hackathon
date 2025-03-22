"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Lesson {
  id: number
  title: string
  description: string
  topics: string[]
  completed?: boolean
}

export interface Module {
  id: number
  title: string
  description: string
  lessons: Lesson[]
  completed?: boolean
}

export interface RoadmapData {
  id?: string
  courseName: string
  modules: Module[]
  learningMethod?: string
  interests?: string
  progress?: number
  subject?: string
  level?: string
  ageGroup?: string
}

interface RoadmapContextType {
  roadmapData: RoadmapData | null
  setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapData | null>>
  updateProgress: () => void
}

const defaultRoadmapData: RoadmapData = {
  courseName: "Introduction to Computer Science",
  progress: 0,
  modules: [
    {
      id: 1,
      title: "Getting Started with Programming",
      description: "Learn the basics of programming concepts",
      completed: false,
      lessons: [
        { 
          id: 1, 
          title: "Introduction to Computing", 
          description: "Understanding what computing is all about", 
          topics: ["Computing basics", "History of computing"],
          completed: false 
        },
        { 
          id: 2, 
          title: "Setting Up Your Environment", 
          description: "Setting up your development environment", 
          topics: ["Development tools", "IDE setup"],
          completed: false 
        },
        { 
          id: 3, 
          title: "Your First Program", 
          description: "Writing your first program", 
          topics: ["Hello World", "Basic syntax"],
          completed: false 
        },
      ],
    },
  ],
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined)

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)

  useEffect(() => {
    // First try to get from localStorage savedRoadmaps
    const savedRoadmapsString = localStorage.getItem("savedRoadmaps")
    
    if (savedRoadmapsString) {
      try {
        const savedRoadmaps = JSON.parse(savedRoadmapsString)
        if (savedRoadmaps.length > 0) {
          // Use the first roadmap as the primary one
          setRoadmapData(savedRoadmaps[0])
          return
        }
      } catch (error) {
        console.error("Error parsing saved roadmaps:", error)
      }
    }
    
    // Fallback to default roadmap data
    setRoadmapData(defaultRoadmapData)
  }, [])

  const updateProgress = () => {
    if (!roadmapData) return

    // Calculate overall progress
    const totalLessons = roadmapData.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    )
    
    const completedLessons = roadmapData.modules.reduce(
      (total, module) =>
        total +
        module.lessons.filter((lesson) => lesson.completed).length,
      0
    )
    
    const progressPercentage = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0

    setRoadmapData(prev => {
      if (!prev) return null
      return { ...prev, progress: progressPercentage }
    })
  }

  return (
    <RoadmapContext.Provider value={{ roadmapData, setRoadmapData, updateProgress }}>
      {children}
    </RoadmapContext.Provider>
  )
}

export function useRoadmap() {
  const context = useContext(RoadmapContext)
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider")
  }
  return context
}
