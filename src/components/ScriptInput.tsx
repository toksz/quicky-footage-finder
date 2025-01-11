import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ScriptInput = ({ value, onChange }: ScriptInputProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [editingKeyword, setEditingKeyword] = useState<{ index: number; value: string } | null>(null);

  const generateKeywords = async () => {
    if (!value.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video script first",
        variant: "destructive",
      });
      return;
    }

    // This is a mock implementation. In a real app, you'd call your AI service
    const mockKeywords = value
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);
    
    setKeywords(mockKeywords);
    toast({
      title: "Success",
      description: "Keywords generated successfully",
    });
  };

  const deleteKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
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
          <label className="text-sm text-foreground/70">Generated Keywords</label>
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