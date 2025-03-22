import { onboardings } from "@/lib/datastore"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify(onboardings.get(id)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
