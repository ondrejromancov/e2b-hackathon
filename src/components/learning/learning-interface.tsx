"use client"

import { useState } from "react"
import { Message } from "./types"
import { ChatPanel } from "./chat-panel"
import { InteractivePanel } from "./interactive-panel"

// Simulating chat messages
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    content:
      "Hello! I'm your AI learning assistant. I'm here to help you understand the concepts of your chosen subject. What would you like to learn about today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    role: "assistant", // Add role for OpenAI API
  },
]

// Main Learning Interface Component
export default function LearningInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!inputValue.trim()) return;
  
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
      role: "user", // Add role for OpenAI API
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
  
    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
  
      const data = await response.json();
  
      // Log the full response for debugging
      console.log('API Response:', data);
  
      if (data.error) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ''));
      }
  
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: data.message || "Sorry, I couldn't generate a response.",
        timestamp: new Date().toISOString(),
        role: "assistant", // Add role for OpenAI API
      };
  
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: error instanceof Error 
          ? `Sorry, I'm having trouble responding: ${error.message}` 
          : "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
        role: "assistant", // Add role for OpenAI API
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-150px)]">
      {/* Interactive Panel */}
      <InteractivePanel />

      {/* Chat Interface */}
      <ChatPanel
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
    </div>
  )
}
