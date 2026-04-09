import { getCourierConfig } from "@/lib/courier-config";

type CachedToken = {
  token: string;
  expiresAt: number;
  signature: string;
};
let cachedToken: CachedToken | null = null;

export function invalidatePathaoTokenCache() {
  cachedToken = null;
}

function buildSignature(parts: string[]): string {
  return parts.join("|");
}

async function getPathaoAccessToken(): Promise<string> {
  const config = await getCourierConfig();
  const baseUrl = config.courier_pathao_base_url;
  const clientId = config.courier_pathao_client_id;
  const clientSecret = config.courier_pathao_client_secret;
  const username = config.courier_pathao_username;
  const password = config.courier_pathao_password;

  if (!clientId || !clientSecret) {
    throw new Error("Pathao credentials are not configured");
  }

  const signature = buildSignature([
    baseUrl,
    clientId,
    clientSecret,
    username,
    password,
  ]);

  if (
    cachedToken &&
    cachedToken.signature === signature &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.token;
  }

  // Pathao supports two grants. Prefer password grant if username/password
  // are provided (Pathao Aladdin merchant flow), otherwise client_credentials.
  const body: Record<string, string> = {
    client_id: clientId,
    client_secret: clientSecret,
  };
  if (username && password) {
    body.grant_type = "password";
    body.username = username;
    body.password = password;
  } else {
    body.grant_type = "client_credentials";
  }

  const res = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.access_token) {
    const message = data?.message || "Failed to obtain Pathao access token";
    throw new Error(`Pathao: ${message}`);
  }

  const expiresIn = Number(data.expires_in) || 3600;
  cachedToken = {
    token: data.access_token as string,
    expiresAt: Date.now() + expiresIn * 1000,
    signature,
  };
  return cachedToken.token;
}

export type PathaoOrderInput = {
  merchantOrderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  amountToCollect: number;
  itemQuantity: number;
  itemDescription?: string;
  specialInstruction?: string;
  itemWeightKg?: number;
};

export type PathaoOrderResponse = {
  consignment_id: string;
  merchant_order_id: string;
  order_status: string;
  delivery_fee: number;
};

export async function createPathaoOrder(
  input: PathaoOrderInput
): Promise<PathaoOrderResponse> {
  const token = await getPathaoAccessToken();
  const config = await getCourierConfig();

  const baseUrl = config.courier_pathao_base_url;
  const storeId = config.courier_pathao_store_id;
  const cityId = Number(config.courier_pathao_city_id);
  const zoneId = Number(config.courier_pathao_zone_id);
  const areaId = config.courier_pathao_area_id
    ? Number(config.courier_pathao_area_id)
    : undefined;

  if (!storeId || !cityId || !zoneId) {
    throw new Error(
      "Pathao store/city/zone are not configured (set Pathao store ID, city ID, zone ID in admin settings)"
    );
  }

  const payload: Record<string, unknown> = {
    store_id: Number(storeId),
    merchant_order_id: input.merchantOrderId,
    recipient_name: input.recipientName,
    recipient_phone: input.recipientPhone,
    recipient_address: input.recipientAddress,
    recipient_city: cityId,
    recipient_zone: zoneId,
    delivery_type: 48, // 48 = Normal Delivery
    item_type: 2, // 2 = Parcel
    special_instruction: input.specialInstruction || "",
    item_quantity: input.itemQuantity,
    item_weight: input.itemWeightKg ?? 0.5,
    item_description: input.itemDescription || "",
    amount_to_collect: input.amountToCollect,
  };

  if (areaId) payload.recipient_area = areaId;

  const res = await fetch(`${baseUrl}/aladdin/api/v1/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.data) {
    const message =
      data?.message ||
      (data?.errors ? JSON.stringify(data.errors) : "Failed to create Pathao order");
    throw new Error(`Pathao: ${message}`);
  }

  return data.data as PathaoOrderResponse;
}

export async function getPathaoStatus(
  consignmentId: string
): Promise<string> {
  const token = await getPathaoAccessToken();
  const config = await getCourierConfig();
  const baseUrl = config.courier_pathao_base_url;

  const res = await fetch(
    `${baseUrl}/aladdin/api/v1/orders/${consignmentId}/info`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.data) {
    const message = data?.message || "Failed to fetch Pathao status";
    throw new Error(`Pathao: ${message}`);
  }

  const status =
    data.data.order_status ||
    data.data.order_status_slug ||
    data.data.status ||
    "unknown";
  return String(status);
}
