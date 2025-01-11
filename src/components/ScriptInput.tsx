import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ScriptInput = ({ value, onChange }: ScriptInputProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-4">
      <h2 className="text-xl font-semibold">Video Script</h2>
      <Textarea
        placeholder="Enter your video script here..."
        className="min-h-[200px] bg-secondary/50 border-accent input-focus"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Card>
  );
};