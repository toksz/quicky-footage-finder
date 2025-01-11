import React, { useState } from 'react';
import { ScriptInput } from '@/components/ScriptInput';
import { MediaSettings } from '@/components/MediaSettings';
import { VideoSettings } from '@/components/VideoSettings';
import { GenerationProgress } from '@/components/GenerationProgress';
import { ApiSettings } from '@/components/ApiSettings';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [script, setScript] = useState('');
  const [mediaSource, setMediaSource] = useState<'pixabay' | 'pexels' | 'both'>('both');
  const [mediaType, setMediaType] = useState<'images' | 'videos' | 'both'>('both');
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState<'9:16' | '16:9'>('9:16');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [apiKeys, setApiKeys] = useState({
    google: '',
    pixabay: '',
    pexels: '',
  });

  const handleApiKeyChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveKeys = () => {
    toast({
      title: 'API Keys Saved',
      description: 'Your API keys have been saved successfully.',
    });
  };

  const stages = [
    {
      name: 'Analyzing Script',
      description: 'Extracting keywords and context',
      progress: 100,
    },
    {
      name: 'Fetching Media',
      description: 'Finding perfect background clips and images',
      progress: 60,
    },
    {
      name: 'Finalizing',
      description: 'Preparing downloadable media',
      progress: 30,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-12">Quicky</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ScriptInput value={script} onChange={setScript} />
            <VideoSettings
              duration={duration}
              format={format}
              onDurationChange={setDuration}
              onFormatChange={setFormat}
            />
            <ApiSettings
              model={model}
              onModelChange={setModel}
              apiKeys={apiKeys}
              onApiKeyChange={handleApiKeyChange}
              onSaveKeys={handleSaveKeys}
            />
          </div>
          
          <div className="space-y-6">
            <MediaSettings
              source={mediaSource}
              type={mediaType}
              onSourceChange={setMediaSource}
              onTypeChange={setMediaType}
            />
            <GenerationProgress stages={stages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;