"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    activityType: "",
  })

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we'd save this data to a database or local storage
    console.log("Submitted form data:", formData)

    // Navigate to the learning dashboard
    router.push("/learn")
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
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => updateFormData("level", level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">I am going to</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "2 minutes activity",
                  "30 minute lesson",
                  "90 minute exam",
                  "Compete against opponent",
                ].map(age => (
                  <Button
                    key={age}
                    type="button"
                    variant={formData.activityType === age ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center text-center"
                    onClick={() => updateFormData("activityType", age)}
                  >
                    {age}
                  </Button>
                ))}
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
              <Button type="submit" disabled={!formData.activityType}>
                Start Learning
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
