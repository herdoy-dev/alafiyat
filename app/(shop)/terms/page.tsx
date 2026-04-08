export const metadata = {
  title: "Terms & Conditions — Al Amirat",
};

export default function TermsPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="rich-content mt-8">
        <p>
          Welcome to Al Amirat. By accessing or using our website you agree to
          be bound by these Terms &amp; Conditions. Please read them carefully
          before placing an order.
        </p>

        <h2>1. Orders and Acceptance</h2>
        <p>
          All orders placed through our site are an offer to buy at the prices
          and quantities shown. We reserve the right to accept or decline any
          order at our discretion, including for reasons of stock availability,
          incorrect pricing, or suspected fraud.
        </p>

        <h2>2. Pricing and Payment</h2>
        <p>
          All prices are listed in Bangladeshi Taka (৳) and are inclusive of
          applicable taxes unless otherwise stated. We accept payment via bKash,
          Nagad, Rocket, Upay, and cash on delivery. Online payments must be
          confirmed before an order is processed.
        </p>

        <h2>3. Shipping and Delivery</h2>
        <p>
          We deliver across Bangladesh. Estimated delivery times are provided as
          a guide and may vary due to courier conditions. Risk of loss passes to
          you upon delivery.
        </p>

        <h2>4. Returns and Refunds</h2>
        <p>
          You may request a return within 7 days of delivery if the product is
          unused, undamaged, and in its original packaging. Refunds are issued
          to the original payment method within 7 business days of receiving
          the returned item.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All content on this site, including images, product descriptions,
          logos, and the &quot;Al Amirat&quot; name, is owned by us or our
          licensors and is protected by copyright and trademark law.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Al Amirat is not liable for
          any indirect, incidental, or consequential damages arising from your
          use of the site or products purchased through it.
        </p>

        <h2>7. Contact</h2>
        <p>
          Questions about these terms? Contact us through any of the channels
          listed in the footer.
        </p>
      </div>
    </article>
  );
}
