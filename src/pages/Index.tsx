import React, { useState } from 'react';
import { ScriptInput } from '@/components/ScriptInput';
import { MediaSettings } from '@/components/MediaSettings';
import { VideoSettings } from '@/components/VideoSettings';
import { GenerationProgress } from '@/components/GenerationProgress';
import { ApiSettings } from '@/components/ApiSettings';
import { MediaResults } from '@/components/MediaResults';
import { useToast } from '@/components/ui/use-toast';

interface MediaItem {
  id: string;
  thumbnail: string;
  url: string;
  title: string;
  source: 'pixabay' | 'pexels';
  type: 'image' | 'video';
}

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Record<string, MediaItem[]>>({});
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleApiKeyChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveKeys = () => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    toast({
      title: 'API Keys Saved',
      description: 'Your API keys have been saved successfully.',
    });
  };

  const fetchPixabayMedia = async (keyword: string, type: 'image' | 'video') => {
    const baseUrl = type === 'video' 
      ? 'https://pixabay.com/api/videos/'
      : 'https://pixabay.com/api/';
    
    const response = await fetch(`${baseUrl}?key=${apiKeys.pixabay}&q=${encodeURIComponent(keyword)}&per_page=3`);
    const data = await response.json();
    
    return (data.hits || []).map((item: any) => ({
      id: item.id.toString(),
      thumbnail: type === 'video' ? item.videos.tiny.url : item.webformatURL,
      url: type === 'video' ? item.videos.large.url : item.largeImageURL,
      title: item.tags,
      source: 'pixabay' as const,
      type,
    }));
  };

  const fetchPexelsMedia = async (keyword: string, type: 'image' | 'video') => {
    const baseUrl = type === 'video'
      ? 'https://api.pexels.com/videos/search'
      : 'https://api.pexels.com/v1/search';
    
    const response = await fetch(`${baseUrl}?query=${encodeURIComponent(keyword)}&per_page=3`, {
      headers: {
        'Authorization': apiKeys.pexels,
      },
    });
    const data = await response.json();
    
    const items = type === 'video' ? data.videos : data.photos;
    return (items || []).map((item: any) => ({
      id: item.id.toString(),
      thumbnail: type === 'video' ? item.video_files[0].link : item.src.medium,
      url: type === 'video' ? item.video_files[0].link : item.src.original,
      title: item.alt || keyword,
      source: 'pexels' as const,
      type,
    }));
  };

  const handleSearch = async () => {
    if (!keywords.length) {
      toast({
        title: 'No Keywords',
        description: 'Please generate or add keywords before searching.',
        variant: 'destructive',
      });
      return;
    }

    if ((!apiKeys.pixabay && mediaSource !== 'pexels') || 
        (!apiKeys.pexels && mediaSource !== 'pixabay')) {
      toast({
        title: 'Missing API Keys',
        description: 'Please provide the required API keys for the selected media sources.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    const newResults: Record<string, MediaItem[]> = {};

    try {
      for (const keyword of keywords) {
        const mediaPromises: Promise<MediaItem[]>[] = [];

        if (mediaSource === 'pixabay' || mediaSource === 'both') {
          if (mediaType === 'images' || mediaType === 'both') {
            mediaPromises.push(fetchPixabayMedia(keyword, 'image'));
          }
          if (mediaType === 'videos' || mediaType === 'both') {
            mediaPromises.push(fetchPixabayMedia(keyword, 'video'));
          }
        }

        if (mediaSource === 'pexels' || mediaSource === 'both') {
          if (mediaType === 'images' || mediaType === 'both') {
            mediaPromises.push(fetchPexelsMedia(keyword, 'image'));
          }
          if (mediaType === 'videos' || mediaType === 'both') {
            mediaPromises.push(fetchPexelsMedia(keyword, 'video'));
          }
        }

        const results = await Promise.all(mediaPromises);
        newResults[keyword] = results.flat();
      }

      setSearchResults(newResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'An error occurred while searching for media.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
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
            <ScriptInput 
              value={script} 
              onChange={setScript}
              keywords={keywords}
              setKeywords={setKeywords}
            />
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
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            <GenerationProgress stages={stages} />
            {Object.keys(searchResults).length > 0 && (
              <MediaResults results={searchResults} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;