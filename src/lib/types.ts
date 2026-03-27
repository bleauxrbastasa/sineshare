export interface GearItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  short_description: string;
  daily_rate_php: number | null;
  replacement_value_php: number | null;
  inclusions: string;
  status: "Available" | "Unavailable" | "Reserved";
  notes: string;
  image_url: string;
}

export interface CartItem {
  gear: GearItem;
  quantity: number;
  pickup_date: Date;
  return_date: Date;
}

export interface BookingRequest {
  name: string;
  mobile: string;
  facebook_name: string;
  facebook_link: string;
  email: string;
  pickup_date: string;
  return_date: string;
  items: CartItem[];
  notes: string;
}

export const CATEGORIES = [
  "All",
  "Cameras",
  "Lenses",
  "Monitors",
  "Lights",
  "Sound",
  "Accessories",
  "Focus Puller Rig",
  "Diffusion & Support",
  "Modifiers",
  "Misc",
] as const;

export type Category = (typeof CATEGORIES)[number];
