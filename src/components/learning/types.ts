// Types for learning components
export type Message = {
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  // Optional role for OpenAI API compatibility
  role?: "user" | "assistant" | "system";
};
