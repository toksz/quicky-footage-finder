import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApiSettingsProps {
  model: string;
  onModelChange: (model: string) => void;
  onSaveKeys: () => void;
  apiKeys: {
    google: string;
    pixabay: string;
    pexels: string;
  };
  onApiKeyChange: (key: keyof typeof apiKeys, value: string) => void;
}

export const ApiSettings = ({
  model,
  onModelChange,
  onSaveKeys,
  apiKeys,
  onApiKeyChange,
}: ApiSettingsProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-6">
      <h2 className="text-xl font-semibold">API Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Model Selection</label>
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="bg-secondary/50 border-accent input-focus">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gpt4">GPT-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {['google', 'pixabay', 'pexels'].map((key) => (
          <div key={key} className="space-y-2">
            <label className="text-sm text-foreground/70 capitalize">
              {key} API Key
            </label>
            <Input
              type="password"
              placeholder={`Enter ${key} API key`}
              value={apiKeys[key as keyof typeof apiKeys]}
              onChange={(e) => onApiKeyChange(key as keyof typeof apiKeys, e.target.value)}
              className="bg-secondary/50 border-accent input-focus"
            />
          </div>
        ))}

        <Button
          onClick={onSaveKeys}
          className="w-full"
        >
          Save API Keys
        </Button>
      </div>
    </Card>
  );
};