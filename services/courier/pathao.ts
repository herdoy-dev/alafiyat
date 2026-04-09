const PATHAO_BASE_URL =
  process.env.PATHAO_BASE_URL || "https://api-hermes.pathao.com";

type CachedToken = { token: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

async function getPathaoAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.PATHAO_CLIENT_ID;
  const clientSecret = process.env.PATHAO_CLIENT_SECRET;
  const username = process.env.PATHAO_USERNAME;
  const password = process.env.PATHAO_PASSWORD;

  if (!clientId || !clientSecret) {
    throw new Error("Pathao credentials are not configured");
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

  const res = await fetch(`${PATHAO_BASE_URL}/aladdin/api/v1/issue-token`, {
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

  const storeId = process.env.PATHAO_STORE_ID;
  const cityId = Number(process.env.PATHAO_CITY_ID);
  const zoneId = Number(process.env.PATHAO_ZONE_ID);
  const areaId = process.env.PATHAO_AREA_ID
    ? Number(process.env.PATHAO_AREA_ID)
    : undefined;

  if (!storeId || !cityId || !zoneId) {
    throw new Error(
      "Pathao store/city/zone are not configured (set PATHAO_STORE_ID, PATHAO_CITY_ID, PATHAO_ZONE_ID)"
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

  const res = await fetch(`${PATHAO_BASE_URL}/aladdin/api/v1/orders`, {
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

  const res = await fetch(
    `${PATHAO_BASE_URL}/aladdin/api/v1/orders/${consignmentId}/info`,
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
