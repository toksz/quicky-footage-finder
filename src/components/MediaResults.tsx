import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MediaItem {
  id: string;
  thumbnail: string;
  url: string;
  title: string;
  source: 'pixabay' | 'pexels';
  type: 'image' | 'video';
}

interface MediaResultsProps {
  results: Record<string, MediaItem[]>;
}

export const MediaResults = ({ results }: MediaResultsProps) => {
  return (
    <Card className="bg-accent/50 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Search Results</h2>
      
      <div className="space-y-8">
        {Object.entries(results).map(([keyword, items]) => (
          <div key={keyword} className="space-y-4">
            <h3 className="text-lg font-medium">{keyword}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group card-hover">
                  {item.type === 'video' ? (
                    <video
                      src={item.thumbnail}
                      className="w-full h-48 object-cover rounded-md"
                      controls
                    />
                  ) : (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                    {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};