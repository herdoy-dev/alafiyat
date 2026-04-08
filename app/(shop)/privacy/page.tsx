export const metadata = {
  title: "Privacy Policy — Al Amirat",
};

export default function PrivacyPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="rich-content mt-8">
        <p>
          Al Amirat respects your privacy. This policy explains what
          information we collect, how we use it, and the choices you have.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Order details</strong>: name, shipping address, phone
            number, optional email, and the items you purchase.
          </li>
          <li>
            <strong>Payment information</strong>: the mobile banking number you
            paid from and the transaction ID. We do not store full card or
            wallet credentials.
          </li>
          <li>
            <strong>Technical data</strong>: IP address, browser type, and
            general device information for security and analytics.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your orders.</li>
          <li>To contact you about order status or delivery.</li>
          <li>To prevent fraud and improve site security.</li>
          <li>To improve our products, catalog, and user experience.</li>
        </ul>

        <h2>3. Sharing</h2>
        <p>
          We share order details with our delivery partners only to the extent
          necessary to fulfil your order. We do not sell or rent your personal
          information to third parties.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain order records for as long as required for accounting and
          legal compliance. You may request deletion of your information by
          contacting us, subject to those obligations.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete the personal
          information we hold about you. To exercise any of these rights, get
          in touch through the channels listed in the footer.
        </p>

        <h2>6. Updates</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          communicated on this page.
        </p>
      </div>
    </article>
  );
}
