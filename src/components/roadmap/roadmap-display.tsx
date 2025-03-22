"use client"

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CircleDashed, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Lesson {
  id: number
  title: string
  description: string
  topics: string[]
  completed?: boolean
}

interface Module {
  id: number
  title: string
  description: string
  lessons: Lesson[]
  completed?: boolean
}

interface RoadmapProps {
  roadmap: {
    courseName: string
    modules: Module[]
  }
}

export default function RoadmapDisplay({ roadmap }: RoadmapProps) {
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [roadmaps, setRoadmaps] = useState<{courseName: string; modules: Module[]}[]>([]);

  // Load saved roadmaps from localStorage on initial render
  useEffect(() => {
    // Load saved roadmaps from localStorage
    const loadSavedRoadmaps = () => {
      try {
        const savedRoadmapsString = localStorage.getItem('savedRoadmaps');
        const savedRoadmaps = savedRoadmapsString ? JSON.parse(savedRoadmapsString) : [];
        
        // Add the current roadmap to the list if it's not already there
        const currentRoadmapExists = savedRoadmaps.some(
          (saved: {courseName: string}) => saved.courseName === roadmap.courseName
        );
        
        if (!currentRoadmapExists) {
          // Save the current roadmap to localStorage
          const updatedRoadmaps = [...savedRoadmaps, roadmap];
          localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
          setRoadmaps(updatedRoadmaps);
        } else {
          setRoadmaps(savedRoadmaps);
        }
      } catch (error) {
        console.error("Error loading saved roadmaps:", error);
        setRoadmaps([roadmap]);
      }
    };
    
    loadSavedRoadmaps();
  }, [roadmap]);

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

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    // Initial update
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Function to calculate node positions in a linear vertical layout with lessons
  const calculateNodePositions = (roadmapIndex: number, roadmapData: {courseName: string; modules: Module[]}) => {
    const containerWidth = dimensions.width;
    const roadmapWidth = containerWidth / roadmaps.length;
    const centerX = (roadmapWidth * roadmapIndex) + (roadmapWidth / 2);
    const startY = 120; // Start from top with some padding
    const moduleVerticalSpacing = 250; // Space between modules
    const lessonVerticalSpacing = 60; // Space between lessons
    
    const result: { x: number; y: number; type: 'module' | 'lesson'; item: Module | Lesson; order: number }[] = [];
    
    let nodeOrder = 0; // To track the order of nodes for proper path drawing
    
    // Calculate positions for each module node and its lessons
    roadmapData.modules.forEach((module, moduleIndex) => {
      // Module position
      const moduleY = startY + (moduleIndex * moduleVerticalSpacing);
      // Add slight zigzag effect for visual interest
      const offsetX = moduleIndex % 2 === 0 ? -80 : 80;
      const moduleX = centerX + (moduleIndex === 0 ? 0 : offsetX);
      
      result.push({ x: moduleX, y: moduleY, type: 'module', item: module, order: nodeOrder++ });
      
      // Add lessons for this module
      // For all modules, including the last one
      const isLastModule = moduleIndex === roadmapData.modules.length - 1;
      const nextModuleY = isLastModule 
        ? moduleY + moduleVerticalSpacing  // Create space for last module's lessons
        : startY + ((moduleIndex + 1) * moduleVerticalSpacing);
      
      module.lessons.forEach((lesson, lessonIndex) => {
        const lessonY = moduleY + 80 + (lessonIndex * lessonVerticalSpacing);
        // Only add if there's enough space
        if (lessonY < nextModuleY - 40) {
          // Smaller zigzag for lessons
          const lessonOffsetX = lessonIndex % 2 === 0 ? -30 : 30;
          const lessonX = moduleX + lessonOffsetX;
          
          result.push({ x: lessonX, y: lessonY, type: 'lesson', item: lesson, order: nodeOrder++ });
        }
      });
    });
    
    // Sort by order to ensure correct path drawing
    return result.sort((a, b) => a.order - b.order);
  };
  
  // Function to handle module selection
  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module === selectedModule ? null : module);
    setSelectedLesson(null);
  };
  
  // Function to handle lesson selection
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson === selectedLesson ? null : lesson);
    setSelectedModule(null);
  };
  
  // Function to close the details panel
  const handleCloseDetails = () => {
    setSelectedModule(null);
    setSelectedLesson(null);
  };
  
  // Function to start new skill onboarding
  const handleLearnNewSkill = () => {
    router.push("/onboarding");
  };
  
  // Function to add a new roadmap after onboarding
  const addNewRoadmap = (newRoadmap: {courseName: string; modules: Module[]}) => {
    // Add the new roadmap to the existing roadmaps
    const updatedRoadmaps = [...roadmaps, newRoadmap];
    setRoadmaps(updatedRoadmaps);
    
    // Save to localStorage
    localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
  };

  return (
    <div className="space-y-6 h-screen w-screen overflow-hidden">
      <div className="text-center mb-4 pt-4">
        <h1 className="text-3xl font-bold mb-2">Your Learning Roadmaps</h1>
        <p className="text-muted-foreground">
          {roadmaps.length > 1 
            ? `${roadmaps.length} roadmaps with your personalized learning paths` 
            : "Your personalized learning path"}
        </p>
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
          Click on a node to view details
        </div>
      </div>

      <div className="relative h-[calc(100vh-120px)]">
        {/* Circular plus button for adding new skill */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30">
          <Button 
            size="icon" 
            className="w-14 h-14 rounded-full bg-transparent hover:bg-slate-100 border-2 border-slate-300 shadow-lg"
            onClick={handleLearnNewSkill}
            title="Learn New Skill"
          >
            <Plus size={24} className="text-slate-600" />
          </Button>
        </div>

        <div ref={containerRef} className="relative w-full h-full overflow-auto">
          <div className="absolute inset-0 w-full h-full">
            {/* Render all roadmaps side by side */}
            {roadmaps.map((roadmapData, roadmapIndex) => {
              const nodePositions = calculateNodePositions(roadmapIndex, roadmapData);
              const containerWidth = dimensions.width;
              const roadmapWidth = containerWidth / roadmaps.length;
              const titleX = (roadmapWidth * roadmapIndex) + (roadmapWidth / 2);
              
              return (
                <div key={`roadmap-${roadmapIndex}`} className="absolute inset-0">
                  {/* Removed roadmap title as requested */}
                  
                  {/* SVG for connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {/* Draw paths connecting modules and their lessons */}
                    {nodePositions.length > 1 && (
                      <>
                        {/* Find all module nodes */}
                        {nodePositions.filter(node => node.type === 'module').map((moduleNode, moduleIndex, moduleArray) => {
                          // For all modules except the last one, connect to the next module
                          if (moduleIndex < moduleArray.length - 1) {
                            // Find the next module
                            const nextModule = moduleArray[moduleIndex + 1];
                            
                            // Find all lessons between this module and the next
                            const lessonsBetween = nodePositions.filter(node => 
                              node.type === 'lesson' && 
                              node.order > moduleNode.order && 
                              node.order < nextModule.order
                            );
                            
                            // If there are lessons between, connect module -> lessons -> next module
                            if (lessonsBetween.length > 0) {
                              // Create path points starting with the module
                              const pathPoints = [moduleNode, ...lessonsBetween, nextModule];
                              
                              return (
                                <path
                                  key={`path-${roadmapIndex}-${moduleIndex}`}
                                  d={`M ${pathPoints[0].x},${pathPoints[0].y} ${pathPoints.slice(1).map(node => `L ${node.x},${node.y}`).join(' ')}`}
                                  fill="none"
                                  stroke="rgba(0, 0, 0, 0.6)"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              );
                            } else {
                              // Direct connection between modules if no lessons
                              return (
                                <path
                                  key={`path-${roadmapIndex}-${moduleIndex}`}
                                  d={`M ${moduleNode.x},${moduleNode.y} L ${nextModule.x},${nextModule.y}`}
                                  fill="none"
                                  stroke="rgba(0, 0, 0, 0.6)"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              );
                            }
                          } else {
                            // For the last module, connect to its lessons if any
                            const lastModuleLessons = nodePositions.filter(node => 
                              node.type === 'lesson' && 
                              node.order > moduleNode.order
                            );
                            
                            if (lastModuleLessons.length > 0) {
                              // Create path connecting last module to its lessons
                              return (
                                <path
                                  key={`path-${roadmapIndex}-${moduleIndex}-lessons`}
                                  d={`M ${moduleNode.x},${moduleNode.y} ${lastModuleLessons.map(node => `L ${node.x},${node.y}`).join(' ')}`}
                                  fill="none"
                                  stroke="rgba(0, 0, 0, 0.6)"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              );
                            }
                            
                            return null;
                          }
                        })}
                      </>
                    )}
                  </svg>
                  
                  {/* Render all nodes (modules and lessons) */}
                  {nodePositions.map((node, index) => {
                    if (node.type === 'module') {
                      const module = node.item as Module;
                      return (
                        <div 
                          key={`module-${roadmapIndex}-${module.id}`}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                            selectedModule?.id === module.id ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                          }`}
                          style={{ left: `${node.x}px`, top: `${node.y}px` }}
                          onClick={() => handleModuleSelect(module)}
                        >
                          <div 
                            className={`flex items-center justify-center rounded-full ${
                              index === 0 
                                ? 'w-20 h-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' 
                                : module.completed 
                                  ? 'w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white' 
                                  : 'w-16 h-16 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground'
                            } shadow-lg border-4 border-white`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg">{index + 1}</div>
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center whitespace-nowrap font-medium">
                            <span className="bg-white/80 px-2 py-1 rounded text-sm shadow-sm">
                              {module.title}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      const lesson = node.item as Lesson;
                      return (
                        <div 
                          key={`lesson-${roadmapIndex}-${lesson.id}`}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                            selectedLesson?.id === lesson.id ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                          }`}
                          style={{ left: `${node.x}px`, top: `${node.y}px` }}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <div 
                            className={`flex items-center justify-center rounded-full ${
                              lesson.completed 
                                ? 'w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 text-white' 
                                : 'w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 text-white'
                            } shadow-md border-2 border-white`}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <CircleDashed className="h-5 w-5" />
                            )}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center whitespace-nowrap">
                            <span className="bg-white/80 px-2 py-0.5 rounded text-xs shadow-sm">
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
            
            {/* Module details panel */}
            {selectedModule && (
              <div className="absolute right-6 top-6 w-80 bg-white rounded-lg shadow-xl border p-4 z-30 max-h-[calc(100%-3rem)] overflow-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{selectedModule.title}</h3>
                  <button 
                    onClick={handleCloseDetails} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{selectedModule.description}</p>
                
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-2">Lessons ({selectedModule.lessons.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {selectedModule.lessons.map((lesson) => (
                      <div key={lesson.id} className="border rounded-md p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          ) : (
                            <CircleDashed className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">{lesson.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className={`text-xs ${
                    selectedModule.completed 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }`}>
                    {selectedModule.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Lesson details panel */}
            {selectedLesson && (
              <div className="absolute right-6 top-6 w-80 bg-white rounded-lg shadow-xl border p-4 z-30 max-h-[calc(100%-3rem)] overflow-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                  <button 
                    onClick={handleCloseDetails} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{selectedLesson.description}</p>
                
                {selectedLesson.topics && selectedLesson.topics.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-2">Topics</h4>
                    <div className="space-y-1">
                      {selectedLesson.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-right">
                  <Badge variant="outline" className={`text-xs ${
                    selectedLesson.completed 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }`}>
                    {selectedLesson.completed ? "Completed" : "Not Started"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
