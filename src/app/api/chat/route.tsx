import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type definition for messages
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    // Log environment variables for debugging
    console.log('OPENAI_API_KEY is set:', !!process.env.OPENAI_API_KEY);

    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Context for learning assistant
    const systemPrompt: Message = {
      role: 'system',
      content: `You are an AI learning assistant specialized in Math, Physics, Biology and Engineering. 
      Your goal is to help students understand their concepts by providing clear, 
      engaging explanations tailored to their learning level. 
      Focus on the basic topics from each of these subjects.`
    };

    // Ensure each message has a role
    const formattedMessages: Message[] = messages.map(msg => ({
      role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
      content: msg.content
    }));

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          systemPrompt,
          ...formattedMessages
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const aiMessage = response.choices[0].message.content || '';

      return NextResponse.json({ message: aiMessage });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json({ 
        error: 'Failed to generate response from OpenAI', 
        details: openaiError instanceof Error ? openaiError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat request', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}