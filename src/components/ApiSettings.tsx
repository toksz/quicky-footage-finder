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
              <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
              <SelectItem value="gemini-1.5-flash-002">Gemini 1.5 Flash-002</SelectItem>
              <SelectItem value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8b</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gemini-1.5-pro-002">Gemini 1.5 Pro-002</SelectItem>
              <SelectItem value="gemini-exp-1206">Gemini exp-1206</SelectItem>
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