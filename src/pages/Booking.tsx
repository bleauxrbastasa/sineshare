import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitBooking } from "@/hooks/useBooking";
import { supabase } from "@/integrations/supabase/client";
import { generateBookingPDF, getBookingPDFBase64 } from "@/lib/generateBookingPDF";
import { Link } from "react-router-dom";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import type { CartItem } from "@/lib/types";

const Booking = () => {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const submitBooking = useSubmitBooking();
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [submittedAt, setSubmittedAt] = useState<Date>(new Date());
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    facebook_name: "",
    email: "",
    notes: "",
  });

  // Keep a snapshot of items for PDF after cart is cleared
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const getPDFData = (bId: string, date: Date, cartItems: CartItem[]) => ({
    bookingId: bId,
    name: form.name,
    mobile: form.mobile,
    email: form.email,
    facebookName: form.facebook_name || undefined,
    notes: form.notes || undefined,
    items: cartItems,
    submittedAt: date,
  });

  const handleDownloadPDF = async () => {
    const doc = await generateBookingPDF(getPDFData(bookingId, submittedAt, submittedItems));
    doc.save(`sineshare-booking-${bookingId}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.email) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Empty cart", description: "Please add items to your cart first.", variant: "destructive" });
      return;
    }
    try {
      const booking = await submitBooking.mutateAsync({
        full_name: form.name,
        mobile_number: form.mobile,
        facebook_name: form.facebook_name,
        email: form.email,
        message: form.notes,
        items,
      });

      const bId = booking.id;
      const now = new Date();
      setBookingId(bId);
      setSubmittedAt(now);
      setSubmittedItems([...items]);
      setSubmitted(true);

      // Generate PDF base64 and send email (fire-and-forget, don't block UX)
      const pdfData = getPDFData(bId, now, items);
      getBookingPDFBase64(pdfData)
        .then((pdfBase64) => {
          const emailItems = items.map((item) => {
            const days = differenceInDays(item.return_date, item.pickup_date) || 1;
            return {
              name: item.gear.item_name,
              quantity: item.quantity,
              pickupDate: format(item.pickup_date, "MMM d, yyyy"),
              returnDate: format(item.return_date, "MMM d, yyyy"),
              dailyRate: item.gear.daily_rate_php,
              days,
              subtotal: (item.gear.daily_rate_php || 0) * item.quantity * days,
            };
          });
          const estimatedTotal = emailItems.reduce((s, i) => s + i.subtotal, 0);

          return supabase.functions.invoke("send-booking-email", {
            body: {
              bookingId: bId,
              customerName: form.name,
              mobile: form.mobile,
              email: form.email,
              facebookName: form.facebook_name || undefined,
              notes: form.notes || undefined,
              submittedAt: format(now, "MMMM d, yyyy 'at' h:mm a"),
              items: emailItems,
              estimatedTotal,
              pdfBase64,
            },
          });
        })
        .catch((err) => console.error("Email send failed:", err));
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Something went wrong.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center space-y-6 max-w-lg">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
          <h1 className="text-2xl font-display font-bold text-foreground">Booking Request Submitted</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you, we will be contacting you within 1-24 hours through the provided details under the name <strong className="text-foreground">"Bleaux "Bleu" R. Bastasa"</strong>. Please download the PDF for future reference.
          </p>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="w-4 h-4" /> Download Booking Summary (PDF)
          </Button>
          <div>
            <Button asChild variant="outline" onClick={() => clearCart()} className="mt-4 border-border/50 text-foreground hover:bg-secondary">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Booking Request</h1>
          <p className="text-muted-foreground">Fill in your details to submit a rental inquiry.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">Your cart is empty. Add items before submitting.</p>
            <Button asChild><Link to="/catalog">Browse Catalog</Link></Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected gear summary */}
            <div className="p-5 rounded-lg border border-border/50 bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Selected Equipment ({items.length})</h3>
              {items.map((item) => (
                <div key={item.gear.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.gear.item_name} × {item.quantity}</span>
                  <span className="text-foreground">{format(item.pickup_date, "MMM d")} – {format(item.return_date, "MMM d")}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-secondary border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input id="mobile" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="bg-secondary border-border/50" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-secondary border-border/50" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fb_name">Facebook Account Name</Label>
              <Input id="fb_name" value={form.facebook_name} onChange={(e) => update("facebook_name", e.target.value)} className="bg-secondary border-border/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} className="bg-secondary border-border/50 min-h-[80px]" placeholder="Any special requests or notes for your booking..." />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitBooking.isPending}>
              {submitBooking.isPending ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Booking;
