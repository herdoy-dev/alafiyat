export function isFailedCourierStatus(status: string | null) {
  if (!status) return false;
  const s = status.toLowerCase();
  return (
    s.includes("cancel") ||
    s.includes("return") ||
    s.includes("hold") ||
    s.includes("lost") ||
    s.includes("rejected")
  );
}

export function isDeliveredCourierStatus(status: string | null) {
  if (!status) return false;
  const s = status.toLowerCase();
  return s.includes("delivered") && !s.includes("pending");
}

export function formatCourierStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function courierStatusVariant(status: string) {
  if (isDeliveredCourierStatus(status)) return "success" as const;
  if (isFailedCourierStatus(status)) return "destructive" as const;
  return "secondary" as const;
}

export type RiskLevel = "low" | "medium" | "high" | "unknown";

export type CustomerRisk = {
  level: RiskLevel;
  label: string;
  description: string;
  shippedCount: number;
  deliveredCount: number;
  failedCount: number;
};

export function computeCustomerRisk(
  purchases: { courierProvider: string | null; courierStatus: string | null }[]
): CustomerRisk {
  const shipped = purchases.filter((p) => p.courierProvider !== null);
  const shippedCount = shipped.length;
  const deliveredCount = shipped.filter((p) =>
    isDeliveredCourierStatus(p.courierStatus)
  ).length;
  const failedCount = shipped.filter((p) =>
    isFailedCourierStatus(p.courierStatus)
  ).length;

  if (shippedCount < 1) {
    return {
      level: "unknown",
      label: "Unknown",
      description: "No courier history yet",
      shippedCount,
      deliveredCount,
      failedCount,
    };
  }

  const ratio = failedCount / shippedCount;
  let level: RiskLevel;
  let label: string;

  if (shippedCount >= 2 && ratio >= 0.5) {
    level = "high";
    label = "High risk";
  } else if (ratio >= 0.25) {
    level = "medium";
    label = "Medium risk";
  } else {
    level = "low";
    label = "Low risk";
  }

  return {
    level,
    label,
    description: `${failedCount}/${shippedCount} shipments failed`,
    shippedCount,
    deliveredCount,
    failedCount,
  };
}

export function riskVariant(level: RiskLevel) {
  if (level === "high") return "destructive" as const;
  if (level === "medium") return "secondary" as const;
  if (level === "low") return "success" as const;
  return "outline" as const;
}
