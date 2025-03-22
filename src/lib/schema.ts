import { z } from "zod"
import { TEMPLATES_IDS } from "./types"

const TemplateIds = z.enum(TEMPLATES_IDS)

export const interactiveAppSchema = z.object({
  commentary: z
    .string()
    .describe(
      `Describe what you're about to do and the steps you want to take for generating the interactive app in great detail.`
    ),
  template: TemplateIds.optional().describe(
    "Name of the template used to generate the interactive app"
  ),
  // template_ready: z.boolean().describe('Detect if finished identifying the template.'),
  title: z.string().describe("Short title of the interactive app. Max 3 words."),
  description: z.string().describe("Short description of the interactive app. Max 1 sentence."),
  additional_dependencies: z
    .array(z.string())
    .describe(
      "Additional dependencies required by the interactive app. Do not include dependencies that are already included in the template."
    ),
  has_additional_dependencies: z
    .boolean()
    .describe(
      "Detect if additional dependencies that are not included in the template are required by the interactive app."
    ),
  install_dependencies_command: z
    .string()
    .describe("Command to install additional dependencies required by the interactive app."),
  // install_dependencies_ready: z.boolean().describe('Detect if finished identifying additional dependencies.'),
  port: z.number().describe("Port number used by the resulted interactive app."),
  code: z.array(
    z.object({
      file_name: z.string().describe("Name of the file."),
      file_path: z.string().describe("Relative path to the file, including the file name."),
      file_content: z.string().describe("Content of the file."),
      file_finished: z.boolean().describe("Detect if finished generating the file."),
    })
  ),
  code_finished: z.boolean().describe("Detect if finished generating the code."),
  error: z.string().optional().describe("Error message if the fragment is not valid."),
})

export type InteractiveApp = z.infer<typeof interactiveAppSchema>
