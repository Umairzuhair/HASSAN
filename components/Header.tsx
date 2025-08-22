
import { useState } from 'react';
import { useNavigate } from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProductSearch } from '@/hooks/useProductSearch';
import { SearchBar } from '@/components/SearchBar';
import { MobileMenu } from '@/components/MobileMenu';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import { CenterNavigation } from '@/components/CenterNavigation';

interface HeaderProps {
  activeMode: 'duty-free' | 'allowance' | null;
  setActiveMode: (mode: 'duty-free' | 'allowance' | null) => void;
}

export const Header = ({ activeMode, setActiveMode }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchProducts,
    clearSearch,
  } = useProductSearch();

  const handleAllowanceClick = () => {
    navigate('/allowance');
    setMobileMenuOpen(false);
  };

  const handleStoreLocatorClick = () => {
    navigate('/store-locator');
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/auth');
    }
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setMobileMenuOpen(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "94777316948";
    const message = "Hello! I'm interested in your products.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
    setMobileMenuOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    clearSearch();
  };

  const closeSearch = () => {
    setSearchOpen(false);
    clearSearch();
  };

  return (
    <header className="bg-primary/5 border-b border-primary/20 sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Hamburger Menu & Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <button 
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/53c25831-e597-4c4b-9bb6-368b3f1bff4f.png" 
                alt="Metro International Duty Free" 
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Center Navigation - Desktop Only */}
          <CenterNavigation
            onAllowanceClick={handleAllowanceClick}
            onStoreLocatorClick={handleStoreLocatorClick}
            onWhatsAppClick={handleWhatsAppClick}
          />

          {/* Right Side - Search, Account, Cart */}
          <HeaderNavigation
            onSearchClick={() => setSearchOpen(!searchOpen)}
            onAccountClick={handleAccountClick}
            onCartClick={handleCartClick}
          />
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <SearchBar
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            onSearchChange={handleSearchInputChange}
            onClose={closeSearch}
            onProductClick={handleProductClick}
          />
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <MobileMenu
            user={user}
            onAccountClick={handleAccountClick}
            onCartClick={handleCartClick}
            onAllowanceClick={handleAllowanceClick}
            onStoreLocatorClick={handleStoreLocatorClick}
            onCategoryClick={handleCategoryClick}
            onWhatsAppClick={handleWhatsAppClick}
          />
        )}
      </div>
    </header>
  );
};
