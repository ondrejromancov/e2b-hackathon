import { Suspense } from "react";
import LearningInterface from "@/components/learning/learning-interface";
import { Separator } from "@/components/ui/separator";
import LearningSidebar from "@/components/learning/learning-sidebar";

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        {/* Sidebar with roadmap */}
        <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Your Learning Journey</h2>
            </div>
            <Suspense fallback={<div className="p-4">Loading roadmap...</div>}>
              <LearningSidebar />
            </Suspense>
          </div>
        </aside>
        
        {/* Main learning area */}
        <main className="flex-1 md:ml-72">
          <div className="h-full flex flex-col">
            <header className="p-4 border-b">
              <h1 className="text-2xl font-bold">AI Learning Platform</h1>
              <p className="text-muted-foreground">Your personalized learning experience</p>
            </header>
            <Separator />
            <div className="flex-1 p-4">
              <Suspense fallback={<div>Loading learning interface...</div>}>
                <LearningInterface />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
