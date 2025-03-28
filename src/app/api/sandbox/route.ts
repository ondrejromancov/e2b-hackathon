import { InteractiveApp } from "@/lib/schema"
import { ExecutionResultWeb } from "@/lib/types"
import { Sandbox } from "@e2b/code-interpreter"

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export const maxDuration = 60

const apiKey = process.env.E2B_API_KEY

export async function POST(req: Request) {
  const { fragment: interactiveApp, userID }: { fragment: InteractiveApp; userID: string } =
    await req.json()
  console.log("interactiveApp", interactiveApp)
  console.log("userID", userID)
  console.log("apiKey", apiKey)

  const interactiveTemplate = interactiveApp.template ?? "nextjs-developer"

  if (!interactiveTemplate) {
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
  const sbx = await Sandbox.create(interactiveTemplate, {
    metadata: { template: interactiveTemplate, userID: userID },
    timeoutMs: sandboxTimeout,
    apiKey,
  })

  console.log("sandbox created")

  // Install packages
  if (interactiveApp.has_additional_dependencies) {
    await sbx.commands.run(interactiveApp.install_dependencies_command)
    console.log(
      `Installed dependencies: ${interactiveApp.additional_dependencies.join(", ")} in sandbox ${
        sbx.sandboxId
      }`
    )
  }

  console.log("packages installed")

  // Copy code to fs
  if (interactiveApp.code && Array.isArray(interactiveApp.code)) {
    await Promise.all(
      interactiveApp.code.map(async file => {
        await sbx.files.write(file.file_path, file.file_content)
        console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`)
      })
    )
  }
  console.log("code copied")

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
