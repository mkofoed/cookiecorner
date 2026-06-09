import Image from "next/image";
import Link from "next/link";
import { CookieConsentBanner } from "./cookie-consent-banner";
import styles from "./site-shell.module.css";

const navigationItems = [
  { href: "/checkout", label: "Checkout" },
];

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link aria-label="Go to Cookie Lab" className={styles.brandIconLink} href="/configurator">
              <Image
                alt=""
                className={styles.brandIcon}
                height={80}
                priority
                src="/images/header/brand-icon.png"
                width={80}
              />
            </Link>
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
      <CookieConsentBanner />

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Cookie Lab customizer</span>
          <span>Baked with Next.js 16, ASP.NET 10, and a lot of frosting energy</span>
        </div>
      </footer>
    </div>
  );
}
