import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GearItem } from "@/lib/types";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<GearItem[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        id: row.id,
        item_name: row.item_name,
        consignment: row.consignment ?? "N",
        category: row.category,
        quantity: row.quantity,
        short_description: row.short_description ?? "",
        retail_value_php: row.retail_value_php,
        total_php: row.total_php,
        daily_rate_php: row.daily_rate_php,
        replacement_value_php: row.replacement_value_php,
        inclusions: row.inclusions ?? "",
        status: row.status ?? "Available",
        notes: row.notes ?? "",
        image_url: row.image_url ?? "/placeholder.svg",
        created_at: row.created_at,
      }));
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["products", id],
    enabled: !!id,
    queryFn: async (): Promise<GearItem | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        item_name: data.item_name,
        consignment: data.consignment ?? "N",
        category: data.category,
        quantity: data.quantity,
        short_description: data.short_description ?? "",
        retail_value_php: data.retail_value_php,
        total_php: data.total_php,
        daily_rate_php: data.daily_rate_php,
        replacement_value_php: data.replacement_value_php,
        inclusions: data.inclusions ?? "",
        status: data.status ?? "Available",
        notes: data.notes ?? "",
        image_url: data.image_url ?? "/placeholder.svg",
        created_at: data.created_at,
      };
    },
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<GearItem, "id" | "created_at">) => {
      const { data, error } = await supabase.from("products").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GearItem> & { id: string }) => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
