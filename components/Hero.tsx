
import { useState, useEffect } from 'react';
import { useNavigate } from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ChevronRight, Plane, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroProps {
  setActiveMode: (mode: 'duty-free') => void;
  bannerImage?: string;
}

export const Hero = ({ setActiveMode, bannerImage }: HeroProps) => {
  const navigate = useNavigate();
  const [heroImageDesktop, setHeroImageDesktop] = useState<string>('');
  const [heroImageMobile, setHeroImageMobile] = useState<string>('');
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      // Fetch desktop hero image
      const { data: desktopData } = await supabase
        .from('website_content')
        .select('image_url')
        .eq('section', 'hero_image_desktop')
        .single();

      if (desktopData?.image_url) {
        setHeroImageDesktop(desktopData.image_url);
      }

      // Fetch mobile hero image
      const { data: mobileData } = await supabase
        .from('website_content')
        .select('image_url')
        .eq('section', 'hero_image_mobile')
        .single();

      if (mobileData?.image_url) {
        setHeroImageMobile(mobileData.image_url);
      }

      // Fallback if both missing
      if (!desktopData?.image_url && !mobileData?.image_url) {
        const { data: fallbackData } = await supabase
          .from('website_content')
          .select('image_url')
          .eq('section', 'hero_image')
          .single();

        if (fallbackData?.image_url) {
          setHeroImageDesktop(fallbackData.image_url);
          setHeroImageMobile(fallbackData.image_url);
        }
      }
    } catch (error) {
      console.warn('No hero images found:', error);
    }
  };

  const handleDutyFreeClick = () => {
    setActiveMode('duty-free');
    navigate('/duty-free');
  };

  const currentHeroImage = isMobile ? heroImageMobile : heroImageDesktop;

  return (
    <section className="relative">
      {/* Fully edge-to-edge image WITHOUT visible green below */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="w-full flex flex-col items-center p-0 m-0">
          <div className="w-full p-0 m-0">
            <div className="w-full" style={{ height: "220px", maxWidth: "1400px", margin: "0 auto" }}>
              {currentHeroImage ? (
                <img
                  src={currentHeroImage}
                  alt="Metro International"
                  className="w-full h-full object-cover rounded-none border-4"
                  style={{
                    borderColor: 'hsl(var(--primary))',
                    boxShadow: 'none',
                    display: 'block',
                    background: 'transparent',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    margin: 0,
                    width: "100%",
                    height: "220px",
                    maxWidth: "1400px",
                  }}
                  width={1400}
                  height={220}
                />
              ) : (
                <div
                  className="w-full h-full bg-white/20 flex items-center justify-center rounded-none border-4 border-primary"
                  style={{
                    borderColor: 'hsl(var(--primary))',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    width: "100%",
                    height: "220px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                  }}
                >
                  <span className="text-white/60 text-lg text-center">
                    Upload your banner image<br />
                    <span className="text-primary font-bold">1400 x 220 px</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Duty Free Shopping Card */}
      <div className="container mx-auto px-4 py-8 md:py-6">
        <div className="max-w-lg mx-auto">
          <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Plane className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Duty Free Shopping</h3>
              <p className="text-muted-foreground mb-6">
                Pre-order tax-free products and collect them at our airport location.
              </p>
              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Duty Excluded Pricing</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Airport pickup</span>
                </div>
              </div>
              <Button 
                onClick={handleDutyFreeClick}
                size="lg" 
                className="w-full"
              >
                Shop Duty Free
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
