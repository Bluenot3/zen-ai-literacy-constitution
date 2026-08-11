import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./access.module.css";

export const metadata: Metadata = {
  title: "ZEN Access",
  description:
    "The verified gateway to Arsenal, AI Pioneer, Vanguard, ZEN account help, and the guided ZEN intake.",
};

const ACCESS_ROUTES = [
  {
    code: "A-01",
    eyebrow: "Existing platform users",
    title: "Arsenal",
    description:
      "Sign in to the ZEN agentic platform for agents, workflows, Business Spaces, Files, and operating tools.",
    action: "Sign in to Arsenal",
    href: "https://arsenal.world/login?utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_gateway_access",
    external: true,
  },
  {
    code: "P-02",
    eyebrow: "Learners, families & educators",
    title: "AI Pioneer",
    description:
      "Enter the public program route for ZEN's youth AI literacy pathway and course experience.",
    action: "Enter AI Pioneer",
    href: "https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/preview?source=zenai.world&utm_source=zenai.world&utm_medium=owned&utm_campaign=pioneer_launch",
    external: true,
  },
  {
    code: "V-03",
    eyebrow: "Web3 literacy",
    title: "Vanguard",
    description:
      "Continue to ZEN's Web3 literacy program for understanding emerging digital systems.",
    action: "Enter Vanguard",
    href: "https://us-ai-literacy.lovable.app/programs/vanguard?source=zenai.world&utm_source=zenai.world&utm_medium=owned",
    external: true,
  },
  {
    code: "Z-04",
    eyebrow: "New inquiries & partnerships",
    title: "Start with ZEN",
    description:
      "Use the guided intake to route a business, school, community, learner, or partnership with context.",
    action: "Open guided intake",
    href: "/start",
    external: false,
  },
] as const;

export default function AccessPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="issuance" />
      <TreasuryPageFrame chapter="ACCESS / 01" serial="ZEN-GATEWAY-MMXXVI" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Verified access gateway</small>
          </span>
        </Link>
        <nav aria-label="Access page navigation">
          <Link href="/">Gateway</Link>
          <Link href="/work">Public work</Link>
          <Link href="/start">Contact route</Link>
        </nav>
      </header>

      <article className={styles.page}>
        <header className={styles.hero}>
          <div>
            <span>One verified gateway · Every active route</span>
            <h1>
              Your ZEN access
              <strong>starts here.</strong>
            </h1>
            <p>
              ZENAI.WORLD now connects the platform, programs, public record,
              and support routes from one controlled entry point.
            </p>
          </div>
          <aside className={styles.status} aria-label="ZEN gateway status">
            <span>Gateway status</span>
            <div><i aria-hidden="true" /><strong>zenai.world</strong><small>Live</small></div>
            <div><i aria-hidden="true" /><strong>HTTPS</strong><small>Active</small></div>
            <div><i aria-hidden="true" /><strong>Program routes</strong><small>Connected</small></div>
          </aside>
        </header>

        <section className={styles.routeSection} aria-labelledby="access-route-title">
          <header>
            <span>Choose your destination</span>
            <h2 id="access-route-title">Go directly to the capability you need.</h2>
          </header>
          <div className={styles.routeGrid}>
            {ACCESS_ROUTES.map((route) => {
              const content = (
                <>
                  <div className={styles.routeHead}>
                    <span>{route.code}</span>
                    <small>{route.eyebrow}</small>
                  </div>
                  <h3>{route.title}</h3>
                  <p>{route.description}</p>
                  <strong>{route.action} <span aria-hidden="true">→</span></strong>
                </>
              );

              return route.external ? (
                <a
                  href={route.href}
                  key={route.code}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <Link href={route.href} key={route.code}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.help} aria-labelledby="access-help-title">
          <div>
            <span>Existing ZEN member</span>
            <h2 id="access-help-title">Account not recognized?</h2>
            <p>
              Do not send a password, API key, private customer record, or
              health information. Contact ZEN from the email associated with
              your existing account and describe which program or platform you
              are trying to access.
            </p>
          </div>
          <div className={styles.helpActions}>
            <a href="mailto:huxley@zenai.biz?subject=ZEN%20account%20access%20help">
              Get account help →
            </a>
            <Link href="/start">Use the guided route</Link>
          </div>
        </section>

        <section className={styles.trust} aria-label="Access safety notice">
          <strong>Official destinations only.</strong>
          <p>
            This page sends users only to ZEN-controlled platform and program
            routes. ZENAI.WORLD will never ask you to place passwords or API
            credentials into the guided intake.
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Unified access gateway · Series MMXXVI</span>
        <div>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/accessibility-statement">Accessibility</Link>
        </div>
      </footer>
    </main>
  );
}
