import { ProductCard, type StoreProduct } from "./product-card";

export function RelatedProducts({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <p className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
        You may also like
      </p>
      <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">
        Related <em className="font-display italic">products</em>
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
