import Image from "next/image";
import Link from "next/link";
import { CookieConsentBanner } from "./cookie-consent-banner";
import styles from "./site-shell.module.css";

const navigationItems = [
  { href: "/checkout", label: "Basket", icon: "🧺" },
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
                height={56}
                priority
                src="/images/header/brand-icon.png"
                width={56}
              />
            </Link>
          </div>

          <nav className={styles.nav} aria-label="Primary">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                aria-label={item.label}
                className={styles.navLink}
                href={item.href}
                title={item.label}
              >
                <span aria-hidden="true" className={styles.navIcon}>
                  {item.icon}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.content}>{children}</main>
      <CookieConsentBanner />
    </div>
  );
}
