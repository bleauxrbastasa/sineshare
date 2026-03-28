import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailPayload {
  bookingId: string;
  customerName: string;
  mobile: string;
  email: string;
  facebookName?: string;
  notes?: string;
  submittedAt: string;
  items: {
    name: string;
    quantity: number;
    pickupDate: string;
    returnDate: string;
    dailyRate: number | null;
    days: number;
    subtotal: number;
  }[];
  estimatedTotal: number;
  pdfBase64?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const payload: BookingEmailPayload = await req.json();

    // Build HTML email body
    const itemRows = payload.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.pickupDate}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.returnDate}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.days}d</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.dailyRate ? `₱${item.dailyRate.toLocaleString()}` : "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₱${item.subtotal.toLocaleString()}</td>
        </tr>`
      )
      .join("");

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1e293b;">
      <h2 style="color:#3b82f6;">New Booking Request — Sineshare</h2>
      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:4px 0;font-weight:bold;width:140px;">Booking ID</td><td>${payload.bookingId}</td></tr>
        <tr><td style="padding:4px 0;font-weight:bold;">Date Submitted</td><td>${payload.submittedAt}</td></tr>
        <tr><td style="padding:4px 0;font-weight:bold;">Customer</td><td>${payload.customerName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:bold;">Mobile</td><td>${payload.mobile}</td></tr>
        <tr><td style="padding:4px 0;font-weight:bold;">Email</td><td>${payload.email}</td></tr>
        ${payload.facebookName ? `<tr><td style="padding:4px 0;font-weight:bold;">Facebook</td><td>${payload.facebookName}</td></tr>` : ""}
      </table>

      <h3 style="color:#1e293b;border-bottom:2px solid #3b82f6;padding-bottom:6px;">Selected Equipment</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <thead>
          <tr style="background:#1e293b;color:#fff;">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:left;">Pickup</th>
            <th style="padding:8px;text-align:left;">Return</th>
            <th style="padding:8px;">Days</th>
            <th style="padding:8px;text-align:right;">Rate/Day</th>
            <th style="padding:8px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <p style="font-size:16px;font-weight:bold;">Estimated Total: ₱${payload.estimatedTotal.toLocaleString()}</p>

      ${payload.notes ? `<p style="margin-top:12px;"><strong>Notes:</strong> ${payload.notes}</p>` : ""}

      <hr style="margin-top:24px;border:none;border-top:1px solid #ddd;" />
      <p style="font-size:11px;color:#999;">This is an automated booking request summary. Please review and respond to the customer within 24 hours.</p>
    </div>`;

    // Build email request
    const emailBody: Record<string, unknown> = {
      from: "Sineshare <bookings@sineshare.brandspel.co>",
      to: ["bleauxrbastasa@gmail.com"],
      subject: `New Booking Request — ${payload.customerName} (${payload.bookingId})`,
      html,
    };

    // Attach PDF if provided
    if (payload.pdfBase64) {
      emailBody.attachments = [
        {
          filename: `sineshare-booking-${payload.bookingId}.pdf`,
          content: payload.pdfBase64,
        },
      ];
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      throw new Error(resendData.message || JSON.stringify(resendData));
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
