import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg self-center mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl capitalize">The Learning Company</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            width={400}
            height={400}
            className="mb-4"
            alt="The Learning Platform Logo"
          />
          <Link href="/onboarding">
            <Button size="lg" className="w-full">
              Enter
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
