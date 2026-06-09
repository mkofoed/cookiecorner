import Link from "next/link";
import styles from "./site-shell.module.css";

const navigationItems = [
  { href: "/configurator", label: "Cookie Lab" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link className={styles.brandName} href="/configurator">
              CookieCorner
            </Link>
            <span className={styles.brandTagline}>
              Whisk, sprinkle, and launch your custom Hyggefis
            </span>
          </div>

          <nav className={styles.nav} aria-label="Primary">
            {navigationItems.map((item) => (
              <Link key={item.href} className={styles.navLink} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Cookie Lab customizer</span>
          <span>Baked with Next.js 16, ASP.NET 10, and a lot of frosting energy</span>
        </div>
      </footer>
    </div>
  );
}
