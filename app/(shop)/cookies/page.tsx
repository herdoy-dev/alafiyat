export const metadata = {
  title: "Cookie Policy — Al Amirat",
};

export default function CookiesPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="rich-content mt-8">
        <p>
          This Cookie Policy explains how Al Amirat uses cookies and similar
          technologies on our website.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help the site remember your actions and preferences
          (such as items in your cart) so you don&apos;t have to re-enter them
          on every page.
        </p>

        <h2>2. How We Use Cookies</h2>
        <ul>
          <li>
            <strong>Essential</strong>: to remember your shopping cart contents
            and keep your session active.
          </li>
          <li>
            <strong>Preferences</strong>: to remember your theme (light or
            dark) and other UI choices.
          </li>
          <li>
            <strong>Analytics</strong>: to understand how visitors use the site
            and improve it over time.
          </li>
        </ul>

        <h2>3. Local Storage</h2>
        <p>
          Some features (like your cart) use your browser&apos;s local storage
          rather than cookies. Local storage works the same way for you and is
          covered by this policy.
        </p>

        <h2>4. Managing Cookies</h2>
        <p>
          You can clear or block cookies and local storage through your
          browser&apos;s settings. Note that blocking essential cookies may
          break parts of the site, such as the shopping cart.
        </p>

        <h2>5. Third-Party Cookies</h2>
        <p>
          We do not currently use third-party tracking cookies. Embedded
          content from social platforms (linked from our footer) may set their
          own cookies when you click through to them.
        </p>

        <h2>6. Updates</h2>
        <p>
          We may update this Cookie Policy as our practices evolve. The
          &quot;Last updated&quot; date above reflects the most recent
          revision.
        </p>
      </div>
    </article>
  );
}
