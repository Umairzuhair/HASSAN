import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, Plus, Trash2, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebsiteContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const ContentManager = () => {
  const [contents, setContents] = useState<WebsiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    image_url: '',
    metadata: '{}'
  });
  const { toast } = useToast();

  // Predefined hero image sections
  const heroImageSections = [
    { key: 'hero_image_desktop', label: 'Hero Image (Desktop)', icon: Monitor },
    { key: 'hero_image_mobile', label: 'Hero Image (Mobile)', icon: Smartphone }
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section');

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHeroImageSection = async (sectionKey: string, sectionLabel: string) => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .insert({
          section: sectionKey,
          title: sectionLabel,
          content: `Upload your ${sectionLabel.toLowerCase()} here`,
          image_url: '',
          metadata: {}
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${sectionLabel} section created successfully`,
      });

      // Automatically start editing the newly created section
      if (data) {
        setEditingId(data.id);
        setFormData({
          section: data.section,
          title: data.title || '',
          content: data.content || '',
          image_url: data.image_url || '',
          metadata: JSON.stringify(data.metadata || {}, null, 2)
        });
      }

      fetchContents();
    } catch (error: any) {
      toast({
        title: "Error creating section",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEdit = (content: WebsiteContent) => {
    setEditingId(content.id);
    setIsCreating(false);
    setFormData({
      section: content.section,
      title: content.title || '',
      content: content.content || '',
      image_url: content.image_url || '',
      metadata: JSON.stringify(content.metadata || {}, null, 2)
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      section: '',
      title: '',
      content: '',
      image_url: '',
      metadata: '{}'
    });
  };

  const saveContent = async () => {
    try {
      let metadata = {};
      try {
        metadata = JSON.parse(formData.metadata);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Please fix the metadata JSON format",
          variant: "destructive",
        });
        return;
      }

      const contentData = {
        section: formData.section,
        title: formData.title || null,
        content: formData.content || null,
        image_url: formData.image_url || null,
        metadata
      };

      if (isCreating) {
        const { error } = await supabase
          .from('website_content')
          .insert(contentData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('website_content')
          .update(contentData)
          .eq('id', editingId);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: isCreating ? "Content created successfully" : "Content updated successfully",
      });

      fetchContents();
      cancelEdit();
    } catch (error: any) {
      toast({
        title: "Error saving content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Content deleted",
        description: "Content has been deleted successfully",
      });

      fetchContents();
    } catch (error: any) {
      toast({
        title: "Error deleting content",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getContentBySection = (sectionKey: string) => {
    return contents.find(content => content.section === sectionKey);
  };

  if (loading) {
    return <div className="text-center">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Content</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Hero Images Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {heroImageSections.map(({ key, label, icon: Icon }) => {
              const existingContent = getContentBySection(key);
              return (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <h4 className="font-semibold">{label}</h4>
                    </div>
                    {existingContent ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(existingContent)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => createHeroImageSection(key, label)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {existingContent?.image_url ? (
                    <img
                      src={existingContent.image_url}
                      alt={label}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image uploaded</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Content' : 'Edit Content'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                placeholder="e.g., hero_section, about_us"
                disabled={editingId !== null} // Disable editing section name when editing existing content
              />
              {editingId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Section name cannot be changed when editing existing content
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Content title"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Content body"
                className="min-h-32"
              />
            </div>
            
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Paste the URL of your image here. You can upload images in the "File Manager" tab first.
              </p>
            </div>
            
            <div>
              <Label htmlFor="metadata">Metadata (JSON)</Label>
              <Textarea
                id="metadata"
                value={formData.metadata}
                onChange={(e) => setFormData(prev => ({ ...prev, metadata: e.target.value }))}
                placeholder='{"key": "value"}'
                className="min-h-24 font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={saveContent}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {contents.filter(content => !content.section.startsWith('hero_image_')).map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {content.title || 'Untitled'}
                    <Badge variant="outline">{content.section}</Badge>
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(content)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteContent(content.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {content.content && (
                <p className="text-muted-foreground mb-2 line-clamp-3">
                  {content.content}
                </p>
              )}
              {content.image_url && (
                <div className="mb-2">
                  <img
                    src={content.image_url}
                    alt={content.title || 'Content image'}
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
              {content.metadata && Object.keys(content.metadata).length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Metadata: {JSON.stringify(content.metadata)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
