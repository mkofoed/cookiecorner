import Link from "next/link";
import styles from "./site-shell.module.css";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/configurator", label: "Configurator" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link className={styles.brandName} href="/">
              CookieCorner
            </Link>
            <span className={styles.brandTagline}>
              Local storefront starter for the Hyggefis launch
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
          <span>CookieCorner MVP scaffold</span>
          <span>Next.js 16 + ASP.NET 10 + Docker Compose</span>
        </div>
      </footer>
    </div>
  );
}
