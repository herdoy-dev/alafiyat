import prisma from "@/lib/prisma";
import {
  COURIER_DEFAULTS,
  COURIER_KEYS,
  EMPTY_COURIER_CONFIG,
  type CourierConfig,
  type CourierKey,
} from "@/lib/settings";

export async function getCourierConfig(): Promise<CourierConfig> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...COURIER_KEYS] } },
  });

  const config: CourierConfig = { ...EMPTY_COURIER_CONFIG };
  for (const row of rows) {
    if ((COURIER_KEYS as readonly string[]).includes(row.key)) {
      config[row.key as CourierKey] = row.value;
    }
  }

  // Apply defaults for any empty value where a default exists
  for (const [key, fallback] of Object.entries(COURIER_DEFAULTS)) {
    const k = key as CourierKey;
    if (!config[k] && fallback) {
      config[k] = fallback;
    }
  }

  return config;
}
