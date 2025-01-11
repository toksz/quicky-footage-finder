import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MediaSettingsProps {
  source: 'pixabay' | 'pexels' | 'both';
  type: 'images' | 'videos' | 'both';
  onSourceChange: (source: 'pixabay' | 'pexels' | 'both') => void;
  onTypeChange: (type: 'images' | 'videos' | 'both') => void;
}

export const MediaSettings = ({
  source,
  type,
  onSourceChange,
  onTypeChange,
}: MediaSettingsProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Media Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Media Source</label>
          <div className="flex gap-2">
            <Button
              variant={source === 'pixabay' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onSourceChange('pixabay')}
              className="w-full"
            >
              Pixabay
            </Button>
            <Button
              variant={source === 'pexels' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onSourceChange('pexels')}
              className="w-full"
            >
              Pexels
            </Button>
            <Button
              variant={source === 'both' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onSourceChange('both')}
              className="w-full"
            >
              Both
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Media Type</label>
          <div className="flex gap-2">
            <Button
              variant={type === 'images' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onTypeChange('images')}
              className="w-full"
            >
              Images
            </Button>
            <Button
              variant={type === 'videos' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onTypeChange('videos')}
              className="w-full"
            >
              Videos
            </Button>
            <Button
              variant={type === 'both' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onTypeChange('both')}
              className="w-full"
            >
              Both
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};