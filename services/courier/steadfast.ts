import { getCourierConfig } from "@/lib/courier-config";

export type SteadfastOrderInput = {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
};

export type SteadfastConsignment = {
  consignment_id: number | string;
  invoice: string;
  tracking_code: string;
  status: string;
};

export async function createSteadfastOrder(
  input: SteadfastOrderInput
): Promise<SteadfastConsignment> {
  const config = await getCourierConfig();
  const baseUrl = config.courier_steadfast_base_url;
  const apiKey = config.courier_steadfast_api_key;
  const secret = config.courier_steadfast_api_secret;

  if (!apiKey || !secret) {
    throw new Error("Steadfast credentials are not configured");
  }

  const res = await fetch(`${baseUrl}/create_order`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Secret-Key": secret,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      invoice: input.invoice,
      recipient_name: input.recipientName,
      recipient_phone: input.recipientPhone,
      recipient_address: input.recipientAddress,
      cod_amount: input.codAmount,
      note: input.note || "",
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.consignment) {
    const message =
      data?.message ||
      (typeof data === "object" && data !== null
        ? JSON.stringify(data)
        : "Failed to create Steadfast order");
    throw new Error(`Steadfast: ${message}`);
  }

  return data.consignment as SteadfastConsignment;
}

export async function getSteadfastStatus(
  consignmentId: string
): Promise<string> {
  const config = await getCourierConfig();
  const baseUrl = config.courier_steadfast_base_url;
  const apiKey = config.courier_steadfast_api_key;
  const secret = config.courier_steadfast_api_secret;

  if (!apiKey || !secret) {
    throw new Error("Steadfast credentials are not configured");
  }

  const res = await fetch(`${baseUrl}/status_by_cid/${consignmentId}`, {
    method: "GET",
    headers: {
      "Api-Key": apiKey,
      "Secret-Key": secret,
      Accept: "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    const message = data?.message || "Failed to fetch Steadfast status";
    throw new Error(`Steadfast: ${message}`);
  }

  // Steadfast returns { status: 200, delivery_status: "in_review" }
  const status =
    data.delivery_status || data.status_text || data.status || "unknown";
  return String(status);
}
