import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import GearCard from "@/components/GearCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/lib/types";

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get("category") as Category) || "All";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>(initialCat);
  const { data: products = [], isLoading } = useProducts();

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesCat = category === "All" || item.category === category;
      const matchesSearch =
        !search ||
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
        item.short_description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, category, products]);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-foreground">Equipment Catalog</h1>
          <p className="text-muted-foreground">Browse our full inventory of production gear</p>
        </div>

        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} items found`}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No equipment found matching your criteria.</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Catalog;
