
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, MoveUp, MoveDown, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  in_stock: boolean | null;
}

interface FeaturedProduct {
  id: string;
  product_id: string;
  display_order: number;
  is_active: boolean;
  products: Product;
}

export const FeaturedProductsManager = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchAllProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_products')
        .select(`
          id,
          product_id,
          display_order,
          is_active,
          products (
            id,
            name,
            category,
            image_url,
            in_stock
          )
        `)
        .order('display_order');

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading featured products",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, image_url, in_stock')
        .order('name');

      if (error) throw error;
      setAllProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeaturedProduct = async () => {
    if (!selectedProductId) {
      toast({
        title: "No product selected",
        description: "Please select a product to add to featured products.",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = Math.max(...featuredProducts.map(fp => fp.display_order), -1);
      
      const { error } = await supabase
        .from('featured_products')
        .insert({
          product_id: selectedProductId,
          display_order: maxOrder + 1,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Product added",
        description: "Product has been added to featured products.",
      });

      setSelectedProductId('');
      fetchFeaturedProducts();
    } catch (error: any) {
      toast({
        title: "Error adding featured product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFeaturedProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('featured_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product removed",
        description: "Product has been removed from featured products.",
      });

      fetchFeaturedProducts();
    } catch (error: any) {
      toast({
        title: "Error removing featured product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateDisplayOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('featured_products')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchFeaturedProducts();
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...featuredProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;

    // Swap display orders
    const currentProduct = newProducts[index];
    const targetProduct = newProducts[targetIndex];
    
    updateDisplayOrder(currentProduct.id, targetProduct.display_order);
    updateDisplayOrder(targetProduct.id, currentProduct.display_order);
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('featured_products')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentActive ? "Product deactivated" : "Product activated",
        description: `Product has been ${currentActive ? 'hidden from' : 'shown on'} the homepage.`,
      });

      fetchFeaturedProducts();
    } catch (error: any) {
      toast({
        title: "Error updating product status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const availableProducts = allProducts.filter(
    product => !featuredProducts.some(fp => fp.product_id === product.id)
  );

  if (loading) {
    return <div className="text-center">Loading featured products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Featured Products Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Featured Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="product-select">Select Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product to feature" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addFeaturedProduct} disabled={!selectedProductId}>
              <Plus className="w-4 h-4 mr-2" />
              Add to Featured
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Current Featured Products ({featuredProducts.length})
        </h3>
        
        {featuredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No featured products configured. Add some products above to get started.
            </CardContent>
          </Card>
        ) : (
          featuredProducts.map((featured, index) => (
            <Card key={featured.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveProduct(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveProduct(index, 'down')}
                      disabled={index === featuredProducts.length - 1}
                    >
                      <MoveDown className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-sm font-mono text-muted-foreground min-w-[2rem]">
                    #{featured.display_order + 1}
                  </div>

                  {featured.products.image_url && (
                    <img
                      src={featured.products.image_url}
                      alt={featured.products.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{featured.products.name}</h4>
                      <Badge variant="outline">{featured.products.category}</Badge>
                      {featured.is_active && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Status: {featured.products.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={featured.is_active ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleActive(featured.id, featured.is_active)}
                    >
                      {featured.is_active ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFeaturedProduct(featured.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {featuredProducts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the up/down arrows to reorder products</li>
            <li>• Only active products will show on the homepage</li>
            <li>• Products appear in the order shown here (top to bottom)</li>
            <li>• You can temporarily hide products without removing them</li>
          </ul>
        </div>
      )}
    </div>
  );
};
