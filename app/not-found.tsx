import Image from "next/image";
import Link from "next/link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.shell}>
      <div className={styles.card}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={44} height={44} unoptimized />
          <span>ZEN AI Co.</span>
        </Link>
        <span className={styles.code}>ROUTE / 404</span>
        <h1>This path moved. ZEN did not.</h1>
        <p>
          The previous page is no longer at this address. Use the unified
          gateway to reach your account, program, public record, or support route.
        </p>
        <div className={styles.actions}>
          <Link href="/access">Find your ZEN route →</Link>
          <Link href="/">Return to zenai.world</Link>
        </div>
      </div>
    </main>
  );
}
