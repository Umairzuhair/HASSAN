
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'next/link';

interface SearchBarProps {
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onProductClick: (productId: string) => void;
}

export const SearchBar = ({
  searchQuery,
  searchResults,
  isSearching,
  onSearchChange,
  onClose,
  onProductClick,
}: SearchBarProps) => {
  return (
    <div className="py-4 border-t border-primary/20">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-10 pr-12 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Search Results */}
      {(searchResults.length > 0 || isSearching) && (
        <div className="mt-2 bg-background border border-primary/20 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : (
            <div className="p-2">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onProductClick(product.id)}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-muted rounded-lg text-left"
                >
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
