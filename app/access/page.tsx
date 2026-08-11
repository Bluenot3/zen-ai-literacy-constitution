import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./access.module.css";

export const metadata: Metadata = {
  title: "ZEN Access & Account Continuity",
  description:
    "The verified account continuity gateway for Arsenal, AI Pioneer, Vanguard, ZEN account recovery, and the expanded ZEN ecosystem.",
};

const ARSENAL_LOGIN =
  "https://arsenal.world/login?utm_source=zenai.world&utm_medium=owned&utm_campaign=zen_account_continuity";

const ACCESS_ROUTES = [
  {
    code: "A-01",
    eyebrow: "Existing platform users",
    title: "Arsenal",
    description:
      "Sign in to the ZEN agentic platform for agents, workflows, Business Spaces, Files, and operating tools.",
    action: "Sign in to Arsenal",
    href: ARSENAL_LOGIN,
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
    title: "Open the official login",
    copy: "Use the Arsenal login reached from this page. ZENAI.WORLD remains your verified starting point.",
  },
  {
    code: "02",
    title: "Use your familiar identity",
    copy: "Start with the same email and sign-in method you previously used with ZEN—email/password or Google.",
  },
  {
    code: "03",
    title: "Recover before recreating",
    copy: "If the login is not recognized, use Forgot password first. Avoid creating duplicate identities unnecessarily.",
  },
  {
    code: "04",
    title: "Request account linking",
    copy: "If recovery does not find the account, use the verified claim-support route so ZEN can review the legacy record.",
  },
] as const;

const CONTINUITY_MAP = [
  {
    legacy: "Members Area",
    destination: "Arsenal account, profile & dashboard",
    detail: "Identity, settings, platform access, and personal operating space.",
    href: ARSENAL_LOGIN,
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
      "Start with the same email and sign-in method you previously used with ZEN. If Arsenal recognizes it, continue normally. If it does not, use password recovery and then account-claim support instead of repeatedly creating accounts.",
  },
  {
    question: "Will my program access appear automatically?",
    answer:
      "Available program access appears when the verified Arsenal identity is linked to the corresponding enrollment record. If something is missing, account support can review the legacy record without asking for your password.",
  },
  {
    question: "Why is this an upgrade?",
    answer:
      "The former site presented content through separate Wix apps. The new system connects the public gateway to Arsenal's agents, files, community, programs, marketplace, credentials, workflows, and operating infrastructure.",
  },
] as const;

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
            <small>Account continuity gateway</small>
          </span>
        </Link>
        <nav aria-label="Access page navigation">
          <Link href="/">Gateway</Link>
          <a href="#claim">Account access</a>
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
              The ZEN platform did not disappear—it expanded. This page
              reconnects existing members to Arsenal, active programs, public
              knowledge, account recovery, and every major function from the
              former ZENAI.WORLD experience.
            </p>
            <div className={styles.heroActions}>
              <a href={ARSENAL_LOGIN} target="_blank" rel="noopener noreferrer">
                Sign in with my ZEN identity →
              </a>
              <a href="#continuity">See the continuity map</a>
            </div>
          </div>
          <aside className={styles.status} aria-label="ZEN continuity status">
            <span>Continuity status</span>
            <div><i aria-hidden="true" /><strong>zenai.world</strong><small>Official</small></div>
            <div><i aria-hidden="true" /><strong>Arsenal</strong><small>Connected</small></div>
            <div><i aria-hidden="true" /><strong>Account support</strong><small>Available</small></div>
          </aside>
        </header>

        <section id="claim" className={styles.claim} aria-labelledby="claim-title">
          <header>
            <span>Existing ZEN member</span>
            <h2 id="claim-title">Open or recover your account.</h2>
            <p>
              Your existing email is the continuity key. Follow this order so
              your history and future access can stay connected to one verified
              identity.
            </p>
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
          <div className={styles.claimActions}>
            <a href={ARSENAL_LOGIN} target="_blank" rel="noopener noreferrer">
              Open official Arsenal login <span aria-hidden="true">↗</span>
            </a>
            <a href="mailto:huxley@zenai.biz?subject=ZEN%20legacy%20account%20claim&amp;body=Please%20do%20not%20include%20a%20password%20or%20API%20key.%0A%0AName%3A%0AZEN%20account%20email%3A%0ASign-in%20method%20used%3A%0AProgram%20or%20access%20expected%3A%0AWhat%20happened%20when%20I%20tried%20to%20sign%20in%3A">
              Request account-claim review
            </a>
          </div>
          <p className={styles.claimNote}>
            If your Arsenal login already works, no claim request is needed.
            Never send ZEN your password, API key, payment card number, health
            information, or private customer records.
          </p>
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
            <span>Existing ZEN member</span>
            <h2 id="access-help-title">Account not recognized?</h2>
            <p>
              Contact ZEN from the email associated with your existing account
              and describe the program or platform access you expected. A
              support request is a review route—it is not a place for secrets.
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
            routes. ZENAI.WORLD will never ask you to place passwords, API
            credentials, payment card details, or private records into an
            account-support form.
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Account continuity gateway · Series MMXXVI</span>
        <div>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/accessibility-statement">Accessibility</Link>
        </div>
      </footer>
    </main>
  );
}
