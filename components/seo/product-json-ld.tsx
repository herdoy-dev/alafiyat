export function ProductJsonLd({
  product,
  domain,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    thumbnail: string;
    slug: string;
  };
  domain?: string;
}) {
  const base = domain || "https://example.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.replace(/<[^>]*>/g, "").slice(0, 500),
    image: product.thumbnail,
    sku: product.id.slice(-8),
    url: `${base}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BDT",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${base}/products/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
