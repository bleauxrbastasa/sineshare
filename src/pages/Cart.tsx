import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center space-y-6">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-display font-bold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground">Browse our catalog to find the gear you need.</p>
          <Button asChild><Link to="/catalog">Browse Catalog</Link></Button>
        </div>
      </Layout>
    );
  }

  const totalEstimate = items.reduce((sum, item) => {
    const days = differenceInDays(item.return_date, item.pickup_date) || 1;
    return sum + (item.gear.daily_rate_php || 0) * item.quantity * days;
  }, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Review Cart</h1>
            <p className="text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} selected</p>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-destructive text-sm">
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const days = differenceInDays(item.return_date, item.pickup_date) || 1;
            const subtotal = (item.gear.daily_rate_php || 0) * item.quantity * days;
            return (
              <div key={item.gear.id} className="p-5 rounded-lg border border-border/50 bg-card flex flex-col sm:flex-row gap-4">
                <div className="w-20 h-20 rounded-md bg-muted/20 shrink-0 overflow-hidden">
                  <img src={item.gear.image_url} alt={item.gear.item_name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.gear.item_name}</h3>
                      <p className="text-xs text-muted-foreground">{item.gear.category}</p>
                    </div>
                    <button onClick={() => removeItem(item.gear.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span>Pickup: {format(item.pickup_date, "MMM d, yyyy")}</span>
                    <span>Return: {format(item.return_date, "MMM d, yyyy")}</span>
                    <span>{days} day{days !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Qty:</span>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.gear.id, Number(e.target.value))}
                        className="bg-secondary border border-border/50 rounded px-2 py-1 text-xs text-foreground"
                      >
                        {Array.from({ length: item.gear.quantity || 1 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    {item.gear.daily_rate_php && (
                      <span className="text-sm font-display font-bold text-primary">₱{subtotal.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-6 rounded-lg border border-border/50 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Total</span>
            <span className="text-2xl font-display font-bold text-primary">₱{totalEstimate.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">Final pricing confirmed upon booking review.</p>
          <Button asChild className="w-full" size="lg">
            <Link to="/booking">
              Submit Booking Request <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
