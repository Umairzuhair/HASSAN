
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductTabsProps {
  description: string;
  specifications?: any;
}

export const ProductTabs = ({ description, specifications }: ProductTabsProps) => {
  const renderSpecifications = () => {
    if (!specifications || typeof specifications !== 'object') {
      return <p className="text-muted-foreground">Product specifications will be available soon.</p>;
    }

    const specsEntries = Object.entries(specifications);
    if (specsEntries.length === 0) {
      return <p className="text-muted-foreground">Product specifications will be available soon.</p>;
    }

    return (
      <div className="space-y-4">
        {specsEntries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-900 capitalize min-w-0 flex-1">
              {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-muted-foreground text-right ml-6 max-w-xs">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Enhanced description rendering with support for HTML content, images, and videos
  const renderDescription = () => {
    if (!description) {
      return <p className="text-muted-foreground">Product description will be available soon.</p>;
    }

    return (
      <div className="prose max-w-none">
        <div 
          className="text-muted-foreground leading-relaxed text-base space-y-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_video]:max-w-full [&_video]:h-auto [&_video]:rounded-lg [&_video]:my-4 [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    );
  };

  return (
    <div>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          {renderDescription()}
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <div className="prose max-w-none">
            {renderSpecifications()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
