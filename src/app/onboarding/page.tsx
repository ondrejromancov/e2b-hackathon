import { Suspense } from "react"
import OnboardingForm from "@/components/onboarding/onboarding-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">A few questions...</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tell us about yourself so we can personalize your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <OnboardingForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
