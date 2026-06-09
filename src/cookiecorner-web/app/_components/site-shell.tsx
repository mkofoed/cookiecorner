import Image from "next/image";
import Link from "next/link";
import { BasketNavLink } from "./basket-nav-link";
import { CookieConsentBanner } from "./cookie-consent-banner";
import styles from "./site-shell.module.css";
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
            <Link className={styles.navLink} href="/insights">
              Insights
            </Link>
            <BasketNavLink />
          </nav>
        </div>
      </header>

      <main className={styles.content}>{children}</main>
      <CookieConsentBanner />
    </div>
  );
}
