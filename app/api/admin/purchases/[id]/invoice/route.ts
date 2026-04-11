import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { items: true, customer: true },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const shortId = purchase.id.slice(-8).toUpperCase();
    const date = purchase.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const itemRows = purchase.items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${i.productName}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">৳${i.price.toLocaleString()}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">৳${(i.price * i.quantity).toLocaleString()}</td>
          </tr>`
      )
      .join("");

    const subtotal = purchase.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${shortId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand { font-size: 24px; font-weight: 700; }
    .invoice-info { text-align: right; }
    .invoice-info h2 { font-size: 28px; color: #666; font-weight: 300; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .meta-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 8px; }
    .meta-box p { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; border-bottom: 2px solid #1a1a1a; }
    th:nth-child(2) { text-align: center; }
    th:nth-child(3), th:nth-child(4) { text-align: right; }
    .totals { margin-left: auto; width: 280px; }
    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals .total-row { border-top: 2px solid #1a1a1a; padding-top: 10px; margin-top: 6px; font-size: 20px; font-weight: 700; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:20px;text-align:right">
    <button onclick="window.print()" style="padding:8px 24px;background:#1a1a1a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">
      Print / Save PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="brand">Al Amirat</div>
      <p style="color:#666;font-size:13px;margin-top:4px">Curated quality goods</p>
    </div>
    <div class="invoice-info">
      <h2>INVOICE</h2>
      <p style="font-size:14px;color:#666;margin-top:4px">#${shortId}</p>
      <p style="font-size:13px;color:#999;margin-top:2px">${date}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <h3>Bill To</h3>
      <p>
        <strong>${purchase.shippingName}</strong><br>
        ${purchase.shippingPhone}<br>
        ${purchase.shippingAddress}<br>
        ${purchase.shippingCity}
        ${purchase.customerEmail ? `<br>${purchase.customerEmail}` : ""}
      </p>
    </div>
    <div class="meta-box" style="text-align:right">
      <h3>Payment</h3>
      <p>
        ${purchase.paymentMethod}<br>
        Status: <strong style="text-transform:capitalize">${purchase.status}</strong>
        ${purchase.courierProvider ? `<br>Courier: ${purchase.courierProvider}` : ""}
        ${purchase.courierTrackingCode ? `<br>Tracking: ${purchase.courierTrackingCode}` : ""}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="row">
      <span>Subtotal</span>
      <span>৳${subtotal.toLocaleString()}</span>
    </div>
    ${
      purchase.discountAmount > 0
        ? `<div class="row" style="color:#16a34a">
            <span>Discount${purchase.discountCode ? ` (${purchase.discountCode})` : ""}</span>
            <span>-৳${purchase.discountAmount.toLocaleString()}</span>
          </div>`
        : ""
    }
    <div class="row total-row">
      <span>Total</span>
      <span>৳${purchase.amount.toLocaleString()}</span>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for shopping with Al Amirat</p>
    <p style="margin-top:4px">For questions, contact us via WhatsApp or submit a complaint at our website.</p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
