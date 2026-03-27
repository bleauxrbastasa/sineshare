import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeft, ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const GearDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { data: gear, isLoading } = useProduct(id);

  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!gear) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Item Not Found</h1>
          <Button asChild variant="outline"><Link to="/catalog">Back to Catalog</Link></Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!pickupDate || !returnDate) {
      toast({ title: "Select dates", description: "Please select pickup and return dates.", variant: "destructive" });
      return;
    }
    if (returnDate <= pickupDate) {
      toast({ title: "Invalid dates", description: "Return date must be after pickup date.", variant: "destructive" });
      return;
    }
    addItem(gear, quantity, pickupDate, returnDate);
    toast({ title: "Added to cart", description: `${gear.item_name} × ${quantity} added.` });
  };

  const inclusionsList = gear.inclusions ? gear.inclusions.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square rounded-lg bg-muted/20 border border-border/50 overflow-hidden">
            <img src={gear.image_url} alt={gear.item_name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{gear.category}</Badge>
                <Badge className={`text-xs ${gear.status === "Available" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-secondary text-secondary-foreground"}`}>
                  {gear.status}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{gear.item_name}</h1>
              {gear.short_description && <p className="text-muted-foreground">{gear.short_description}</p>}
            </div>

            {/* Pricing */}
            <div className="p-5 rounded-lg bg-secondary/50 border border-border/50 space-y-3">
              {gear.daily_rate_php && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Daily Rate</span>
                  <span className="text-2xl font-display font-bold text-primary">₱{gear.daily_rate_php.toLocaleString()}</span>
                </div>
              )}
              {gear.replacement_value_php && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Replacement Value</span>
                  <span className="text-sm font-medium text-foreground">₱{gear.replacement_value_php.toLocaleString()}</span>
                </div>
              )}
              {gear.quantity > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Available Units</span>
                  <span className="text-sm font-medium text-foreground">{gear.quantity}</span>
                </div>
              )}
            </div>

            {/* Inclusions */}
            {inclusionsList.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Inclusions</h3>
                <ul className="space-y-1.5">
                  {inclusionsList.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking controls */}
            <div className="space-y-4 p-5 rounded-lg border border-border/50 bg-card">
              <h3 className="text-sm font-semibold text-foreground">Book this item</h3>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !pickupDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "MMM d, yyyy") : "Pickup date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !returnDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "MMM d, yyyy") : "Return date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} disabled={(d) => d < (pickupDate || new Date())} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(gear.quantity || 1, quantity + 1))} className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="w-full" disabled={gear.status !== "Available"}>
                <ShoppingCart className="mr-2 w-4 h-4" /> Add to Cart
              </Button>
            </div>

            {gear.notes && (
              <p className="text-xs text-muted-foreground italic">Note: {gear.notes}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GearDetail;
