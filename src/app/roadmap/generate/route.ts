import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.ROADMAP_API_KEY_OPENAI,
})

export async function POST(request: NextRequest) {
  try {
    const { subject, level, ageGroup, learningMethod, interests } = await request.json()

    // Validate required fields
    if (!subject || !level || !ageGroup) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a prompt for OpenAI to generate a structured roadmap
    const prompt = `
      Create a detailed learning roadmap for ${subject} at a ${level} level for ${ageGroup}.
      
      ${learningMethod ? `The preferred learning method is: ${learningMethod}.` : ''}
      ${interests ? `The learner is interested in: ${interests}.` : ''}

      The roadmap should include:
      1. A course title
      2. 4-6 main modules/chapters
      3. 3-5 lessons per module

      Format the response as a JSON object with the following structure:
      {
        "courseName": "Title of the Course",
        "modules": [
          {
            "id": 1,
            "title": "Module Title",
            "description": "Brief description of this module",
            "lessons": [
              {
                "id": 1,
                "title": "Lesson Title",
                "description": "Brief description of this lesson",
                "topics": ["Topic 1", "Topic 2", "Topic 3"]
              }
            ]
          }
        ]
      }

      Make sure the content is educational, age-appropriate, and follows a logical progression from basic to more advanced concepts.
      ${learningMethod ? `Incorporate the ${learningMethod} learning method into the lessons where appropriate.` : ''}
      ${interests ? `Try to incorporate elements related to ${interests} where relevant to make the content more engaging.` : ''}
    `

    // Call OpenAI API to generate the roadmap
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational content creator specializing in creating structured learning roadmaps.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    // Extract and parse the response
    const responseContent = completion.choices[0].message.content
    const roadmapData = JSON.parse(responseContent || "{}")

    // Return the generated roadmap
    return NextResponse.json({ roadmap: roadmapData })
  } catch (error) {
    console.error("Error generating roadmap:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate roadmap" },
      { status: 500 }
    )
  }
}
