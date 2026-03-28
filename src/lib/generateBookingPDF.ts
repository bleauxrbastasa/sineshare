import jsPDF from "jspdf";
import { format, differenceInDays } from "date-fns";
import { CartItem } from "@/lib/types";

interface BookingPDFData {
  bookingId: string;
  name: string;
  mobile: string;
  email: string;
  facebookName?: string;
  notes?: string;
  items: CartItem[];
  submittedAt: Date;
}

export const generateBookingPDF = async (data: BookingPDFData): Promise<jsPDF> => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Try loading logo
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = "/images/sin_logo_rectangle.png";
    });
    const logoH = 14;
    const logoW = (img.width / img.height) * logoH;
    doc.addImage(img, "PNG", margin, y, Math.min(logoW, 60), logoH);
    y += logoH + 6;
  } catch {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SINESHARE", margin, y + 10);
    y += 16;
  }

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Booking Request Summary", margin, y);
  y += 8;

  // Thin line
  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Info section
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const info = [
    ["Booking ID", data.bookingId],
    ["Date Submitted", format(data.submittedAt, "MMMM d, yyyy 'at' h:mm a")],
    ["Full Name", data.name],
    ["Mobile", data.mobile],
    ["Email", data.email],
  ];
  if (data.facebookName) info.push(["Facebook", data.facebookName]);

  for (const [label, value] of info) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 35, y);
    y += 5.5;
  }
  y += 4;

  // Items table header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentW, 7, "F");
  doc.setTextColor(255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Item", margin + 2, y + 5);
  doc.text("Qty", margin + 80, y + 5);
  doc.text("Pickup", margin + 95, y + 5);
  doc.text("Return", margin + 120, y + 5);
  doc.text("Rate/Day", margin + 145, y + 5);
  y += 7;

  // Item rows
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  let grandTotal = 0;

  for (const item of data.items) {
    const days = differenceInDays(item.return_date, item.pickup_date) || 1;
    const subtotal = (item.gear.daily_rate_php || 0) * item.quantity * days;
    grandTotal += subtotal;

    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    const bgColor = data.items.indexOf(item) % 2 === 0 ? 245 : 255;
    doc.setFillColor(bgColor, bgColor, bgColor);
    doc.rect(margin, y, contentW, 6, "F");

    doc.setFontSize(8);
    doc.text(item.gear.item_name.substring(0, 40), margin + 2, y + 4.5);
    doc.text(String(item.quantity), margin + 80, y + 4.5);
    doc.text(format(item.pickup_date, "MMM d"), margin + 95, y + 4.5);
    doc.text(format(item.return_date, "MMM d"), margin + 120, y + 4.5);
    doc.text(item.gear.daily_rate_php ? `₱${item.gear.daily_rate_php.toLocaleString()}` : "—", margin + 145, y + 4.5);
    y += 6;
  }

  // Total
  y += 3;
  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Estimated Total: ₱${grandTotal.toLocaleString()}`, margin, y);
  y += 8;

  // Notes
  if (data.notes) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Special Requests / Notes:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(data.notes, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 4;
  }

  // Footer
  y = Math.max(y + 10, 260);
  if (y > 275) {
    doc.addPage();
    y = 250;
  }
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120);
  doc.text(
    "This is a booking request summary and is subject to approval. Sineshare will contact you within 1–24 hours to confirm availability and finalize your rental.",
    margin,
    y,
    { maxWidth: contentW }
  );

  return doc;
};

export const getBookingPDFBase64 = async (data: BookingPDFData): Promise<string> => {
  const doc = await generateBookingPDF(data);
  // Returns base64 string without data URI prefix
  return doc.output("datauristring").split(",")[1];
};
