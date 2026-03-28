export interface GearItem {
  id: string;
  item_name: string;
  consignment?: string;
  category: string;
  quantity: number;
  short_description: string;
  retail_value_php?: number | null;
  total_php?: number | null;
  daily_rate_php: number | null;
  replacement_value_php: number | null;
  inclusions: string;
  status: "Available" | "Unavailable" | "Reserved";
  notes: string;
  image_url: string;
  created_at?: string;
}

export interface CartItem {
  gear: GearItem;
  quantity: number;
  pickup_date: Date;
  return_date: Date;
}

export interface BookingRequest {
  id?: string;
  full_name: string;
  mobile_number: string;
  facebook_name: string;
  email: string;
  pickup_date: string;
  return_date: string;
  message: string;
  booking_status: string;
  created_at?: string;
}

export interface BookingRequestItem {
  id?: string;
  booking_request_id: string;
  product_id: string;
  quantity: number;
  daily_rate_php: number | null;
  created_at?: string;
}

export const CATEGORIES = [
  "All",
  "Cameras",
  "Lenses",
  "Monitors",
  "Lights",
  "Gimbals",
  "Sound",
  "Accessories",
  "Focus Puller Rig",
  "Diffusion & Support",
  "Modifiers",
  "Misc",
] as const;

export type Category = (typeof CATEGORIES)[number];
