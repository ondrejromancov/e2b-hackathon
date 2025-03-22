import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">AI Learning Platform</CardTitle>
          <CardDescription>Personalized learning powered by artificial intelligence</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Welcome to the AI Learning Platform, where technology meets education to create
            a personalized learning experience tailored just for you.
          </p>
          <p className="mb-4">
            Our advanced AI systems analyze your learning style, preferences, and goals
            to create a unique learning journey that adapts to your needs.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/onboarding">
            <Button size="lg">Get Started</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
