import { Resend } from "resend";
import prisma from "./prisma";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

async function getEmailSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ["email_from_address", "email_admin_notification"] } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    fromAddress: map.get("email_from_address") || "orders@alamirat.com",
    adminEmail: map.get("email_admin_notification") || "",
  };
}

type OrderEmailData = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address: string;
  amount: number;
  paymentMethod: string;
  items: { name: string; quantity: number; price: number }[];
};

export async function sendOrderConfirmation(data: OrderEmailData) {
  const resend = getResend();
  if (!resend || !data.customerEmail) return;

  const { fromAddress } = await getEmailSettings();
  const shortId = data.orderId.slice(-8).toUpperCase();

  const itemsList = data.items
    .map((i) => `${i.name} x${i.quantity} — ৳${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  try {
    await resend.emails.send({
      from: fromAddress,
      to: data.customerEmail,
      subject: `Order Confirmed #${shortId} — Al Amirat`,
      text: `Hi ${data.customerName},

Thank you for your order!

Order #${shortId}
${itemsList}

Total: ৳${data.amount.toLocaleString()}
Payment: ${data.paymentMethod}

Shipping to:
${data.customerName}
${data.address}, ${data.city}
${data.phone}

We'll confirm your order by phone before dispatching.

— Al Amirat`,
    });
  } catch {
    // Silent fail
  }
}

export async function sendAdminNewOrderNotification(data: OrderEmailData) {
  const resend = getResend();
  if (!resend) return;

  const { fromAddress, adminEmail } = await getEmailSettings();
  if (!adminEmail) return;

  const shortId = data.orderId.slice(-8).toUpperCase();

  try {
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: `New Order #${shortId} — ৳${data.amount.toLocaleString()}`,
      text: `New order received!

Order #${shortId}
Customer: ${data.customerName} (${data.phone})
City: ${data.city}
Amount: ৳${data.amount.toLocaleString()}
Payment: ${data.paymentMethod}

Items:
${data.items.map((i) => `- ${i.name} x${i.quantity}`).join("\n")}

View in dashboard: /admin/purchases/${data.orderId}`,
    });
  } catch {
    // Silent fail
  }
}

export async function sendShippingUpdate(opts: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  courierProvider: string;
  courierStatus: string;
  trackingCode?: string;
}) {
  const resend = getResend();
  if (!resend || !opts.customerEmail) return;

  const { fromAddress } = await getEmailSettings();
  const shortId = opts.orderId.slice(-8).toUpperCase();

  try {
    await resend.emails.send({
      from: fromAddress,
      to: opts.customerEmail,
      subject: `Shipping Update #${shortId} — ${opts.courierStatus}`,
      text: `Hi ${opts.customerName},

Your order #${shortId} has been updated.

Courier: ${opts.courierProvider}
Status: ${opts.courierStatus}
${opts.trackingCode ? `Tracking Code: ${opts.trackingCode}` : ""}

Track your order: /track

— Al Amirat`,
    });
  } catch {
    // Silent fail
  }
}
