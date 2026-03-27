import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/lib/types";

interface BookingPayload {
  full_name: string;
  mobile_number: string;
  facebook_name: string;
  email: string;
  message: string;
  items: CartItem[];
}

export const useSubmitBooking = () => {
  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      // Insert booking request
      const { data: booking, error: bookingErr } = await supabase
        .from("booking_requests")
        .insert({
          full_name: payload.full_name,
          mobile_number: payload.mobile_number,
          facebook_name: payload.facebook_name,
          email: payload.email,
          message: payload.message,
          booking_status: "pending",
        })
        .select()
        .single();

      if (bookingErr) throw bookingErr;

      // Insert booking items
      const itemRows = payload.items.map((item) => ({
        booking_request_id: booking.id,
        product_id: item.gear.id,
        quantity: item.quantity,
        daily_rate_php: item.gear.daily_rate_php,
      }));

      const { error: itemsErr } = await supabase
        .from("booking_request_items")
        .insert(itemRows);

      if (itemsErr) throw itemsErr;

      return booking;
    },
  });
};
