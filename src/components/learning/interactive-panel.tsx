"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function InteractivePanel() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle>Interactive Learning</CardTitle>
        <CardDescription>Explore concepts with interactive exercises</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 pt-4">
        <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg h-full">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">Interactive Learning Space</h3>
            <p className="text-muted-foreground mb-4">
              This area will contain interactive elements related to your learning topic.
            </p>
            <Button variant="outline">Start Interactive Exercise</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
