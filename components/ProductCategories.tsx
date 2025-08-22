
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Fan } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'next/link';

// Custom SVG icons inspired by your uploaded product images and instructions
const BlenderIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
    <rect x="7" y="6" width="10" height="10" rx="2" stroke="currentColor"/>
    <rect x="9" y="3" width="6" height="3" rx="1" stroke="currentColor"/>
    <rect x="10" y="17" width="4" height="2.5" rx="1" stroke="currentColor"/>
    <rect x="8.5" y="20" width="7" height="2" rx="1" stroke="currentColor"/>
    <line x1="12" y1="8" x2="12" y2="15" stroke="currentColor"/>
    <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor"/>
    <line x1="14" y1="10" x2="10" y2="14" stroke="currentColor"/>
  </svg>
);

const RiceCookerIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
    <ellipse cx="12" cy="14" rx="8" ry="6" stroke="currentColor"/>
    <rect x="4" y="10" width="16" height="8" rx="4" stroke="currentColor"/>
    <rect x="6" y="17" width="12" height="3" rx="1" stroke="currentColor"/>
    <rect x="9" y="7" width="6" height="3" rx="1.5" stroke="currentColor"/>
    <line x1="12" y1="4" x2="12" y2="7" stroke="currentColor"/>
  </svg>
);

const VacuumIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
    <ellipse cx="10" cy="18" rx="6" ry="3" stroke="currentColor"/>
    <rect x="6" y="8" width="8" height="10" rx="4" stroke="currentColor"/>
    <rect x="5" y="5" width="10" height="3" rx="1" stroke="currentColor"/>
    <line x1="11" y1="3" x2="11" y2="5" stroke="currentColor"/>
    <line x1="9" y1="4" x2="13" y2="4" stroke="currentColor"/>
    <line x1="7.5" y1="16" x2="12.5" y2="16" stroke="currentColor"/>
    <circle cx="16.5" cy="18" r="2" stroke="currentColor"/>
  </svg>
);

const StandMixerIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
    <rect x="4" y="6" width="13" height="6" rx="3" stroke="currentColor"/>
    <rect x="9" y="12" width="6" height="5" rx="2" stroke="currentColor"/>
    <rect x="7" y="17" width="8" height="2" rx="1" stroke="currentColor"/>
    <line x1="3" y1="4" x2="13" y2="4" stroke="currentColor"/>
    <line x1="8" y1="6" x2="8" y2="12" stroke="currentColor"/>
  </svg>
);

const AccessoriesIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
    <rect x="3" y="15" width="8" height="6" rx="2" stroke="currentColor"/>
    <rect x="13" y="3" width="8" height="6" rx="2" stroke="currentColor"/>
    <circle cx="7" cy="7" r="3" stroke="currentColor"/>
    <circle cx="17" cy="17" r="3" stroke="currentColor"/>
    <line x1="10" y1="7" x2="14" y2="7" stroke="currentColor"/>
    <line x1="7" y1="10" x2="7" y2="14" stroke="currentColor"/>
    <line x1="17" y1="14" x2="17" y2="10" stroke="currentColor"/>
  </svg>
);

const categories = [
  { name: 'Refrigerators', icon: 
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor"/>
      <line x1="6" y1="10" x2="18" y2="10" stroke="currentColor"/>
      <rect x="8.5" y="5" width="7" height="2" rx="1" stroke="currentColor"/>
      <rect x="8.5" y="13" width="7" height="2" rx="1" stroke="currentColor"/>
    </svg>, slug: 'refrigerators' },
  { name: 'TVs', icon: 
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor"/>
      <rect x="9" y="18" width="6" height="2" rx="1" stroke="currentColor"/>
      <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor"/>
    </svg>, slug: 'tvs' },
  { name: 'Vacuums', icon: VacuumIcon, slug: 'vacuums' },
  { name: 'Washing Machines', icon: 
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor"/>
      <circle cx="9" cy="7" r="1" stroke="currentColor"/>
      <circle cx="15" cy="7" r="1" stroke="currentColor"/>
    </svg>, slug: 'washing-machines' },
  { name: 'Ovens', icon: 
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor"/>
      <rect x="5" y="7" width="14" height="6" rx="2" stroke="currentColor"/>
      <circle cx="8" cy="13" r="1.5" stroke="currentColor"/>
      <circle cx="16" cy="13" r="1.5" stroke="currentColor"/>
      <line x1="7" y1="5" x2="7" y2="7" stroke="currentColor"/>
      <line x1="17" y1="5" x2="17" y2="7" stroke="currentColor"/>
    </svg>, slug: 'ovens' },
  { name: 'Stand Mixers', icon: StandMixerIcon, slug: 'stand-mixers' },
  { name: 'Rice Cookers', icon: RiceCookerIcon, slug: 'rice-cookers' },
  { name: 'Blenders', icon: BlenderIcon, slug: 'blenders' },
  { name: 'Fans', icon: <Fan size={32} />, slug: 'fans' },
  { name: 'Speakers', icon: 
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="4" y="5" width="8" height="14" rx="2" stroke="currentColor"/>
      <circle cx="8" cy="12" r="2" stroke="currentColor"/>
      <path d="M16 7c2 1.5 2 8.5 0 10" stroke="currentColor"/>
      <path d="M19 3c4 3 4 15 0 18" stroke="currentColor"/>
    </svg>, slug: 'speakers' },
  { name: 'Electronic Household Accessories', icon: AccessoriesIcon, slug: 'accessories' }
];

interface ProductCategoriesProps {
  onCategorySelect?: (category: string) => void;
}

export const ProductCategories = ({ onCategorySelect }: ProductCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category: typeof categories[0]) => {
    setSelectedCategory(category.name);
    onCategorySelect?.(category.name);
    navigate(`/category/${category.slug}`);
  };

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateArrowVisibility();
      container.addEventListener('scroll', updateArrowVisibility);
      return () => container.removeEventListener('scroll', updateArrowVisibility);
    }
  }, []);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20 py-6">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollLeft}
              className="absolute left-0 z-10 h-12 w-12 rounded-lg bg-background/90 hover:bg-background shadow-lg border border-primary/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Scrollable Categories */}
          <div className="w-full mx-16 overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex space-x-4 pb-2 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category.name
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-4 text-center min-w-[120px]">
                    <div className="text-primary mb-3 flex justify-center">{category.icon}</div>
                    <p className="text-sm font-medium text-foreground/80 leading-tight">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollRight}
              className="absolute right-0 z-10 h-12 w-12 rounded-lg bg-background/90 hover:bg-background shadow-lg border border-primary/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
