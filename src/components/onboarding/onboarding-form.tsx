"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"

export interface OnboardingFormData {
  subject: string
  level: string
  learningMethod: string
  activityDuration: string
  interests: string
}

export default function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<OnboardingFormData>({
    subject: "",
    level: "",
    learningMethod: "",
    activityDuration: "",
    interests: "",
  })

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Post formData to /api/onboarding
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      throw new Error("Failed to generate roadmap")
    }

    const data = await res.json()
    router.push(`/roadmap?id=${data.id}`)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-8">
          <Progress value={(step / 3) * 100} className="h-2" />
          <p className="text-center text-sm text-muted-foreground mt-2">Step {step} of 3</p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">What are you curious about?</h3>
              <Tabs defaultValue="stem" className="w-full">
                <TabsContent value="stem" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {["Mathematics", "Physics", "Biology", "Engineering"].map(subject => (
                      <Card key={subject} onClick={() => updateFormData("subject", subject)}>
                        <CardContent className="flex items-center justify-center flex-col">
                          <Image
                            src={`/${subject.toLowerCase()}.svg`}
                            width={200}
                            height={200}
                            className="mb-4"
                            alt="The Learning Platform Logo"
                          />
                          <Button
                            key={subject}
                            type="button"
                            variant={formData.subject === subject ? "default" : "outline"}
                            className="h-12 w-2/3 flex flex-col items-center justify-center"
                          >
                            {subject}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">What is your proficiency level?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Beginner", "Intermediate", "Advanced"].map(level => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.level === level ? "default" : "outline"}
                    className="h-12 flex flex-col items-center justify-center"
                    onClick={() => updateFormData("level", level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <h3 className="text-lg font-medium text-center">
                What is your preferred learning method?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Visual", "Game-like", "Quiz"].map(level => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.learningMethod === level ? "default" : "outline"}
                    className="h-12 flex flex-col items-center justify-center"
                    onClick={() => updateFormData("learningMethod", level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <h3 className="text-lg font-medium text-center">Activity duration?</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["5 min quick session", "45 minutes lesson", "Compete against opponent"].map(
                  activityDuration => (
                    <Button
                      key={activityDuration}
                      type="button"
                      variant={
                        formData.activityDuration === activityDuration ? "default" : "outline"
                      }
                      className="h-12 flex flex-col items-center justify-center text-center"
                      onClick={() => updateFormData("activityDuration", activityDuration)}
                    >
                      {activityDuration}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                What do you like during your learning?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Textarea
                  className="col-span-2"
                  value={formData.interests}
                  onChange={e => updateFormData("interests", e.target.value)}
                  placeholder="I like rainbows 🌈 and unicorns 🦄"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={(step === 1 && !formData.subject) || (step === 2 && !formData.level)}
              >
                Next
              </Button>
            ) : (
              <Button type="button" disabled={!canSubmit(formData)} onClick={handleSubmit}>
                Start Learning
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function canSubmit(formData: OnboardingFormData) {
  return (
    formData.activityDuration && formData.interests && formData.learningMethod && formData.subject
  )
}
