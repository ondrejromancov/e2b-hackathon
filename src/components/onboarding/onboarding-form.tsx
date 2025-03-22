"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    ageGroup: "",
  });

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd save this data to a database or local storage
    console.log("Submitted form data:", formData);

    // Navigate to the learning dashboard
    router.push("/learn");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-8">
          <Progress value={(step / 3) * 100} className="h-2" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {step} of 3
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                What subject would you like to learn?
              </h3>
              <Tabs defaultValue="stem" className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="stem">STEM</TabsTrigger>
                  <TabsTrigger value="humanities">Humanities</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                  <TabsTrigger value="arts">Arts</TabsTrigger>
                </TabsList>
                <TabsContent value="stem" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Mathematics",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "Computer Science",
                      "Engineering",
                    ].map((subject) => (
                      <Button
                        key={subject}
                        type="button"
                        variant={
                          formData.subject === subject ? "default" : "outline"
                        }
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => updateFormData("subject", subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="humanities" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "History",
                      "Geography",
                      "Philosophy",
                      "Psychology",
                      "Sociology",
                      "Economics",
                    ].map((subject) => (
                      <Button
                        key={subject}
                        type="button"
                        variant={
                          formData.subject === subject ? "default" : "outline"
                        }
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => updateFormData("subject", subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="languages" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "English",
                      "Spanish",
                      "French",
                      "German",
                      "Chinese",
                      "Japanese",
                    ].map((subject) => (
                      <Button
                        key={subject}
                        type="button"
                        variant={
                          formData.subject === subject ? "default" : "outline"
                        }
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => updateFormData("subject", subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="arts" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Music",
                      "Visual Arts",
                      "Theater",
                      "Dance",
                      "Creative Writing",
                      "Film",
                    ].map((subject) => (
                      <Button
                        key={subject}
                        type="button"
                        variant={
                          formData.subject === subject ? "default" : "outline"
                        }
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => updateFormData("subject", subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                What is your proficiency level?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
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
              <h3 className="text-lg font-medium">What is your age group?</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Elementary School (6-10)",
                  "Middle School (11-13)",
                  "High School (14-18)",
                  "College/University",
                  "Adult Learner",
                  "Professional Development",
                ].map((age) => (
                  <Button
                    key={age}
                    type="button"
                    variant={formData.ageGroup === age ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center text-center"
                    onClick={() => updateFormData("ageGroup", age)}
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
                disabled={
                  (step === 1 && !formData.subject) ||
                  (step === 2 && !formData.level)
                }
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!formData.ageGroup}>
                Start Learning
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
