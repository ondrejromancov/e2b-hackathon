"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CircleDashed, ChevronRight } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  topics: string[];
  completed?: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  completed?: boolean;
}

interface RoadmapProps {
  roadmap: {
    courseName: string;
    modules: Module[];
  };
}

export default function RoadmapDisplay({ roadmap }: RoadmapProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>("module-0");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  // Calculate overall progress
  const totalLessons = roadmap.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  
  const completedLessons = roadmap.modules.reduce(
    (total, module) =>
      total +
      module.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{roadmap.courseName}</h1>
        <p className="text-muted-foreground">
          {totalLessons} lessons across {roadmap.modules.length} modules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmap.modules.map((module, moduleIndex) => (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="pb-3 bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {moduleIndex + 1}
                    </span>
                    <span>{module.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {module.description}
                  </CardDescription>
                </div>
                {module.completed ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    In Progress
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="single"
                collapsible
                value={expandedModule === `module-${moduleIndex}` ? `module-${moduleIndex}` : undefined}
                onValueChange={(value) => setExpandedModule(value)}
                className="w-full"
              >
                <AccordionItem value={`module-${moduleIndex}`} className="border-0">
                  <AccordionTrigger className="px-6 py-3 text-sm font-medium hover:no-underline hover:bg-muted/50">
                    View {module.lessons.length} Lessons
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-4 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <Accordion
                          key={lesson.id}
                          type="single"
                          collapsible
                          value={expandedLesson === `lesson-${moduleIndex}-${lessonIndex}` ? `lesson-${moduleIndex}-${lessonIndex}` : undefined}
                          onValueChange={(value) => setExpandedLesson(value)}
                          className="w-full border rounded-md overflow-hidden"
                        >
                          <AccordionItem value={`lesson-${moduleIndex}-${lessonIndex}`} className="border-0">
                            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/30">
                              <div className="flex items-center gap-3 text-left">
                                {lesson.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                ) : (
                                  <CircleDashed className="h-5 w-5 text-muted-foreground shrink-0" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="px-4 py-3 bg-muted/20 space-y-3">
                                <p className="text-sm">{lesson.description}</p>
                                {lesson.topics && lesson.topics.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Topics covered:</h4>
                                    <ul className="space-y-1">
                                      {lesson.topics.map((topic, index) => (
                                        <li key={index} className="text-sm flex items-start gap-2">
                                          <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                          <span>{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
