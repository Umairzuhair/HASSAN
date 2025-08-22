'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { ProductCategories } from '@/components/ProductCategories';
import { BackToTopButton } from '@/components/BackToTopButton';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- SEO Meta Tag Update (CSR friendly, repeat for other main pages)
  useEffect(() => {
    document.title = "Metro Duty Free - Electronics & Appliances at Airport Prices";
    const description = "Shop the biggest brands at Metro International Duty Free. Browse electronics, appliances & more. Pickup at Bandaranaike Airport, Sri Lanka.";
    const canonical = "https://lovable.dev/projects/f49fc0f2-8536-4832-86df-e29a01e3690d/";

    // Helper to set or update meta tags
    function setMeta(name: string, content: string) {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }
    setMeta("description", description);
    setMeta("robots", "index, follow");
    // Open Graph
    const ogProps = [
      ["property", "og:title", "Metro Duty Free - Electronics & Appliances at Airport Prices"],
      ["property", "og:description", description],
      ["property", "og:type", "website"],
      ["property", "og:url", canonical],
      ["property", "og:image", "https://lovable.dev/opengraph-image-p98pqg.png"],
    ];
    ogProps.forEach(([attr, prop, content]) => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content as string);
    });
    // Twitter
    const twProps = [
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", "Metro Duty Free - Electronics & Appliances"],
      ["name", "twitter:description", description],
      ["name", "twitter:image", "https://lovable.dev/opengraph-image-p98pqg.png"],
    ];
    twProps.forEach(([attr, prop, content]) => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content as string);
    });
    // Canonical tag
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, []);
  // --- End SEO tags

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    console.log(`Selected category: ${category}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeMode="duty-free" setActiveMode={() => {}} />
      <ProductCategories onCategorySelect={handleCategorySelect} />
      <WhatsAppFloat />
      <BackToTopButton />
      
      <Hero setActiveMode={() => {}} />
      
      <ProductGrid mode="featured" productsPerRow={4} />
      <Footer />
    </div>
  );
};

export default Index;
