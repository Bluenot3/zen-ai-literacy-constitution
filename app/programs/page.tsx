import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PROGRAM_LOGIN_LINKS } from "../../lib/program-access-links";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./programs.module.css";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore ZEN AI Co. programs for learners, families, educators, trainers, and institutions before entering protected delivery in Arsenal.",
  alternates: { canonical: "/programs" },
};

const PROGRAMS = [
  {
    id: "pioneer",
    code: "ZEN-P-01",
    title: "AI Pioneer Program",
    audience: "Youth, families, educators, and community learning partners",
    overview:
      "ZEN's landmark youth AI literacy pathway moves from responsible foundations into practical building, project evidence, and public capability.",
    outcomes: [
      "Understand foundational AI concepts and responsible use",
      "Build practical projects with age-appropriate AI tools",
      "Create evidence that can support progress and completion",
    ],
    protectedHref: PROGRAM_LOGIN_LINKS.pioneer,
    action: "Continue securely in Arsenal",
  },
  {
    id: "vanguard",
    code: "ZEN-V-02",
    title: "ZEN Vanguard",
    audience: "Learners, creators, and emerging-technology communities",
    overview:
      "A Web3 literacy pathway for understanding digital ownership, decentralized systems, practical risks, and how new digital infrastructure is used.",
    outcomes: [
      "Build a grounded vocabulary for Web3 systems",
      "Evaluate practical uses, tradeoffs, and safety considerations",
      "Produce project evidence inside the protected Program workspace",
    ],
    protectedHref: PROGRAM_LOGIN_LINKS.vanguard,
    action: "Continue securely in Arsenal",
  },
  {
    id: "homeschool",
    code: "ZEN-H-03",
    title: "Homeschool AI Kit",
    audience: "Homeschool families, learning pods, and parent-led communities",
    overview:
      "A flexible AI literacy pathway designed to help families introduce useful concepts, guided practice, and project-based learning with human oversight.",
    outcomes: [
      "Choose a learning path suited to the learner and household",
      "Use practical activities to connect concepts with real work",
      "Prepare the right delivery and support format with ZEN",
    ],
    protectedHref: "/start?intent=programs&program=homeschool-ai-kit",
    action: "Discuss this program with ZEN",
  },
  {
    id: "train-the-trainer",
    code: "ZEN-T-04",
    title: "Train-the-Trainer",
    audience: "Educators, facilitators, organizational leaders, and program operators",
    overview:
      "A multiplier pathway for people preparing to facilitate AI literacy responsibly within schools, organizations, and communities.",
    outcomes: [
      "Translate AI literacy into an audience-appropriate delivery plan",
      "Practice facilitation, review, and evidence standards",
      "Prepare a scoped institutional or community rollout",
    ],
    protectedHref: "/start?intent=programs&program=train-the-trainer",
    action: "Discuss this program with ZEN",
  },
  {
    id: "institutional",
    code: "ZEN-I-05",
    title: "Institutional Programs",
    audience: "Schools, nonprofits, workforce initiatives, and public-interest partners",
    overview:
      "Cohort and institution-level pathways shaped around audience, outcomes, delivery context, safeguarding, and verifiable evidence.",
    outcomes: [
      "Define the cohort, delivery constraints, and success criteria",
      "Select an existing ZEN pathway or a scoped institutional format",
      "Connect public discovery to protected delivery and progress in Arsenal",
    ],
    protectedHref: "/start?intent=programs&program=institutional",
    action: "Plan an institutional program",
  },
] as const;

const FAQS = [
  {
    question: "Can I review Program information without an account?",
    answer:
      "Yes. This page is public. An Arsenal account is required only when you enter protected enrollment, curriculum, progress, artifacts, or credential workflows.",
  },
  {
    question: "Where does paid Program delivery happen?",
    answer:
      "Arsenal owns protected Program access and verifies the signed-in ZEN Account and current entitlement before private Program value is shown.",
  },
  {
    question: "Do public Program pages grant enrollment or credentials?",
    answer:
      "No. Public information explains the pathway. Enrollment, completion, and account-specific credentials remain protected Arsenal operations.",
  },
] as const;

export default function ProgramsPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="charter" />
      <TreasuryPageFrame chapter="PROGRAMS / PUBLIC DISCOVERY" serial="ZEN-PROGRAMS-2026" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <strong>ZEN AI Co.</strong>
        </Link>
        <nav aria-label="Program navigation">
          <Link href="/work">Public work</Link>
          <Link href="/start">Start with ZEN</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="programs-title">
        <p>PUBLIC PROGRAM REGISTER / LEARN BEFORE YOU ENTER</p>
        <h1 id="programs-title">Programs that turn knowledge into agency.</h1>
        <div>
          <p>
            Explore the audience, purpose, and intended outcomes of each ZEN
            pathway without signing in. Protected enrollment, curriculum,
            progress, artifacts, and credentials continue in Arsenal.
          </p>
          <span>PUBLIC DISCOVERY → PROTECTED EXECUTION</span>
        </div>
      </section>

      <section className={styles.grid} aria-label="ZEN Programs">
        {PROGRAMS.map((program, index) => (
          <article className={styles.card} id={program.id} key={program.id}>
            <header>
              <span>{program.code}</span>
              <i>{String(index + 1).padStart(2, "0")}</i>
            </header>
            <p className={styles.audience}>{program.audience}</p>
            <h2>{program.title}</h2>
            <p>{program.overview}</p>
            <h3>Intended outcomes</h3>
            <ul>
              {program.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
            <a href={program.protectedHref}>
              {program.action} <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </section>

      <section className={styles.boundary} aria-labelledby="program-boundary-title">
        <div>
          <p>THE ACCESS BOUNDARY</p>
          <h2 id="program-boundary-title">Public understanding. Protected delivery.</h2>
        </div>
        <dl>
          <div>
            <dt>Public on ZEN</dt>
            <dd>Program purpose, audience, intended outcomes, public proof, and eligibility context.</dd>
          </div>
          <div>
            <dt>Protected in Arsenal</dt>
            <dd>Enrollment, purchased curriculum, progress, private artifacts, completion state, and credentials.</dd>
          </div>
        </dl>
      </section>

      <section className={styles.faq} aria-labelledby="program-faq-title">
        <p>PROGRAM FAQ</p>
        <h2 id="program-faq-title">Know the boundary before continuing.</h2>
        {FAQS.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
