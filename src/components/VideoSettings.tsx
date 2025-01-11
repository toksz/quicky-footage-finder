import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VideoSettingsProps {
  duration: number;
  format: '9:16' | '16:9';
  onDurationChange: (duration: number) => void;
  onFormatChange: (format: '9:16' | '16:9') => void;
}

export const VideoSettings = ({
  duration,
  format,
  onDurationChange,
  onFormatChange,
}: VideoSettingsProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Video Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Duration</label>
          <div className="flex gap-2">
            <Button
              variant={duration === 30 ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onDurationChange(30)}
            >
              30 Seconds
            </Button>
            <Button
              variant={duration === 60 ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onDurationChange(60)}
            >
              60 Seconds
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="number"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value))}
              className="w-20 bg-secondary/50 border-accent input-focus"
            />
            <span className="text-sm text-foreground/70">seconds</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/70">Video Format</label>
          <div className="flex gap-2">
            <Button
              variant={format === '9:16' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onFormatChange('9:16')}
              className="w-full"
            >
              Portrait (9:16)
            </Button>
            <Button
              variant={format === '16:9' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onFormatChange('16:9')}
              className="w-full"
            >
              Landscape (16:9)
            </Button>
          </div>
          <p className="text-xs text-foreground/50 mt-1">Perfect for Shorts & TikTok</p>
        </div>
      </div>
    </Card>
  );
};