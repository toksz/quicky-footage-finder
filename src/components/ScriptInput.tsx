import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

export const ScriptInput = ({ value, onChange, keywords, setKeywords }: ScriptInputProps) => {
  const [editingKeyword, setEditingKeyword] = useState<{ index: number; value: string } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const generateKeywords = async () => {
    if (!value.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video script first",
        variant: "destructive",
      });
      return;
    }

    // Extract meaningful words from the script
    const words = value.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'then', 'than', 'with', 'would', 'could', 'should'].includes(word));

    // Count word frequency
    const wordCount = words.reduce((acc: Record<string, number>, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Sort by frequency and get top words
    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);

    // Add some common stock footage categories based on context
    const commonCategories = ['nature', 'business', 'technology', 'lifestyle', 'urban'];
    const contextualKeywords = commonCategories.filter(category => 
      value.toLowerCase().includes(category)
    );

    const finalKeywords = [...new Set([...sortedWords, ...contextualKeywords])];
    setKeywords(finalKeywords);
    
    toast({
      title: "Success",
      description: "Keywords generated successfully",
    });
  };

  const optimizeKeywords = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Error",
        description: "Please generate keywords first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('pplx_api_key')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a keyword optimization expert. Your task is to analyze the given script and keywords, then suggest the best stock footage keywords that would yield good results on platforms like Pixabay and Pexels. Focus on visual concepts and commonly used tags.'
            },
            {
              role: 'user',
              content: `Script: "${value}"\n\nCurrent keywords: ${keywords.join(', ')}\n\nPlease suggest 8-10 optimized keywords that would work well for finding stock footage, separated by commas.`
            }
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const suggestedKeywords = data.choices[0].message.content
        .split(',')
        .map((k: string) => k.trim().toLowerCase())
        .filter((k: string) => k.length > 0);

      setKeywords(suggestedKeywords);
      toast({
        title: "Success",
        description: "Keywords optimized successfully",
      });
    } catch (error) {
      console.error('Error optimizing keywords:', error);
      toast({
        title: "Error",
        description: "Failed to optimize keywords. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const deleteKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, keyword: string) => {
    setEditingKeyword({ index, value: keyword });
  };

  const handleKeywordEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingKeyword) {
      const newKeywords = [...keywords];
      newKeywords[editingKeyword.index] = editingKeyword.value;
      setKeywords(newKeywords);
      setEditingKeyword(null);
    }
  };

  return (
    <Card className="bg-accent/50 p-6 space-y-4">
      <h2 className="text-xl font-semibold">Video Script</h2>
      <div className="flex gap-2">
        <Textarea
          placeholder="Enter your video script here..."
          className="min-h-[200px] bg-secondary/50 border-accent input-focus"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button 
          onClick={generateKeywords}
          className="h-auto"
          variant="secondary"
        >
          Generate Keywords
        </Button>
      </div>
      
      {keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-foreground/70">Generated Keywords</label>
            <Button
              onClick={optimizeKeywords}
              disabled={isOptimizing}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Keywords'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              editingKeyword?.index === index ? (
                <Input
                  key={index}
                  autoFocus
                  className="w-32"
                  value={editingKeyword.value}
                  onChange={(e) => setEditingKeyword({ index, value: e.target.value })}
                  onKeyDown={handleKeywordEdit}
                  onBlur={() => setEditingKeyword(null)}
                />
              ) : (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer group relative"
                  onDoubleClick={() => startEditing(index, keyword)}
                >
                  {keyword}
                  <button
                    onClick={() => deleteKeyword(index)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </Badge>
              )
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};