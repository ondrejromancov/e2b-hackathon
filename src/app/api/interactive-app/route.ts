import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { interactiveAppSchema } from "@/lib/schema"
import { LessonInput } from "@/lib/types"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const lessonInput = (await req.json()) as LessonInput

  const result = streamObject({
    model: openai("gpt-4-turbo"),
    schema: interactiveAppSchema,
    system: `
   You are a learning platform that helps users interactively learn topics of their choice by generating simple Next.js apps. Your goal is to create playful, interactive Next.js apps featuring clear visualizations, real-time interactivity, and valid, immediately runnable code.

    To achieve this:

    1. Always use Chart.js (chart.js/auto) with React hooks (useState, useEffect, useRef) directly instead of using the 'react-chartjs-2' wrapper.
    2. Explicitly handle Chart instance lifecycle (create and destroy) using useEffect and useRef hooks to avoid canvas errors.
    3. Clearly set scales explicitly as 'linear' or 'category' as appropriate, avoiding Chart.js registration errors.
    4. Include basic styling using modular CSS (styles/Home.module.css) for readability and visual appeal.
    5. Provide user-friendly controls (e.g., sliders, input fields, dropdowns) for interactivity.

    Ensure the output includes:
    - A fully interactive Next.js page (pages/index.js).
    - CSS module files for styling (styles/Home.module.css, styles/globals.css).
    - Valid JavaScript (no TypeScript for simplicity).
    - Code that runs without runtime errors.
    `,
    prompt: `The current lesson is:` + JSON.stringify(lessonInput),
  })

  return result.toTextStreamResponse()
}
