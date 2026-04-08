import { StorefrontNav } from "@/components/storefront/nav";
import { Footer } from "@/components/storefront/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
