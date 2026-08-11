import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./access.module.css";

export const metadata: Metadata = {
  title: "Activate Arsenal Access",
  description:
    "Activate or link your Arsenal identity from the official ZENAI.WORLD gateway.",
};

const ARSENAL_LOGIN =
  "https://arsenal.world/login?utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_account_activation";

const ARSENAL_GOOGLE_ACTIVATION =
  "https://kcyklettzoyexxynqfer.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Farsenal.world%2Fdashboard";

const ACCESS_ROUTES = [
  {
    code: "A-01",
    eyebrow: "Existing platform users",
    title: "Arsenal",
    description:
      "Activate your identity and enter ZEN's agentic platform for agents, workflows, Business Spaces, Files, and operating tools.",
    action: "Activate with Google",
    href: ARSENAL_GOOGLE_ACTIVATION,
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

const CLAIM_STEPS = [
  {
    code: "01",
    title: "Choose Google",
    copy: "Tap Activate with Google to begin the same secure Google flow used inside Arsenal.",
  },
  {
    code: "02",
    title: "Confirm your identity",
    copy: "Use the Google account connected to your ZEN activity whenever possible.",
  },
  {
    code: "03",
    title: "Enter Arsenal",
    copy: "Arsenal signs you in or creates your verified identity, then opens your dashboard.",
  },
] as const;

const CONTINUITY_MAP = [
  {
    legacy: "Members Area",
    destination: "Arsenal account, profile & dashboard",
    detail: "Identity, settings, platform access, and personal operating space.",
    href: ARSENAL_GOOGLE_ACTIVATION,
    external: true,
  },
  {
    legacy: "Online Programs",
    destination: "AI Pioneer, Vanguard & Arsenal Programs",
    detail: "Program entry, progress, artifacts, and credentials as records are linked.",
    href: "#destinations",
    external: false,
  },
  {
    legacy: "Groups",
    destination: "Arsenal Community",
    detail: "Community conversations, discovery, and collaboration inside the operating platform.",
    href: "https://arsenal.world/login?next=%2Fcommunity&utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_continuity_map",
    external: true,
  },
  {
    legacy: "Blog",
    destination: "Public Work & Knowledge",
    detail: "ZEN announcements, frameworks, accomplishments, initiatives, and source-backed public material.",
    href: "/work",
    external: false,
  },
  {
    legacy: "File Share",
    destination: "Arsenal Workspace, Files & Vault",
    detail: "Cloud-backed files, knowledge, project materials, outputs, and versioned work.",
    href: "https://arsenal.world/login?next=%2Fworkspace&utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_continuity_map",
    external: true,
  },
  {
    legacy: "Store, Gifts & Plans",
    destination: "Arsenal Marketplace & Plans",
    detail: "Products, agents, capabilities, plans, credits, and future marketplace releases.",
    href: "https://arsenal.world/login?next=%2Fmarketplace&utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_continuity_map",
    external: true,
  },
  {
    legacy: "Events & Announcements",
    destination: "ZEN Initiatives & Public Record",
    detail: "Active initiatives, public milestones, program news, and recognized work.",
    href: "/work?category=initiatives",
    external: false,
  },
  {
    legacy: "Forms & Contact",
    destination: "Guided ZEN Intake",
    detail: "A structured route for learners, families, educators, businesses, and partners.",
    href: "/start",
    external: false,
  },
  {
    legacy: "Donations, Invoices & Pay Links",
    destination: "Verified ZEN Support Route",
    detail: "Partnership, billing, and organization-specific requests are routed with context and human review.",
    href: "/start",
    external: false,
  },
] as const;

const FAQS = [
  {
    question: "Is this still ZENAI.WORLD?",
    answer:
      "Yes. The domain, company, mission, programs, public record, and ZEN identity continue here. The major change is that Arsenal now powers the signed-in platform experience.",
  },
  {
    question: "Do I need to create another account?",
    answer:
      "Google is the fastest route. Use the Google account connected to your ZEN activity. If you prefer email, continue through Arsenal with the email you already use.",
  },
  {
    question: "Will my program access appear automatically?",
    answer:
      "Available program access appears when your verified Arsenal identity is linked to the corresponding enrollment record. If something is missing, ZEN can review the legacy record without asking for your password.",
  },
  {
    question: "Why is this an upgrade?",
    answer:
      "The former site presented content through separate Wix apps. The new system connects the public gateway to Arsenal's agents, files, community, programs, marketplace, credentials, workflows, and operating infrastructure.",
  },
] as const;

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.97h3.86c2.26-2.09 3.58-5.17 3.58-8.79z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.07.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.32A7.09 7.09 0 0 1 4.89 12c0-.83.14-1.6.38-2.32V6.59H1.29A12 12 0 0 0 0 12c0 1.95.47 3.79 1.29 5.41l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

export default function AccessPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="issuance" />
      <TreasuryPageFrame chapter="ACCESS / 02" serial="ZEN-CONTINUITY-MMXXVI" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Arsenal activation gateway</small>
          </span>
        </Link>
        <nav aria-label="Access page navigation">
          <Link href="/">Gateway</Link>
          <a href="#activate">Activate</a>
          <a href="#continuity">What moved</a>
        </nav>
      </header>

      <article className={styles.page}>
        <header className={styles.hero}>
          <div>
            <span>ZENAI.WORLD continuity record · Upgrade active</span>
            <h1>
              Same ZEN.
              <strong>Now powered by Arsenal.</strong>
            </h1>
            <p>
              ZENAI.WORLD is still your official gateway. Arsenal now powers
              your signed-in experience, bringing your tools, programs, and
              workspace into one expanded platform.
            </p>
            <div className={styles.heroActions}>
              <a href={ARSENAL_GOOGLE_ACTIVATION}>
                <GoogleMark />
                Activate with Google
              </a>
              <a href={ARSENAL_LOGIN}>Use email instead</a>
            </div>
          </div>
          <aside className={styles.status} aria-label="ZEN continuity status">
            <span>Continuity status</span>
            <div><i aria-hidden="true" /><strong>zenai.world</strong><small>Official</small></div>
            <div><i aria-hidden="true" /><strong>Arsenal</strong><small>Connected</small></div>
            <div><i aria-hidden="true" /><strong>Google activation</strong><small>Ready</small></div>
          </aside>
        </header>

        <section id="activate" className={styles.claim} aria-labelledby="claim-title">
          <div className={styles.activationPanel}>
            <header>
              <span>Fastest path into Arsenal</span>
              <h2 id="claim-title">Activate your Arsenal access.</h2>
              <p>
                One secure click starts the same Google activation used by
                Arsenal and takes you directly to your dashboard.
              </p>
              <div className={styles.claimActions}>
                <a href={ARSENAL_GOOGLE_ACTIVATION}>
                  <GoogleMark />
                  Activate with Google
                </a>
                <a href={ARSENAL_LOGIN}>Continue with email</a>
              </div>
              <small>
                Already active? The same button signs you into your existing
                Arsenal identity.
              </small>
            </header>
            <div className={styles.claimGrid}>
              {CLAIM_STEPS.map((step) => (
                <article key={step.code}>
                  <span>{step.code}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="continuity" className={styles.continuityMap} aria-labelledby="continuity-title">
          <header>
            <span>Former experience → Expanded destination</span>
            <h2 id="continuity-title">Everything has a new home.</h2>
            <p>
              The former Wix experience separated these capabilities across
              individual apps. The new architecture consolidates them into the
              public ZEN gateway and the signed-in Arsenal platform.
            </p>
          </header>
          <div className={styles.continuityGrid}>
            {CONTINUITY_MAP.map((item, index) => {
              const content = (
                <>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{item.legacy}</small>
                    <h3>{item.destination}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <strong aria-hidden="true">→</strong>
                </>
              );

              return item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" key={item.legacy}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} key={item.legacy}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section id="destinations" className={styles.routeSection} aria-labelledby="access-route-title">
          <header>
            <span>Active ecosystem routes</span>
            <h2 id="access-route-title">Continue to the capability you need.</h2>
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
                <a href={route.href} key={route.code} target="_blank" rel="noopener noreferrer">
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

        <section className={styles.faq} aria-labelledby="faq-title">
          <header>
            <span>Transition questions</span>
            <h2 id="faq-title">What existing users need to know.</h2>
          </header>
          <div>
            {FAQS.map((item, index) => (
              <article key={item.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.help} aria-labelledby="access-help-title">
          <div>
            <span>Account linking support</span>
            <h2 id="access-help-title">Missing existing access?</h2>
            <p>
              Sign in first. If a program, workspace, or other existing access
              is missing, contact ZEN from the email tied to that activity and
              tell us what should be linked.
            </p>
          </div>
          <div className={styles.helpActions}>
            <a href="mailto:huxley@zenai.biz?subject=Link%20my%20ZEN%20access&amp;body=Please%20do%20not%20include%20a%20password%20or%20API%20key.%0A%0AName%3A%0AArsenal%20email%3A%0AProgram%20or%20access%20to%20link%3A%0A">
              Request access linking →
            </a>
            <Link href="/start">Use the guided route</Link>
          </div>
        </section>

        <section className={styles.trust} aria-label="Access safety notice">
          <strong>Official destinations only.</strong>
          <p>
            This page sends users only to ZEN-controlled platform and program
            routes. ZENAI.WORLD will never ask you to place passwords, API
            credentials, payment card details, or private records into an
            account-support form.
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Arsenal activation gateway · Series MMXXVI</span>
        <div>
          <a href="https://www.linkedin.com/company/z3nai/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/ZEN_AGI" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.youtube.com/@ZENAIML" target="_blank" rel="noopener noreferrer">YouTube</a>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/accessibility-statement">Accessibility</Link>
        </div>
      </footer>
    </main>
  );
}
