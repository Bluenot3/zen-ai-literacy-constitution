"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GatewayExpansion from "./gateway-expansion";
import NationalFirstMonument from "./national-first-monument";
import {
  managedZenHref,
  managedZenNavigationFor,
  type ManagedZenNavigationItem,
} from "./managed-pages";

const LINKS = {
  arsenal: "https://arsenal.world",
  businessSpace:
    "https://arsenal.world/login?next=%2Fbusiness-spaces%2Fnew&utm_source=zenai.world&utm_medium=owned&utm_campaign=business_space_intake",
  pioneer:
    "https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/preview?source=zenai.world&utm_source=zenai.world&utm_medium=owned&utm_campaign=pioneer_launch",
  vanguard:
    "https://us-ai-literacy.lovable.app/programs/vanguard?source=zenai.world&utm_source=zenai.world&utm_medium=owned",
  work: "/work",
  accomplishments: "/work?category=accomplishments",
  initiatives: "/work?category=initiatives",
  partners: "/work?category=partners",
  knowledge: "/work?category=knowledge",
  start: "/start",
  constitution: "/ai-literacy-constitution",
  github: "https://github.com/Bluenot3",
  linkedin: "https://www.linkedin.com/company/z3nai/",
  x: "https://x.com/ZEN_AGI",
  youtube: "https://www.youtube.com/@ZENAIML",
  contact:
    "mailto:huxley@zenai.biz?subject=ZEN%20AI%20Co.%20partnership%20inquiry",
} as const;

const ROUTES = [
  {
    index: "01",
    verb: "Learn",
    title: "AI Pioneer",
    detail: "Ages 11–18 learn AI by making useful apps, agents, and portfolio projects.",
    href: LINKS.pioneer,
    signal: "Youth capability",
    tone: "aqua",
  },
  {
    index: "02",
    verb: "Advance",
    title: "Vanguard",
    detail:
      "A deeper pathway for learners ready to take on advanced AI systems.",
    href: LINKS.vanguard,
    signal: "Advanced pathway",
    tone: "emerald",
  },
  {
    index: "03",
    verb: "Build",
    title: "Arsenal",
    detail:
      "Create with agents, automations, files, programs, and operating tools.",
    href: LINKS.arsenal,
    signal: "Execution layer",
    tone: "violet",
  },
  {
    index: "04",
    verb: "Begin",
    title: "Start with ZEN",
    detail:
      "Tell us what you are building so we can route your business, school, community, or partnership with context.",
    href: LINKS.start,
    signal: "Guided intake",
    tone: "gold",
  },
] as const;

const SIGNALS = [
  {
    value: "4",
    label: "learning modules",
    detail: "A focused path from AI basics to a portfolio-ready build.",
  },
  {
    value: "8",
    label: "guided sections",
    detail: "Short lessons, clear vocabulary, hands-on practice, and checkpoints.",
  },
  {
    value: "11–18",
    label: "builder age range",
    detail: "Young people learning through deployment.",
  },
  {
    value: "Hands-on",
    label: "learning format",
    detail: "Learners practice inside interactive tools and save proof of their work.",
  },
] as const;

const FIELDWORK = [
  {
    number: "A–01",
    place: "Module 1",
    kind: "Prompt design",
    title: "Text Genie",
    detail:
      "Learn how clear instructions shape an AI response, then test and improve your own prompt.",
    tone: "cyan",
  },
] as const;

const ECOSYSTEM = [
  {
    code: "P–01",
    name: "AI Pioneer",
    detail: "Youth build and deployment",
    href: LINKS.pioneer,
    tone: "cyan",
  },
  {
    code: "V–02",
    name: "Vanguard",
    detail: "Advanced capability pathways",
    href: LINKS.vanguard,
    tone: "green",
  },
  {
    code: "A–03",
    name: "Arsenal",
    detail: "Agentic creation infrastructure",
    href: LINKS.arsenal,
    tone: "violet",
  },
  {
    code: "W–04",
    name: "Public Work",
    detail: "Accomplishments and proof",
    href: LINKS.accomplishments,
    tone: "orange",
  },
  {
    code: "I–05",
    name: "Initiatives",
    detail: "Programs and partnerships",
    href: LINKS.initiatives,
    tone: "gold",
  },
] as const;

const LEDGER = [
  {
    heading: "Learn",
    copy: "Project-first AI pathways",
    links: [
      ["AI Pioneer", LINKS.pioneer],
      ["Vanguard", LINKS.vanguard],
    ],
  },
  {
    heading: "Build",
    copy: "From prompt to working system",
    links: [
      ["Arsenal", LINKS.arsenal],
      ["ZEN GitHub", LINKS.github],
    ],
  },
  {
    heading: "Prove",
    copy: "Evidence that travels",
    links: [
      ["Accomplishments", LINKS.accomplishments],
      ["Public work", LINKS.work],
      ["Knowledge", LINKS.knowledge],
    ],
  },
  {
    heading: "Connect",
    copy: "Arrive with context",
    links: [
      ["Start with ZEN", LINKS.start],
      ["AI Literacy Constitution", LINKS.constitution],
      ["Partner with ZEN", LINKS.contact],
      ["Partnerships", LINKS.partners],
      ["LinkedIn", LINKS.linkedin],
      ["YouTube", LINKS.youtube],
      ["X / Twitter", LINKS.x],
    ],
  },
] as const;

function externalLinkProps(href: string) {
  return href.startsWith("https://")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

function GuillocheField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0.74;
    let pointerY = 0.36;
    let targetX = pointerX;
    let targetY = pointerY;
    let lastDraw = 0;
    let pageVisible = !document.hidden;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.65);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const trackPointer = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
    };

    const rosette = (
      centerX: number,
      centerY: number,
      radius: number,
      phase: number,
      warm = false,
    ) => {
      const rings = width < 700 ? 24 : 44;

      for (let ring = 0; ring < rings; ring += 1) {
        const normalized = ring / rings;
        const points = width < 700 ? 180 : 260;
        context.beginPath();

        for (let point = 0; point <= points; point += 1) {
          const theta = (point / points) * Math.PI * 2;
          const frequency = 11 + (ring % 7);
          const lace =
            Math.sin(theta * frequency + phase + ring * 0.21) *
            radius *
            (0.03 + normalized * 0.016);
          const interference =
            Math.cos(theta * 5 - phase * 0.66 + ring * 0.37) *
            radius *
            0.012;
          const currentRadius =
            radius * (0.16 + normalized * 0.84) + lace + interference;
          const x = centerX + Math.cos(theta) * currentRadius * 1.08;
          const y = centerY + Math.sin(theta) * currentRadius;

          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const ink = warm
          ? ring % 3 === 0
            ? "221, 100, 40"
            : "190, 139, 38"
          : ring % 4 === 0
            ? "16, 116, 104"
            : "29, 83, 128";
        context.strokeStyle = `rgba(${ink}, ${0.045 + normalized * 0.115})`;
        context.lineWidth = ring % 8 === 0 ? 0.95 : 0.48;
        context.stroke();
      }
    };

    const waveField = (phase: number) => {
      const lineCount = width < 700 ? 36 : 68;
      const step = Math.max(6, width / 230);

      for (let line = 0; line < lineCount; line += 1) {
        const baseY = (height / (lineCount - 1)) * line;
        context.beginPath();

        for (let x = -20; x <= width + 20; x += step) {
          const normalizedX = x / Math.max(width, 1);
          const normalizedY = baseY / Math.max(height, 1);
          const proximity =
            1 -
            Math.min(
              1,
              Math.abs(normalizedX - pointerX) * 1.65 +
                Math.abs(normalizedY - pointerY) * 0.68,
            );
          const envelope =
            Math.sin(normalizedX * Math.PI * 5.6 + line * 0.22 + phase) *
              (5 + proximity * 24) +
            Math.sin(
              normalizedX * Math.PI * 15.5 - line * 0.145 - phase * 1.65,
            ) *
              (1.7 + proximity * 6.4);
          const y = baseY + envelope;

          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const zone = line / lineCount;
        context.strokeStyle =
          zone > 0.66
            ? `rgba(215, 94, 36, ${0.025 + zone * 0.05})`
            : zone > 0.33
              ? `rgba(13, 119, 99, ${0.03 + zone * 0.045})`
              : `rgba(34, 96, 147, ${0.045 + (1 - zone) * 0.055})`;
        context.lineWidth = line % 11 === 0 ? 0.9 : 0.46;
        context.stroke();
      }
    };

    const verticalLathe = (phase: number) => {
      const lines = width < 700 ? 24 : 48;
      const rightEdge = width * 0.97;
      const leftEdge = width < 700 ? width * 0.5 : width * 0.55;

      for (let line = 0; line < lines; line += 1) {
        const normalized = line / lines;
        const xBase = leftEdge + (rightEdge - leftEdge) * normalized;
        context.beginPath();

        for (let y = -24; y <= height + 24; y += 7) {
          const normalizedY = y / Math.max(height, 1);
          const fold =
            Math.sin(normalizedY * Math.PI * 7 + line * 0.24 - phase * 1.25) *
              (7 + Math.sin(normalized * Math.PI) * 31) +
            Math.sin(normalizedY * Math.PI * 17 + line * 0.17 + phase) * 4;
          const x = xBase + fold;
          if (y === -24) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle =
          line % 3 === 0
            ? `rgba(22, 111, 97, ${0.035 + normalized * 0.055})`
            : `rgba(41, 92, 137, ${0.03 + normalized * 0.045})`;
        context.lineWidth = line % 9 === 0 ? 0.85 : 0.45;
        context.stroke();
      }
    };

    const interferenceRibbons = (phase: number) => {
      const bands = width < 700 ? 12 : 22;
      const steps = width < 700 ? 90 : 170;

      for (let band = 0; band < bands; band += 1) {
        const bandRatio = band / Math.max(1, bands - 1);
        const baseY = height * (0.08 + bandRatio * 0.84);
        context.beginPath();

        for (let point = 0; point <= steps; point += 1) {
          const ratio = point / steps;
          const x = ratio * width;
          const pointerPull =
            Math.max(0, 1 - Math.abs(ratio - pointerX) * 2.8) *
            (pointerY - 0.5) *
            16;
          const braid =
            Math.sin(ratio * Math.PI * 8.5 + band * 0.47 + phase * 1.8) *
              (4 + Math.sin(bandRatio * Math.PI) * 11) +
            Math.cos(ratio * Math.PI * 21 - band * 0.29 - phase * 2.3) * 2.4;
          const y = baseY + braid + pointerPull;

          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle =
          band % 4 === 0
            ? `rgba(218, 126, 49, ${0.032 + bandRatio * 0.025})`
            : band % 3 === 0
              ? `rgba(29, 124, 109, ${0.035 + bandRatio * 0.035})`
              : `rgba(46, 103, 149, ${0.028 + (1 - bandRatio) * 0.035})`;
        context.lineWidth = band % 7 === 0 ? 0.8 : 0.42;
        context.stroke();
      }
    };

    const radialRegister = (
      centerX: number,
      centerY: number,
      radius: number,
      phase: number,
    ) => {
      const ticks = width < 700 ? 72 : 132;
      context.save();
      context.translate(centerX, centerY);
      context.rotate(phase * 0.42);

      for (let tick = 0; tick < ticks; tick += 1) {
        const theta = (tick / ticks) * Math.PI * 2;
        const major = tick % 11 === 0;
        const inner = radius * (major ? 0.88 : 0.93);
        const outer = radius * (major ? 1.02 : 0.985);
        context.beginPath();
        context.moveTo(Math.cos(theta) * inner, Math.sin(theta) * inner);
        context.lineTo(Math.cos(theta) * outer, Math.sin(theta) * outer);
        context.strokeStyle = major
          ? "rgba(218, 126, 49, 0.17)"
          : "rgba(25, 110, 104, 0.095)";
        context.lineWidth = major ? 0.9 : 0.42;
        context.stroke();
      }

      context.restore();
    };

    const draw = (time: number) => {
      if (!pageVisible) return;

      if (!reducedMotion && time - lastDraw < 28) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      pointerX += (targetX - pointerX) * 0.028;
      pointerY += (targetY - pointerY) * 0.028;

      context.clearRect(0, 0, width, height);
      const phase = reducedMotion ? 0 : time * 0.0001;
      waveField(phase);
      interferenceRibbons(phase);
      verticalLathe(phase);

      const sealX = width < 760 ? width * 0.77 : width * 0.79;
      const sealY = height * 0.35;
      rosette(
        sealX + (pointerX - 0.5) * 17,
        sealY + (pointerY - 0.5) * 13,
        Math.min(width, height) * (width < 700 ? 0.34 : 0.43),
        phase,
      );
      radialRegister(
        sealX + (pointerX - 0.5) * 17,
        sealY + (pointerY - 0.5) * 13,
        Math.min(width, height) * (width < 700 ? 0.35 : 0.44),
        phase,
      );
      rosette(
        width * 0.08 - (pointerX - 0.5) * 9,
        height * 0.76,
        Math.min(width, height) * 0.22,
        -phase * 0.7,
        true,
      );

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      const nextVisible = !document.hidden;
      const shouldResume = nextVisible && !pageVisible;
      pageVisible = nextVisible;
      if (shouldResume) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", trackPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="guilloche-field" aria-hidden="true" />;
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="ZEN AI Co. home">
      <span className="brand-mark">
        <Image
          src="/zen-mark.png"
          alt=""
          width={42}
          height={42}
          unoptimized
          priority
        />
      </span>
      <span>
        <strong>ZEN AI Co.</strong>
        <small>Intelligence · Infrastructure · Proof</small>
      </span>
    </a>
  );
}

function RouteMark({ index }: { index: string }) {
  return (
    <span className="route-mark" aria-hidden="true">
      <span>{index}</span>
    </span>
  );
}

function DestinationDrawer({
  open,
  close,
  managedNavigation,
}: {
  open: boolean;
  close: () => void;
  managedNavigation: ManagedZenNavigationItem[];
}) {
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const managedMapItems = managedZenNavigationFor(
    managedNavigation,
    "header",
  );

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [close, open]);

  return (
    <div
      id="zen-destination-drawer"
      className={`destination-drawer ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        className="drawer-backdrop"
        type="button"
        onClick={close}
        aria-label="Close destination map"
      />
      <aside
        ref={panelRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zen-destination-title"
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">ZEN command map</span>
            <h2 id="zen-destination-title">Where do you want to go?</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="close-button"
            type="button"
            onClick={close}
          >
            Close
          </button>
        </div>
        <div className="drawer-ledger">
          {LEDGER.map((group) => (
            <section key={group.heading} className="drawer-group">
              <div>
                <span>{group.heading}</span>
                <p>{group.copy}</p>
              </div>
              <div className="drawer-links">
                {group.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    {...externalLinkProps(href)}
                  >
                    {label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
          {managedMapItems.length ? (
            <section className="drawer-group">
              <div>
                <span>ZEN pages</span>
                <p>Explore pages published from the ZEN admin control plane.</p>
              </div>
              <div className="drawer-links">
                {managedMapItems.map((item) => (
                  <a href={managedZenHref(item.slug)} key={item.id}>
                    {item.navLabel}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <div className="drawer-serial">
          ZEN · SERIES MMXXVI · BUILD WHAT MATTERS · PROVE WHAT YOU BUILT
        </div>
      </aside>
    </div>
  );
}

function CurrencyRail({
  chapter,
  title,
  code,
}: {
  chapter: string;
  title: string;
  code: string;
}) {
  return (
    <div className="currency-rail" aria-hidden="true">
      <span className="currency-rail__chapter">{chapter}</span>
      <div className="currency-rail__track">
        <span>{title}</span>
        <i />
        <span>ZEN AI CO.</span>
        <i />
        <span>{code}</span>
        <i />
        <span>{title}</span>
        <i />
        <span>ZEN AI CO.</span>
        <i />
        <span>{code}</span>
      </div>
      <span className="currency-rail__register">◈</span>
    </div>
  );
}

function RouteSigil({ index }: { index: string }) {
  return (
    <div className={`route-sigil route-sigil--${index}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <i>{index}</i>
    </div>
  );
}

export default function ZenHub({
  managedNavigation = [],
}: {
  managedNavigation?: ManagedZenNavigationItem[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const managedHeaderItems = managedZenNavigationFor(
    managedNavigation,
    "header",
  );
  const managedFooterItems = managedZenNavigationFor(
    managedNavigation,
    "footer",
  );

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="site-shell">
      <GuillocheField />
      <div className="living-gradient" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />
      <div className="hologram-wash" aria-hidden="true" />

      <header className="topbar">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary">
          <a href="#national-first">U.S. First</a>
          <a href="#company">Company</a>
          <a href="#impact">Impact</a>
          <a href={LINKS.work}>Public work</a>
          <a href={LINKS.constitution}>Constitution</a>
          <a href="#team">Team</a>
          {managedHeaderItems.map((item) => (
            <a href={managedZenHref(item.slug)} key={item.id}>
              {item.navLabel}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button
            className="map-button"
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="zen-destination-drawer"
            aria-haspopup="dialog"
          >
            <span aria-hidden="true">⌁</span>
            Map
          </button>
          <a
            className="primary-button primary-button--small"
            href={LINKS.pioneer}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore AI Pioneer <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="note-frame" aria-hidden="true">
          <span className="corner corner--tl">Z</span>
          <span className="corner corner--tr">AI</span>
          <span className="corner corner--bl">03</span>
          <span className="corner corner--br">26</span>
        </div>
        <div className="security-thread" aria-hidden="true">
          <span>
            ZEN · VERIFIED CAPABILITY · BUILT IN PUBLIC · ZEN · VERIFIED
            CAPABILITY · BUILT IN PUBLIC
          </span>
        </div>

        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            A new treasury of human capability · Series 2026
          </span>
          <a className="hero-first-claim" href="#national-first">
            <span className="hero-first-claim__medallion" aria-hidden="true">I</span>
            <span className="hero-first-claim__copy">
              <small>A United States First</small>
              <strong>
                The first youth AI literacy program in United States history
              </strong>
            </span>
            <span className="hero-first-claim__route">
              Founding record <i aria-hidden="true">↓</i>
            </span>
          </a>
          <h1>
            Intelligence
            <span>becomes capability.</span>
          </h1>
          <p>
            ZEN AI Co. turns curiosity into working systems—connecting
            education, creation, deployment, and portable proof in one living
            ecosystem.
          </p>
          <div className="hero-actions">
            <a
              className="primary-button"
              href={LINKS.pioneer}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the historic program <span aria-hidden="true">↗</span>
            </a>
            <a
              className="secondary-button"
              href={LINKS.arsenal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enter Arsenal
            </a>
          </div>
          <div className="proof-line">
            <span>
              <strong>Learn</strong> build-first pathways
            </span>
            <span>
              <strong>Build</strong> agents and systems
            </span>
            <span>
              <strong>Prove</strong> real capability
            </span>
          </div>
        </div>

        <div className="sovereign-seal" aria-label="ZEN capability seal">
          <div className="seal-orbit seal-orbit--outer" aria-hidden="true" />
          <div className="seal-orbit seal-orbit--inner" aria-hidden="true" />
          <div className="seal-type seal-type--top" aria-hidden="true">
            SOVEREIGN INTELLIGENCE
          </div>
          <div className="seal-type seal-type--bottom" aria-hidden="true">
            BUILD · VERIFY · ADVANCE
          </div>
          <a
            className="seal-core"
            href={LINKS.arsenal}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enter Arsenal"
          >
            <Image
              src="/zen-mark.png"
              alt="ZEN AI Co."
              width={170}
              height={170}
              unoptimized
              priority
            />
            <span>Enter the ecosystem</span>
          </a>
          <span className="seal-star seal-star--one" aria-hidden="true">
            ✦
          </span>
          <span className="seal-star seal-star--two" aria-hidden="true">
            ✦
          </span>
        </div>

        <div className="hero-serial" aria-hidden="true">
          <span>A 00000001 Z</span>
          <span>Issued against work completed</span>
          <span>Est. MMXXIII</span>
        </div>
      </section>

      <NationalFirstMonument />

      <CurrencyRail
        chapter="I"
        title="The first in United States history"
        code="YOUTH AI LITERACY / AI PIONEER / EST. MMXXIII"
      />

      <section id="proof" className="proof-archive">
        <div className="archive-frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="archive-shell">
          <div className="archive-intro" data-reveal>
            <div>
              <span className="eyebrow">The program that made history</span>
              <h2>
                Learn it clearly.
                <span>Build it for real.</span>
              </h2>
            </div>
            <div className="archive-statement">
              <span className="archive-folio">Pioneer / Modules 01–04</span>
              <p>
                AI Pioneer gives ages 11–18 a guided way to understand AI,
                practice inside interactive labs, build useful projects, and
                collect evidence of what they can do.
              </p>
              <a
                href={LINKS.pioneer}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the program <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="evidence-note" data-reveal>
            <div className="evidence-note__watermark" aria-hidden="true">
              Z
            </div>
            <div className="evidence-note__head">
              <span>ZEN AI CO. / CAPABILITY REGISTER</span>
              <strong>Program at a glance</strong>
              <span>SPECIMEN MMXXVI</span>
            </div>
            <div className="signal-grid" aria-label="ZEN field signals">
              {SIGNALS.map((signal, index) => (
                <article className="signal-card" key={signal.label}>
                  <span className="signal-number">0{index + 1}</span>
                  <div className="signal-rosette" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <strong>{signal.value}</strong>
                  <h3>{signal.label}</h3>
                  <p>{signal.detail}</p>
                </article>
              ))}
            </div>
            <div className="evidence-note__foot">
              <span>REGISTERED / LEARN</span>
              <i>◈</i>
              <span>VERIFIED / BUILD</span>
              <i>◈</i>
              <span>PORTABLE / PROVE</span>
            </div>
          </div>

          <div className="fieldwork-head" data-reveal>
            <div>
              <span className="eyebrow">Hands-on learning</span>
              <h3>Each idea becomes something learners can try.</h3>
            </div>
            <span>Read · experiment · build · reflect</span>
          </div>

          <div className="fieldwork-grid">
            {FIELDWORK.map((project) => (
              <article
                className={`fieldwork-card fieldwork-card--${project.tone}`}
                key={project.number}
                data-reveal
              >
                <div className="fieldwork-topline">
                  <span>{project.number}</span>
                  <span>{project.place}</span>
                </div>
                <div className="fieldwork-engraving" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="fieldwork-medallion" aria-hidden="true">
                  <span>{project.number.slice(0, 1)}</span>
                </div>
                <div className="fieldwork-copy">
                  <span>{project.kind}</span>
                  <h4>{project.title}</h4>
                  <p>{project.detail}</p>
                </div>
                <a
                  href={LINKS.pioneer}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Explore ${project.title} in AI Pioneer`}
                >
                  Explore program <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <div className="ecosystem-atlas" data-reveal>
            <div className="atlas-copy">
              <span className="eyebrow">One connected instrument</span>
              <h3>Every capability has somewhere to go next.</h3>
              <p>
                ZEN connects the learning path, the building environment, model
                exploration, deployment, and the evidence that remains after
                the work is finished.
              </p>
              <button
                className="atlas-map-button"
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls="zen-destination-drawer"
                aria-haspopup="dialog"
              >
                Open the complete ZEN map <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="atlas-instrument">
              <div className="atlas-seal" aria-hidden="true">
                <span className="atlas-seal__orbit" />
                <span className="atlas-seal__orbit" />
                <span className="atlas-seal__orbit" />
                <Image
                  src="/zen-mark.png"
                  alt=""
                  width={122}
                  height={122}
                  unoptimized
                />
              </div>
              <div className="atlas-axis atlas-axis--horizontal" aria-hidden="true" />
              <div className="atlas-axis atlas-axis--vertical" aria-hidden="true" />
              <span className="atlas-register atlas-register--one" aria-hidden="true">
                +
              </span>
              <span className="atlas-register atlas-register--two" aria-hidden="true">
                +
              </span>
            </div>
            <div className="atlas-nodes">
              {ECOSYSTEM.map((item, index) => (
                <a
                  className={`atlas-node atlas-node--${item.tone}`}
                  href={item.href}
                  key={item.code}
                  {...externalLinkProps(item.href)}
                >
                  <span>{item.code}</span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                  <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GatewayExpansion />

      <CurrencyRail
        chapter="II"
        title="Choose your instrument"
        code="ROUTE / 001—004"
      />

      <section id="routes" className="routes-section">
        <div className="route-note-frame" aria-hidden="true">
          <span>Z</span>
          <span>AI</span>
          <span>04</span>
          <span>MMXXVI</span>
        </div>
        <div className="section-intro" data-reveal>
          <span className="eyebrow">Four doors. One ecosystem.</span>
          <h2>Choose what you came to do.</h2>
          <p>
            Every click has a destination. Start with learning, advancing,
            building, or bringing ZEN to your community.
          </p>
        </div>
        <div className="route-grid">
          {ROUTES.map((route) => (
            <a
              className={`route-card route-card--${route.tone}`}
              href={route.href}
              key={route.index}
              {...externalLinkProps(route.href)}
              data-reveal
            >
              <div className="route-card-head">
                <RouteMark index={route.index} />
                <span className="route-signal">{route.signal}</span>
              </div>
              <RouteSigil index={route.index} />
              <div className="route-card-copy">
                <span className="route-verb">{route.verb}</span>
                <h3>{route.title}</h3>
                <p>{route.detail}</p>
              </div>
              <span className="route-enter">
                Enter <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
        <div className="route-sequence" data-reveal>
          {[
            ["01", "Learn", "Understand the medium"],
            ["02", "Build", "Shape a working system"],
            ["03", "Deploy", "Put capability in motion"],
            ["04", "Prove", "Carry the evidence forward"],
          ].map(([number, label, detail]) => (
            <div key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </section>

      <CurrencyRail
        chapter="III"
        title="The ZEN standard"
        code="LEARN / BUILD / DEPLOY / PROVE"
      />

      <section id="ledger" className="ledger-section">
        <div className="standard-certificate" data-reveal>
          <div className="certificate-frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="certificate-head">
            <span>ZEN AI CO. / CAPABILITY INSTRUMENT</span>
            <strong>Series MMXXVI</strong>
            <span>No. Z–00000001</span>
          </div>
          <div className="ledger-frame">
            <div className="ledger-copy">
              <span className="eyebrow">The ZEN standard</span>
              <h2>Real work creates its own currency.</h2>
              <p>
                Learning, building, files, deployment, and proof stay connected
                across the ZEN ecosystem—so capability can be seen, shared, and
                trusted.
              </p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls="zen-destination-drawer"
                aria-haspopup="dialog"
              >
                Open destination map
              </button>
            </div>
            <div className="certificate-seal" aria-hidden="true">
              <div className="certificate-seal__rays" />
              <div className="certificate-seal__core">
                <Image
                  src="/zen-mark.png"
                  alt=""
                  width={150}
                  height={150}
                  unoptimized
                />
              </div>
              <span>Capability / issued through work</span>
            </div>
            <div className="capability-ledger">
              {[
                ["01", "Learn", "AI Pioneer · Vanguard"],
                ["02", "Build", "Arsenal · Agents · Files"],
                ["03", "Deploy", "Apps · Automations · Systems"],
                ["04", "Prove", "Projects · Credentials · ZEN Cards"],
              ].map(([number, title, detail]) => (
                <div className="ledger-row" key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                  <i aria-hidden="true">✓</i>
                </div>
              ))}
            </div>
          </div>
          <div className="certificate-signatures">
            <div>
              <span>Designed for</span>
              <strong>Human agency</strong>
            </div>
            <div>
              <span>Secured by</span>
              <strong>Visible proof</strong>
            </div>
            <div>
              <span>Activated through</span>
              <strong>Real work</strong>
            </div>
          </div>
        </div>
      </section>

      <CurrencyRail
        chapter="IV"
        title="The next issuance"
        code="MAKE / WHAT / MATTERS"
      />

      <section className="issuance-section">
        <div className="issuance-linefield" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="issuance-copy" data-reveal>
          <span className="eyebrow">The next record can be yours</span>
          <h2>
            What will you
            <span>make real?</span>
          </h2>
          <p>
            Prepare a guided brief for ZEN, enter Arsenal to build, start with
            AI Pioneer to learn through creation, or bring ZEN to your
            organization or community.
          </p>
          <div className="issuance-actions">
            <a
              className="primary-button"
              href={LINKS.start}
            >
              Start your ZEN route <span aria-hidden="true">→</span>
            </a>
            <a
              className="secondary-button"
              href={LINKS.arsenal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enter Arsenal <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href={LINKS.contact}>
              Partner with ZEN
            </a>
          </div>
        </div>
        <div className="issuance-seal" data-reveal>
          <div className="issuance-seal__orbit" aria-hidden="true" />
          <div className="issuance-seal__orbit" aria-hidden="true" />
          <div className="issuance-seal__orbit" aria-hidden="true" />
          <div className="issuance-seal__core">
            <Image
              src="/zen-mark.png"
              alt="ZEN AI Co."
              width={180}
              height={180}
              unoptimized
            />
          </div>
          <span className="issuance-seal__type">BUILD · VERIFY · ADVANCE</span>
        </div>
        <div className="issuance-serial" aria-hidden="true">
          <span>Z 2026 00000001</span>
          <span>Intelligence into capability</span>
          <span>ZEN AI CO.</span>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-plate">
          <div className="footer-brand">
            <Brand />
            <p>Learn AI. Build what matters. Prove what you can do.</p>
          </div>
          <div className="footer-actions">
            <span>Continue the signal</span>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <i aria-hidden="true">↗</i>
            </a>
            <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer">
              YouTube <i aria-hidden="true">↗</i>
            </a>
            <a href={LINKS.x} target="_blank" rel="noopener noreferrer">
              X <i aria-hidden="true">↗</i>
            </a>
            <a href={LINKS.contact}>Contact <i aria-hidden="true">↗</i></a>
            {managedFooterItems.map((item) => (
              <a href={managedZenHref(item.slug)} key={item.id}>
                {item.navLabel}
              </a>
            ))}
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms-and-conditions">Terms</a>
            <a href="/accessibility-statement">Accessibility</a>
          </div>
          <div className="footer-origin">
            <span>Origin</span>
            <strong>Washington, D.C. / Everywhere intelligence is built</strong>
          </div>
          <div className="footer-microtype" aria-hidden="true">
            ZEN AI CO. · SOVEREIGN CAPABILITY INFRASTRUCTURE · LEARN · BUILD ·
            DEPLOY · PROVE · ZEN AI CO. · SOVEREIGN CAPABILITY INFRASTRUCTURE
          </div>
          <span className="footer-serial">
            © MMXXVI ZEN AI CO. · SERIES 03 · ALL CAPABILITY RESERVED
          </span>
        </div>
      </footer>

      <div className="mobile-dock">
        <a href={LINKS.pioneer} target="_blank" rel="noopener noreferrer">
          Explore AI Pioneer <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-controls="zen-destination-drawer"
          aria-haspopup="dialog"
        >
          ZEN Map
        </button>
      </div>

      <DestinationDrawer
        open={drawerOpen}
        close={() => setDrawerOpen(false)}
        managedNavigation={managedNavigation}
      />
    </main>
  );
}
