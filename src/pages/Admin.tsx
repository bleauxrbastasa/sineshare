import { useState } from "react";
import Layout from "@/components/Layout";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { GearItem, CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";

const Admin = () => {
  const { toast } = useToast();
  const { data: items = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [editing, setEditing] = useState<GearItem | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyItem: Omit<GearItem, "id"> = {
    item_name: "",
    consignment: "N",
    category: "Cameras",
    quantity: 1,
    short_description: "",
    retail_value_php: null,
    total_php: null,
    daily_rate_php: null,
    replacement_value_php: null,
    inclusions: "",
    status: "Available",
    notes: "",
    image_url: "/placeholder.svg",
  };

  const [formData, setFormData] = useState<any>(emptyItem);

  const filtered = items.filter(
    (i) =>
      i.item_name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: GearItem) => {
    setFormData(item);
    setEditing(item);
    setShowForm(true);
  };

  const handleNew = () => {
    setFormData({ ...emptyItem });
    setEditing(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.item_name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        const { created_at, ...updates } = formData;
        await updateProduct.mutateAsync(updates);
        toast({ title: "Item updated" });
      } else {
        const { id, created_at, ...newItem } = formData;
        await createProduct.mutateAsync(newItem);
        toast({ title: "Item added" });
      }
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const update = (field: string, value: any) => setFormData((p: any) => ({ ...p, [field]: value }));

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your equipment catalog</p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-lg border border-primary/30 bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">
                {editing ? "Edit Item" : "New Item"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Item Name *</Label>
                <Input value={formData.item_name} onChange={(e) => update("item_name", e.target.value)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Daily Rate (₱)</Label>
                <Input type="number" value={formData.daily_rate_php || ""} onChange={(e) => update("daily_rate_php", e.target.value ? Number(e.target.value) : null)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Replacement Value (₱)</Label>
                <Input type="number" value={formData.replacement_value_php || ""} onChange={(e) => update("replacement_value_php", e.target.value ? Number(e.target.value) : null)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => update("quantity", Number(e.target.value))} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={formData.image_url} onChange={(e) => update("image_url", e.target.value)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Consignment</Label>
                <select
                  value={formData.consignment || "N"}
                  onChange={(e) => update("consignment", e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Retail Value (₱)</Label>
                <Input type="number" value={formData.retail_value_php || ""} onChange={(e) => update("retail_value_php", e.target.value ? Number(e.target.value) : null)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Short Description</Label>
                <Textarea value={formData.short_description} onChange={(e) => update("short_description", e.target.value)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Inclusions (comma separated)</Label>
                <Textarea value={formData.inclusions} onChange={(e) => update("inclusions", e.target.value)} className="bg-secondary border-border/50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => update("notes", e.target.value)} className="bg-secondary border-border/50" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
                {(createProduct.isPending || updateProduct.isPending) ? (
                  <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...</>
                ) : editing ? "Save Changes" : "Add Item"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-border/50 text-foreground hover:bg-secondary">Cancel</Button>
            </div>
          </div>
        )}

        <SearchBar value={search} onChange={setSearch} placeholder="Search inventory..." />

        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${filtered.length} items`}
        </div>

        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-surface-hover transition-colors">
              <div className="w-12 h-12 rounded bg-muted/20 shrink-0 overflow-hidden">
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{item.item_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                  {item.daily_rate_php && (
                    <span className="text-xs text-primary">₱{item.daily_rate_php.toLocaleString()}/day</span>
                  )}
                  <Badge
                    className={`text-[10px] ${item.status === "Available" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
