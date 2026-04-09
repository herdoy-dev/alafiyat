import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 md:px-8 md:py-28">
      <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-6 font-display text-sm italic text-muted-foreground">
          We&apos;ve got it from here
        </p>
        <h1 className="mt-1 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Order <em className="font-display italic">placed</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base">
          Thank you for shopping with Al Amirat. We&apos;ve received your
          payment details and will confirm shortly. You&apos;ll be contacted
          on the phone number you provided.
        </p>
        <Button asChild className="mt-8 rounded-full" size="lg">
          <Link href="/products">
            Continue shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
