import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Stage {
  name: string;
  description: string;
  progress: number;
}

interface GenerationProgressProps {
  stages: Stage[];
}

export const GenerationProgress = ({ stages }: GenerationProgressProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Generation Progress</h2>
      
      <div className="space-y-6">
        {stages.map((stage) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{stage.name}</span>
              <span className="text-sm text-foreground/70">{stage.progress}%</span>
            </div>
            <Progress value={stage.progress} className="h-2" />
            <p className="text-sm text-foreground/70">{stage.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};