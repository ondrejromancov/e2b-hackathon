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
  },
]

// Main Learning Interface Component
export default function LearningInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: `I understand you're interested in learning about "${inputValue}". Let's explore this topic together. This is a placeholder response that would be replaced with real AI-generated content in the full implementation.`,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

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
