
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Package, MapPin } from 'lucide-react';
import { useLocation } from 'next/link';

const productCategories = [
  { name: 'Refrigerators', slug: 'refrigerators' },
  { name: 'TVs', slug: 'tvs' },
  { name: 'Vacuums', slug: 'vacuums' },
  { name: 'Washing Machines', slug: 'washing-machines' },
  { name: 'Ovens', slug: 'ovens' },
  { name: 'Stand Mixers', slug: 'stand-mixers' },
  { name: 'Rice Cookers', slug: 'rice-cookers' },
  { name: 'Blenders', slug: 'blenders' },
  { name: 'Fans', slug: 'fans' },
  { name: 'Speakers', slug: 'speakers' },
  { name: 'Electronic Household Accessories', slug: 'accessories' }
];

interface MobileMenuProps {
  user: any;
  onAccountClick: () => void;
  onCartClick: () => void;
  onAllowanceClick: () => void;
  onStoreLocatorClick: () => void;
  onCategoryClick: (slug: string) => void;
  onWhatsAppClick: () => void;
}

export const MobileMenu = ({
  user,
  onAccountClick,
  onCartClick,
  onAllowanceClick,
  onStoreLocatorClick,
  onCategoryClick,
  onWhatsAppClick,
}: MobileMenuProps) => {
  const location = useLocation();

  return (
    <div className="py-4 border-t border-primary/20">
      <div className="flex flex-col space-y-4">
        {/* Auth Section */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onAccountClick}
            className="justify-start w-full text-lg font-semibold"
          >
            <User className="w-5 h-5 mr-3" />
            {user ? 'My Account' : 'Sign In'}
          </Button>
          <Button
            variant="ghost"
            onClick={onCartClick}
            className="justify-start w-full text-lg font-semibold"
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Cart
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-2 pt-2 border-t border-primary/10">
          <Button
            variant={location.pathname === '/allowance' ? 'default' : 'ghost'}
            onClick={onAllowanceClick}
            className="justify-start w-full text-lg font-semibold"
          >
            <Package className="w-5 h-5 mr-3" />
            Allowance
          </Button>
          
          <Button
            variant={location.pathname === '/store-locator' ? 'default' : 'ghost'}
            onClick={onStoreLocatorClick}
            className="justify-start w-full text-lg font-semibold"
          >
            <MapPin className="w-5 h-5 mr-3" />
            Store Locator
          </Button>
        </div>

        {/* Product Categories - Removed "Product Categories" label */}
        <div className="pt-2 border-t border-primary/10">
          <div className="space-y-1">
            {productCategories.map((category) => (
              <button
                key={category.name}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-3 text-left w-full"
                onClick={() => onCategoryClick(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Call Us Section */}
        <div className="pt-2 border-t border-primary/10">
          <button
            onClick={onWhatsAppClick}
            className="text-green-600 hover:text-green-700 font-medium py-2 px-3 text-left w-full transition-colors"
          >
            Call Us (WhatsApp/Hotline)
          </button>
        </div>
      </div>
    </div>
  );
};
