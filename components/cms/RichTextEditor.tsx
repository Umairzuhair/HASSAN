
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, Youtube, Type, Eye } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    const imageHtml = `<img src="${imageUrl}" alt="Product image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
    onChange(value + imageHtml);
    setImageUrl('');
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    const videoHtml = `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;"><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
    onChange(value + videoHtml);
    setVideoUrl('');
  };

  const insertYoutube = () => {
    if (!youtubeUrl.trim()) return;
    
    // Extract YouTube video ID from various YouTube URL formats
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeUrl.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      // If it's already just an ID
      videoId = youtubeUrl;
    }
    
    if (videoId) {
      const youtubeHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; margin: 16px 0;"></iframe>`;
      onChange(value + youtubeHtml);
    }
    setYoutubeUrl('');
  };

  const renderPreview = () => {
    if (!value) return <p className="text-muted-foreground">Preview will appear here...</p>;
    
    return (
      <div 
        className="prose max-w-none text-muted-foreground leading-relaxed text-base space-y-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_video]:max-w-full [&_video]:h-auto [&_video]:rounded-lg [&_video]:my-4 [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          Rich Text Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4">
            <div>
              <Label>Description Text</Label>
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`min-h-32 ${className}`}
              />
            </div>
            
            {/* Media insertion tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Insert Image
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={insertImage}>
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Insert Video
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={insertVideo}>
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  Insert YouTube
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="YouTube URL or ID"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={insertYoutube}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Tip: You can also write HTML directly in the text area. Media will be automatically sized to fit the description space.
            </p>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-4 min-h-32">
              {renderPreview()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
