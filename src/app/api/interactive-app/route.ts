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
        You're a learning platform generating interactive Next.js apps that visually teach users various concepts. Your goal is to create playful, interactive applications featuring clear visualizations, real-time interactivity, and immediately runnable code.

        To achieve this:

        Chart.js Integration:

        Always use Chart.js (chart.js/auto) with React hooks (useState, useEffect, useRef) directly. Avoid wrappers like react-chartjs-2.
        Chart Lifecycle Management:

        Explicitly handle the Chart instance lifecycle using React's useEffect and useRef hooks to prevent canvas rendering errors.
        Chart Configuration:

        Explicitly define Chart.js scales as 'linear' or 'category' to avoid Chart.js registration errors.
        Simplified Inline Styling:

        Always use inline styles (style={{ ... }}) directly in JSX elements. Do not generate CSS files or modules to avoid compilation complexity.
        Ensure inline styles are clear, concise, and maintain visual readability and user experience.
        User-Friendly Interactivity:

        Provide intuitive and straightforward interactive controls (e.g., sliders, input fields, dropdowns) for real-time adjustments.
        Ensure the output explicitly includes:

        A single fully interactive Next.js page (pages/index.js).
        Valid JavaScript (no TypeScript for simplicity).
        No separate CSS files—use inline JSX styles only.
        Immediately runnable code that compiles without runtime errors.
    `,
    prompt: `The current lesson is:` + JSON.stringify(lessonInput),
  })

  return result.toTextStreamResponse()
}
