import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 md:px-8">
      <div className="rounded-lg border p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Order placed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your order. We&apos;ve received your payment details and
          will confirm shortly. You&apos;ll be contacted on the phone number you
          provided.
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
