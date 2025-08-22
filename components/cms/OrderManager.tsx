
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, User, Calendar, Phone, RefreshCcw, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// USE SUPABASE GENERATED order_status TYPE!
import type { Database } from '@/integrations/supabase/types';
type OrderStatus = Database['public']['Enums']['order_status'];

interface Order {
  id: string;
  user_id: string;
  customer_email: string; // Now part of the main order data
  passport_number: string;
  arrival_flight_number: string;
  surname: string;
  other_names: string;
  contact_number: string;
  arrival_date: string;
  arrival_time: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  product_category: string;
  product_image_url: string | null;
}

export const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { toast } = useToast();

  // New: track if user is admin
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // State for editing totals (order id -> edit value)
  const [editingTotals, setEditingTotals] = useState<{ [orderId: string]: string }>({});
  const [editingTotalId, setEditingTotalId] = useState<string | null>(null);
  const [savingTotal, setSavingTotal] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current user's admin status
    const checkAdmin = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        if (error) throw error;
        setIsAdmin(Array.isArray(data) ? data.some((r) => r.role === 'admin') : false);
      } catch (e) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  // Fetch orders based on admin status
  const fetchOrders = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch orders - admins can see all orders due to the new RLS policy
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      console.log("[OrderManager] Orders fetched:", ordersData);

      // 2. Fetch all order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*');

      if (itemsError) throw itemsError;
      console.log("[OrderManager] Order items fetched:", itemsData);

      // 3. Group order items by order_id
      const groupedItems: { [key: string]: OrderItem[] } = {};
      (itemsData || []).forEach((item) => {
        if (!groupedItems[item.order_id]) {
          groupedItems[item.order_id] = [];
        }
        groupedItems[item.order_id].push(item as OrderItem);
      });

      setOrders((ordersData || []) as Order[]);
      setOrderItems(groupedItems);

    } catch (error: any) {
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
      setFetchError(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Use a timer to refresh orders every 30s for near-realtime updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order updated",
        description: "Order status has been updated successfully",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // NEW: Save updated total
  const updateOrderTotal = async (orderId: string, newTotal: number) => {
    setSavingTotal(orderId);
    console.log("[OrderManager] updateOrderTotal called with:", { orderId, newTotal });
    try {
      if (Number.isNaN(newTotal) || newTotal === null || newTotal === undefined) {
        console.error("[OrderManager] Invalid newTotal value:", newTotal);
        toast({
          title: "Invalid input",
          description: "You must enter a valid number for the total.",
          variant: "destructive",
        });
        setSavingTotal(null);
        return;
      }
      const { error, data } = await supabase
        .from('orders')
        .update({
          total: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select();

      if (error) {
        console.error("[OrderManager] Error updating order total:", error);
        throw error;
      }

      console.log("[OrderManager] Order total updated for order", orderId, "->", newTotal, data);

      toast({
        title: 'Order Total Updated',
        description: 'Total value for this order has been updated successfully.',
      });
      setEditingTotalId(null);
      setEditingTotals((prev) => ({ ...prev, [orderId]: String(newTotal) }));
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error updating total",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingTotal(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'collected':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order =>
    statusFilter === 'all' || order.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Show admin badge notification if admin */}
      {isAdmin && (
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50 rounded border border-blue-200 mb-2">
          <span className="text-blue-800 font-semibold flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mr-2">Admin</Badge>
            You are viewing <span className="font-bold">all orders</span>.
          </span>
        </div>
      )}
      
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            title="Refresh"
            aria-label="Refresh"
            className="flex gap-1 items-center"
          >
            <RefreshCcw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Select value={statusFilter} onValueChange={val => setStatusFilter(val as OrderStatus | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="collected">Collected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading orders...
        </div>
      )}

      {fetchError && (
        <div className="text-center py-8 text-red-500">
          Error: {fetchError}
        </div>
      )}

      {!loading && !fetchError && (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const items = orderItems[order.id] || [];
            const isEditing = editingTotalId === order.id;
            const canEditTotal = isAdmin;

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order.id.slice(-8)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="collected">Collected</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {order.surname}, {order.other_names}
                        </div>
                        {/* Display customer email from order */}
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="font-medium">Email:</span> {order.customer_email}
                        </div>
                        <div>
                          <span className="font-medium">Passport:</span> {order.passport_number}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span className="font-medium">Contact:</span> {order.contact_number}
                        </div>
                      </div>

                      <h4 className="font-semibold mb-3 mt-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Arrival Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Flight:</span> {order.arrival_flight_number}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(order.arrival_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {order.arrival_time}
                        </div>
                      </div>
                    </div>

                    {/* Order Items and Editable Total */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items ({items.length})
                      </h4>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 border rounded">
                            {item.product_image_url && (
                              <img
                                src={item.product_image_url}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.product_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.product_category} • Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {/* Editable Total Field for admin - otherwise static */}
                        <div className="flex items-center justify-between font-semibold gap-2">
                          <span>Total:</span>
                          {canEditTotal ? (
                            isEditing ? (
                              <form
                                className="flex gap-2 items-center"
                                onSubmit={e => {
                                  e.preventDefault();
                                  // Fix: Ensure parsing & logging state for debugging
                                  const val = editingTotals[order.id];
                                  console.log("[OrderManager] Edit form submitted. Value:", val);
                                  const newTotal = parseFloat(val);
                                  if (
                                    Number.isNaN(newTotal) ||
                                    (typeof val === "string" && val.trim() === "")
                                  ) {
                                    toast({
                                      title: 'Invalid value',
                                      description: 'Please enter a valid non-negative number for total.',
                                      variant: 'destructive',
                                    });
                                    return;
                                  }
                                  updateOrderTotal(order.id, newTotal);
                                }}
                              >
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editingTotals[order.id] ?? String(order.total)}
                                  onChange={e => {
                                    const nextVal = e.target.value;
                                    setEditingTotals(prev => ({
                                      ...prev,
                                      [order.id]: nextVal
                                    }));
                                    console.log("[OrderManager] Editing value changed:", nextVal);
                                  }}
                                  className="max-w-[110px]"
                                  disabled={savingTotal === order.id}
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={savingTotal === order.id}
                                >
                                  {savingTotal === order.id ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={savingTotal === order.id}
                                  onClick={() => {
                                    setEditingTotalId(null);
                                    setEditingTotals(prev => ({
                                      ...prev,
                                      [order.id]: String(order.total)
                                    }));
                                    console.log("[OrderManager] Cancel edit for id:", order.id);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </form>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span>${order.total.toFixed(2)}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="ml-2 px-2"
                                  onClick={() => {
                                    setEditingTotalId(order.id);
                                    setEditingTotals(prev => ({
                                      ...prev,
                                      [order.id]: String(order.total)
                                    }));
                                    console.log("[OrderManager] Edit button clicked for:", order.id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </span>
                            )
                          ) : (
                            <span>${order.total.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && !fetchError && filteredOrders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No orders found {statusFilter !== 'all' && `with status "${statusFilter}"`}
        </div>
      )}
    </div>
  );
};
