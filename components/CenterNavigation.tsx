
import { Button } from '@/components/ui/button';
import { Package, MapPin, Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'next/link';

interface CenterNavigationProps {
  onAllowanceClick: () => void;
  onStoreLocatorClick: () => void;
  onWhatsAppClick: () => void;
}

export const CenterNavigation = ({
  onAllowanceClick,
  onStoreLocatorClick,
  onWhatsAppClick,
}: CenterNavigationProps) => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center space-x-6">
      <Button
        variant={location.pathname === '/allowance' ? 'default' : 'ghost'}
        onClick={onAllowanceClick}
        className="flex items-center gap-2"
      >
        <Package className="w-4 h-4" />
        Allowance
      </Button>
      
      <Button
        variant={location.pathname === '/store-locator' ? 'default' : 'ghost'}
        onClick={onStoreLocatorClick}
        className="flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        Store Locator
      </Button>
      
      <Button
        variant="ghost"
        onClick={onWhatsAppClick}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Phone className="w-4 h-4" />
        Call Us
      </Button>
    </div>
  );
};
