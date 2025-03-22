import { InteractiveAppSchema } from "@/lib/schema"
import { ExecutionResultWeb } from "@/lib/types"
import { Sandbox } from "@e2b/code-interpreter"

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export const maxDuration = 60

const apiKey = process.env.E2B_API_KEY

export async function POST(req: Request) {
  const { fragment: interactiveApp, userID }: { fragment: InteractiveAppSchema; userID: string } =
    await req.json()
  console.log("fragment", interactiveApp)
  console.log("userID", userID)
  console.log("apiKey", apiKey)

  if (!interactiveApp.template) {
    return new Response(
      JSON.stringify({
        error: "Template is required",
      }),
      {
        status: 400,
      }
    )
  }

  // Create a interpreter or a sandbox
  const sbx = await Sandbox.create(interactiveApp.template, {
    metadata: { template: interactiveApp.template, userID: userID },
    timeoutMs: sandboxTimeout,
    apiKey,
  })

  // Install packages
  if (interactiveApp.has_additional_dependencies) {
    await sbx.commands.run(interactiveApp.install_dependencies_command)
    console.log(
      `Installed dependencies: ${interactiveApp.additional_dependencies.join(", ")} in sandbox ${
        sbx.sandboxId
      }`
    )
  }

  // Copy code to fs
  if (interactiveApp.code && Array.isArray(interactiveApp.code)) {
    interactiveApp.code.forEach(async file => {
      await sbx.files.write(file.file_path, file.file_content)
      console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`)
    })
  }
  //   else {
  //     await sbx.files.write(fragment.file_path, fragment.code)
  //     console.log(`Copied file to ${fragment.file_path} in ${sbx.sandboxId}`)
  //   }

  // Execute code or return a URL to the running sandbox
  //   if (fragment.template === "code-interpreter-v1") {
  //     const { logs, error, results } = await sbx.runCode(fragment.code || "")

  //     return new Response(
  //       JSON.stringify({
  //         sbxId: sbx?.sandboxId,
  //         template: fragment.template,
  //         stdout: logs.stdout,
  //         stderr: logs.stderr,
  //         runtimeError: error,
  //         cellResults: results,
  //       } as ExecutionResultInterpreter)
  //     )
  //   }

  return new Response(
    JSON.stringify({
      sbxId: sbx?.sandboxId,
      template: interactiveApp.template,
      url: `https://${sbx?.getHost(interactiveApp.port || 80)}`,
    } as ExecutionResultWeb)
  )
}
