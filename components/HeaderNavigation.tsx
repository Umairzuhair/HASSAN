
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getGuestCart } from '@/utils/guestCart';

interface HeaderNavigationProps {
  onSearchClick: () => void;
  onAccountClick: () => void;
  onCartClick: () => void;
}

export const HeaderNavigation = ({ onSearchClick, onAccountClick, onCartClick }: HeaderNavigationProps) => {
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch cart count for authenticated users
      fetchCartCount();
    } else {
      // Get cart count for guest users
      updateGuestCartCount();
      
      // Listen for guest cart updates
      const handleGuestCartUpdate = () => {
        updateGuestCartCount();
      };
      
      window.addEventListener('guestCartUpdated', handleGuestCartUpdate);
      window.addEventListener('storage', handleGuestCartUpdate);
      
      return () => {
        window.removeEventListener('guestCartUpdated', handleGuestCartUpdate);
        window.removeEventListener('storage', handleGuestCartUpdate);
      };
    }
  }, [user]);

  const updateGuestCartCount = () => {
    const guestCart = getGuestCart();
    const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  };

  const fetchCartCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={onSearchClick}>
        <Search className="w-5 h-5" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={onAccountClick}>
        <User className="w-5 h-5" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </Button>
    </div>
  );
};
