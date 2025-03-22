"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simulating chat messages
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    content: "Hello! I'm your AI learning assistant. I'm here to help you understand the concepts of your chosen subject. What would you like to learn about today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export default function LearningInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "ai",
        content: `I understand you're interested in learning about "${inputValue}". Let's explore this topic together. This is a placeholder response that would be replaced with real AI-generated content in the full implementation.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-150px)]">
      {/* Chat Interface */}
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <CardTitle>AI Learning Assistant</CardTitle>
          <CardDescription>Chat with your AI tutor about your learning topics</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-auto pt-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender === 'ai' ? "/ai-avatar.png" : "/user-avatar.png"} />
                    <AvatarFallback>{message.sender === 'ai' ? 'AI' : 'You'}</AvatarFallback>
                  </Avatar>
                  <div 
                    className={`rounded-lg p-3 text-sm ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </Card>

      {/* Interactive Panel */}
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <CardTitle>Interactive Learning</CardTitle>
          <CardDescription>Explore concepts with interactive exercises</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interactive" className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">Interactive Learning Space</h3>
                <p className="text-muted-foreground mb-4">
                  This area will contain interactive elements related to your learning topic.
                </p>
                <Button variant="outline">Start Interactive Exercise</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">Visual Learning</h3>
                <p className="text-muted-foreground mb-4">
                  Visualizations, diagrams, and graphs will appear here to help you understand concepts.
                </p>
                <Button variant="outline">Generate Visualization</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="quiz" className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">Knowledge Check</h3>
                <p className="text-muted-foreground mb-4">
                  Test your understanding with interactive quizzes and assessments.
                </p>
                <Button variant="outline">Start Quiz</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
