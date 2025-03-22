export const onboardings = new Map()

export async function POST(req: Request) {
  const data = await req.json()

  const id = crypto.randomUUID()

  onboardings.set(id, data)

  return new Response(JSON.stringify({ id }), { status: 200 })
}
