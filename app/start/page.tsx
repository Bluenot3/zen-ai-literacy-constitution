import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buildArsenalLoginUrl } from "../../lib/program-access-links";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./start.module.css";

export const metadata: Metadata = {
  title: "Start with ZEN",
  description:
    "Activate or sign in to Arsenal, ZEN AI Co.'s protected operating platform.",
  alternates: { canonical: "/start" },
};

const ARSENAL_START_URL = buildArsenalLoginUrl(
  "/dashboard",
  "owned",
  "zen_start",
);

const ACTIVATION_PATH = [
  ["01", "ZEN AI Co.", "Public gateway · discovery and proof"],
  ["02", "Arsenal", "Account · identity · operating environment"],
  ["03", "Continue", "Build · automate · learn · operate"],
] as const;

export default function StartPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="issuance" />
      <TreasuryPageFrame chapter="GATEWAY / 01" serial="ZEN-ARSENAL-HANDOFF" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={42} height={42} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Public gateway</small>
          </span>
        </Link>
        <nav aria-label="Start page navigation">
          <Link href="/work">Public work</Link>
          <Link href="/">Return to ZEN</Link>
        </nav>
      </header>

      <section className={styles.transition} aria-labelledby="start-title">
        <div className={styles.introduction}>
          <span className={styles.register}>ZEN AI Co. / Arsenal activation</span>
          <h1 id="start-title">
            Intelligence
            <strong>becomes capability.</strong>
          </h1>
          <p>
            Arsenal is ZEN&apos;s operating platform—the place where your account,
            Agents, projects, automations, programs, and operating tools live.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href={ARSENAL_START_URL}
              data-zen-destination="arsenal-login"
              data-zen-next="/dashboard"
              data-zen-campaign="zen_start"
            >
              Activate / Sign in with Arsenal <span aria-hidden="true">→</span>
            </a>
            <Link className={styles.secondaryAction} href="/">
              Return to ZEN
            </Link>
          </div>
          <small className={styles.identityLine}>
            One ZEN identity. Arsenal powers the operating environment.
          </small>
        </div>

        <div className={styles.instrument} aria-label="ZEN to Arsenal activation path">
          <div className={styles.instrumentField} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.core} aria-hidden="true">
            <span>ZEN</span>
            <Image src="/zen-mark.png" alt="" width={168} height={168} unoptimized />
            <small>ARSENAL</small>
          </div>
          <ol className={styles.activationPath}>
            {ACTIVATION_PATH.map(([code, title, detail]) => (
              <li key={code}>
                <span>{code}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Public gateway → protected operation</span>
        <Link href="/privacy-policy">Privacy</Link>
      </footer>
    </main>
  );
}
