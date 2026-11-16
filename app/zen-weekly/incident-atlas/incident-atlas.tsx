"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { useRouter } from "next/navigation";
import type { ZenPublicationArticle, ZenPublicationBlock } from "../publication";
import {
  ATLAS_ALL_INCIDENTS,
  ATLAS_CATEGORIES,
  ATLAS_INCIDENTS,
  ATLASEVIDENCE_RELATIONS,
  DISTRIBUTED_INCIDENTS,
  EVIDENCE_LABELS,
  ISSUE_200_CANONICAL,
  type AtlasCategory,
  type AtlasIncident,
  type EvidenceLevel,
} from "./atlas-data";
import { ATLAS_H, ATLAS_W, WORLD_COUNTRIES } from "./world-shapes";
import styles from "./incident-atlas.module.css";

type MapCenter = { cx: number; cy: number; zoom: number };
type FilterLevel = "all" | EvidenceLevel;
type TimeBasis = "report" | "event";
type ListMode = "incidents" | "updates";
type MapCluster = { x: number; y: number; incidents: AtlasIncident[] };

const INITIAL_VIEW: MapCenter = { cx: ATLAS_W / 2, cy: ATLAS_H / 2, zoom: 1 };
const LEVELS: Array<{ id: FilterLevel; label: string }> = [
  { id: "all", label: "All evidence states" },
  { id: "documented", label: "Primary record" },
  { id: "reported", label: "Attributed reports" },
  { id: "disputed", label: "Disputed outcomes" },
  { id: "unverified", label: "Unverified claims" },
];
const COLORS: Record<AtlasCategory, string> = {
  aviation: "#247e9b",
  cloud: "#6178ba",
  industrial: "#aa853a",
  finance: "#478670",
  maritime: "#1980aa",
  security: "#b56b56",
  crypto: "#8e659c",
};
const STATUS_STROKES: Record<EvidenceLevel, string> = {
  documented: "#f4f1db",
  reported: "#ffcf78",
  disputed: "#c76a55",
  unverified: "#888d91",
};
const WORLD_BOUNDS = { minX: 0, minY: 0, maxX: ATLAS_W, maxY: ATLAS_H };
const DEFAULT_DAYS = [
  "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12",
  "2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16",
];

function padUpdate(value: number) { return String(value).padStart(3, "0"); }
function project(lon: number, lat: number) {
  return { x: (lon + 180) * ATLAS_W / 360, y: (90 - lat) * ATLAS_H / 180 };
}
function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
function viewBox(view: MapCenter) {
  const width = ATLAS_W / view.zoom;
  const height = ATLAS_H / view.zoom;
  return {
    x: clamp(view.cx - width / 2, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX - width),
    y: clamp(view.cy - height / 2, WORLD_BOUNDS.minY, WORLD_BOUNDS.maxY - height),
    width, height,
  };
}
function formatDate(value: string) {
  if (!/^\d{4}-\d\d-\d\d$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(value + "T12:00:00Z"));
}
function shortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(value + "T12:00:00Z"));
}
function excerpt(body: string, max = 220) {
  return body
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/)[^)]+\)/g, "$1")
    .replace(/[\`*_#|>~]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, max).trim();
}
function sourceLinks(updates: ReadonlyArray<ZenPublicationBlock>, positions: readonly number[]) {
  const sources: Array<{ url: string; title: string; origin: string; update: number }> = [];
  const seen = new Set<string>();
  for (const pos of [...positions].reverse()) {
    const s = updates.find((v) => v.position === pos);
    if (!s) continue;
    for (const link of s.body.matchAll(/\[([^\]\n]{2,130})\]\((https?:\/\/[^\s)]+)(?:\s+["'][^"']+["'])?\)/g)) {
      if (sources.length >= 24) break;
      try {
        const url = new URL(link[2]);
        if (url.protocol !== "https:" && url.protocol !== "http:") continue;
        if (seen.has(url.href)) continue;
        seen.add(url.href);
        sources.push({ url: url.href, title: link[1], origin: url.hostname.replace(/^www\./, ""), update: pos });
      } catch { /* do not generate malformed links */ }
    }
  }
  const primary = (host: string) =>
    /(^|\.)(faa\.gov|dot\.gov|transportation\.gov|microsoft\.com|ntsb\.gov|frbservices\.org|ukmto\.org|cisa\.gov|dhmfn\.ro|mapn\.ro|gov\.uk|gov\.om|gouv\.fr|sec\.gov|maritime\.gov|theclearinghouse\.org)$/.test(host);
  return sources.sort((a,b)=>Number(primary(b.origin))-Number(primary(a.origin))).slice(0,8);
}
function getUpdateTitle(block: ZenPublicationBlock) {
  const line = block.body.split("\n").map(s=>s.trim()).find(s=>
    /^\*\*(?:published|updated|what.changed|new.this|what's.new|evidence.dossier)/i.test(s));
  return line ? excerpt(line, 135) : excerpt(block.heading || block.body.slice(0, 135), 135);
}
function makeClusters(incidents: AtlasIncident[], zoom: number): MapCluster[] {
  const bins = new Map<string, MapCluster>();
  const cell = Math.max(4, 33 / zoom);
  for (const incident of incidents) {
    if (incident.lat === null || incident.lon === null) continue;
    const p = project(incident.lon, incident.lat);
    const key = Math.round(p.x / cell) + ":" + Math.round(p.y / cell);
    let bin = bins.get(key);
    if (!bin) { bin = { x: 0, y: 0, incidents: [] }; bins.set(key, bin); }
    bin.x += p.x; bin.y += p.y; bin.incidents.push(incident);
  }
  return [...bins.values()].map((c) => ({
    x: c.x / c.incidents.length, y: c.y / c.incidents.length, incidents: c.incidents,
  }));
}
function eventLink(n: number) {
  return ISSUE_200_CANONICAL + (n === 0 ? "#original-record" : "#update-" + padUpdate(n));
}
function isWithinTime(value: string, begin: string, end: string) {
  return (!begin || value >= begin) && (!end || value <= end);
}

type Props = {
  article: ZenPublicationArticle;
  retrievedAt: string;
};

export function ZenWeeklyIncidentAtlas({ article, retrievedAt }: Props) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; active: boolean } | null>(null);
  const [view, setView] = useState<MapCenter>(INITIAL_VIEW);
  const [category, setCategory] = useState<"all" | AtlasCategory>("all");
  const [evidence, setEvidence] = useState<FilterLevel>("all");
  const [timeBasis, setTimeBasis] = useState<TimeBasis>("report");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("hormuz-ukmto");
  const [activeTab, setActiveTab] = useState<ListMode>("incidents");
  const [showRelationships, setShowRelationships] = useState(false);
  const [showFullRecord, setShowFullRecord] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCompact, setShowCompact] = useState(false);

  const sections = useMemo(() =>
    article.sections.filter(section => section.position >= 0), [article.sections]);
  const officialPositions = useMemo(() =>
    new Set(sections.map(section => section.position)), [sections]);
  const incidentRecords = useMemo(() =>
    ATLAS_ALL_INCIDENTS.filter(item => item.updates.some(n => officialPositions.has(n))),
    [officialPositions]);
  const mappedPositions = useMemo(() =>
    new Set(incidentRecords.flatMap(item => item.updates)), [incidentRecords]);
  const unmatchedUpdates = useMemo(() =>
    sections.filter(section => section.position > 0 && !mappedPositions.has(section.position)),
    [sections, mappedPositions]);
  const maxNumber = useMemo(() =>
    Math.max(0, ...sections.map(section => section.position)), [sections]);
  const visibleIncidents = useMemo(() => incidentRecords.filter(item => {
    if (category !== "all" && item.category !== category) return false;
    if (evidence !== "all" && item.evidence !== evidence) return false;
    const date = timeBasis === "report" ? item.reportedDate : item.eventDate;
    if (!isWithinTime(date, dateFrom, dateTo)) return false;
    if (search.trim()) {
      const needle = search.toLowerCase().trim();
      const phrase = [item.title, item.place, item.country, item.summary, item.unresolved,
        ...item.updates.map(n=>"#"+padUpdate(n))].join(" ").toLowerCase();
      if (!phrase.includes(needle)) return false;
    }
    return true;
  }), [incidentRecords,category,evidence,timeBasis,dateFrom,dateTo,search]);
  const pins = useMemo(() =>
    visibleIncidents.filter(i=>i.lat !== null && i.lon !== null), [visibleIncidents]);
  const distributed = useMemo(() =>
    visibleIncidents.filter(i=>i.precision === "distributed"), [visibleIncidents]);
  const clusters = useMemo(() => makeClusters(pins, view.zoom), [pins,view.zoom]);
  const chosen = incidentRecords.find(r=>r.id === selectedId) ?? incidentRecords[0] ?? null;
  const sourceUpdates = useMemo(() =>
    chosen ? chosen.updates.filter(n=>officialPositions.has(n)).sort((a,b)=>b-a) : [],
    [chosen,officialPositions]);
  const chosenSources = useMemo(() =>
    chosen ? sourceLinks(sections,chosen.updates) : [], [sections,chosen]);
  const timeDays = useMemo(() => {
    const base = new Set(DEFAULT_DAYS);
    incidentRecords.filter(s=>s.reportedDate>="2026-11-08").forEach(s=>base.add(s.reportedDate));
    return [...base].sort();
  },[incidentRecords]);
  const viewRect = viewBox(view);

  const changeZoom = useCallback((factor: number, cx?: number, cy?: number) => {
    setView(previous=>{
      const nextZoom = clamp(previous.zoom * factor,1,16);
      const w = ATLAS_W / nextZoom,h = ATLAS_H / nextZoom;
      return {
        zoom:nextZoom,
        cx:clamp(cx??previous.cx,w/2,ATLAS_W-w/2),
        cy:clamp(cy??previous.cy,h/2,ATLAS_H-h/2),
      };
    });
  },[]);
  const focusIncident = useCallback((incident:AtlasIncident) => {
    setSelectedId(incident.id); setShowFullRecord(false);
    if(incident.lat===null||incident.lon===null) return;
    const p=project(incident.lon,incident.lat);
    setView(prev=>{
      const zoom=Math.max(prev.zoom,3.7),w=ATLAS_W/zoom,h=ATLAS_H/zoom;
      return { zoom,cx:clamp(p.x,w/2,ATLAS_W-w/2),cy:clamp(p.y,h/2,ATLAS_H-h/2) };
    });
  },[]);
  const zoomToCluster=(cluster:MapCluster)=>{
    if(cluster.incidents.length===1){focusIncident(cluster.incidents[0]);return;}
    changeZoom(2.1,cluster.x,cluster.y);
  };
  const beginDrag=(event:ReactPointerEvent<SVGSVGElement>)=>{
    if((event.target as Element).closest("[data-incident-pin]")) return;
    drag.current={x:event.clientX,y:event.clientY,cx:view.cx,cy:view.cy,active:true};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag=(event:ReactPointerEvent<SVGSVGElement>)=>{
    const record=drag.current;
    if(!record?.active||!svgRef.current) return;
    const bounds=svgRef.current.getBoundingClientRect();
    const dx=(event.clientX-record.x)*viewRect.width/bounds.width;
    const dy=(event.clientY-record.y)*viewRect.height/bounds.height;
    setView(previous=>({
      ...previous,
      cx:clamp(record.cx-dx,viewRect.width/2,ATLAS_W-viewRect.width/2),
      cy:clamp(record.cy-dy,viewRect.height/2,ATLAS_H-viewRect.height/2),
    }));
  };
  const endDrag=(event:ReactPointerEvent<SVGSVGElement>)=>{
    drag.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const wheel=(event:ReactWheelEvent<SVGSVGElement>)=>{
    event.preventDefault();
    changeZoom(event.deltaY<0?1.2:1/1.2);
  };
  const refresh=()=>{
    setIsRefreshing(true);
    router.refresh();
  };
  useEffect(()=>{setIsRefreshing(false)},[retrievedAt]);
  useEffect(()=>{
    const interval=window.setInterval(()=>{
      if(document.visibilityState==="visible") router.refresh();
    },120000);
    return()=>window.clearInterval(interval);
  },[router]);

  const dateGrouped = useMemo(()=>timeDays.map(date=>({
    date,
    count: incidentRecords.filter(i=>i.reportedDate===date).length,
  })),[timeDays,incidentRecords]);

  const presentedConnections = useMemo(()=>ATLASEVIDENCE_RELATIONS.filter(relation=>
    officialPositions.has(relation.update) &&
    incidentRecords.some(i=>i.id===relation.from) &&
    incidentRecords.some(i=>i.id===relation.to)),[incidentRecords,officialPositions]);

  return (
    <div className={styles.atlasPage}>
      <div className={styles.woodGrain} aria-hidden="true"/>
      <div className={styles.shell}>
        <nav className={styles.navbar} aria-label="Atlas navigation">
          <div className={styles.brand}>
            <span className={styles.brandMark}>Z</span>
            <div><strong>ZEN WEEKLY</strong><small>INCIDENT ATLAS · ISSUE #200</small></div>
          </div>
          <div className={styles.navActions}>
            <span className={styles.sourceSync}><span className={styles.syncDot}/> Published evidence · through update {padUpdate(maxNumber)}</span>
            <button type="button" onClick={refresh} aria-label="Refresh the latest published incident records" disabled={isRefreshing}>{isRefreshing?"Checking…":"Refresh evidence"}</button>
            <a href={ISSUE_200_CANONICAL}>Read full investigation <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        <header className={styles.hero}>
          <div>
            <p className={styles.heroEyebrow}>THE PUBLIC RECORD / GEOSPATIAL EVIDENCE</p>
            <h1>The Incident Atlas</h1>
            <p className={styles.heroLead}>An interactive, location-aware investigation of the infrastructure, security and maritime reports documented in ZEN Weekly Issue #200. Explore the places, sources, timelines and dependencies—not an imagined network of coordinated attacks.</p>
          </div>
          <div className={styles.summaryStats}>
            <div><strong>{officialPositions.size-1}</strong><small>Published updates</small></div>
            <div><strong>{incidentRecords.length}</strong><small>Indexed evidence tracks</small></div>
            <div><strong>{incidentRecords.filter(i=>i.precision!=="distributed").length}</strong><small>Geographic markers</small></div>
          </div>
        </header>

        <section className={styles.toolbox} aria-label="Incident atlas filters">
          <div className={styles.categoryBar}>
            {ATLAS_CATEGORIES.map(item=>(
              <button
                type="button" key={item.id} aria-pressed={category===item.id}
                className={category===item.id?styles.activeCategory:""}
                onClick={()=>setCategory(item.id)}
                style={{"--categoryColor":item.color} as React.CSSProperties}
              >{item.name}</button>
            ))}
          </div>
          <div className={styles.filters}>
            <label className={styles.searchField}>
              <span>Search reported events, regions, or update numbers</span>
              <input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="e.g. El Dorado, Hormuz, #031…"/>
            </label>
            <label>Evidence classification
              <select value={evidence} onChange={e=>setEvidence(e.target.value as FilterLevel)}>
                {LEVELS.map(l=><option value={l.id} key={l.id}>{l.label}</option>)}
              </select>
            </label>
            <label>Time basis
              <select value={timeBasis} onChange={e=>setTimeBasis(e.target.value as TimeBasis)}>
                <option value="report">Date reported</option>
                <option value="event">Date of occurrence</option>
              </select>
            </label>
            <label>From <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/></label>
            <label>Through <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}/></label>
            <button type="button" className={styles.clearFilters} onClick={()=>{setSearch("");setDateFrom("");setDateTo("");setCategory("all");setEvidence("all");setTimeBasis("report");setView(INITIAL_VIEW);}}>Reset view</button>
          </div>
        </section>

        <main className={styles.primaryGrid}>
          <div className={styles.mapColumn}>
            <div className={styles.tableStage}>
              <div className={styles.atlasBook}>
                <div className={styles.bookCorners} aria-hidden="true"/>
                <div className={styles.mapHeader}>
                  <div><span>VOL. 200</span><strong>World incidents · Evidence location index</strong></div>
                  <span>1:110M geographic outlines <b>•</b> Pin precision disclosed</span>
                </div>
                <div className={styles.mapFrame}>
                  <svg
                    ref={svgRef}
                    viewBox={`${viewRect.x} ${viewRect.y} ${viewRect.width} ${viewRect.height}`}
                    aria-label="Pan and zoom world atlas with plotted published ZEN Weekly incident evidence"
                    className={styles.worldSvg}
                    onPointerDown={beginDrag}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onWheel={wheel}
                    onDoubleClick={()=>changeZoom(1.8)}
                  >
                    <defs>
                      <linearGradient id="atlasOcean" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#d3e3dd"/>
                        <stop offset=".5" stopColor="#bdd4d3"/>
                        <stop offset="1" stopColor="#aecbc9"/>
                      </linearGradient>
                      <pattern id="atlasPaper" width="11" height="11" patternUnits="userSpaceOnUse">
                        <path d="M0 11H11M11 0V11" stroke="#fff5d6" strokeOpacity=".2" strokeWidth=".5"/>
                      </pattern>
                      <filter id="pinHalo" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="2"/>
                      </filter>
                    </defs>
                    <rect width={ATLAS_W} height={ATLAS_H} fill="url(#atlasOcean)"/>
                    <rect width={ATLAS_W} height={ATLAS_H} fill="url(#atlasPaper)"/>
                    {Array.from({length:18},(_,i)=>(
                      <line key={"lon"+i} x1={i*80} x2={i*80} y1="0" y2={ATLAS_H} stroke="#6f9c9d" strokeWidth=".55" strokeOpacity=".42" strokeDasharray="3 5"/>
                    ))}
                    {Array.from({length:9},(_,i)=>(
                      <line key={"lat"+i} y1={i*80} y2={i*80} x1="0" x2={ATLAS_W} stroke="#6f9c9d" strokeWidth=".55" strokeOpacity=".42" strokeDasharray="3 5"/>
                    ))}
                    <g className={styles.countryLayer}>
                      {WORLD_COUNTRIES.map((country,i)=>(
                        <path key={country.code+"-"+i} d={country.d} strokeLinejoin="round" fillRule="evenodd">
                          <title>{country.name}</title>
                        </path>
                      ))}
                    </g>
                    <g className={styles.oceanLabels} aria-hidden="true">
                      <text x="153" y="335">PACIFIC OCEAN</text>
                      <text x="560" y="440">ATLANTIC OCEAN</text>
                      <text x="915" y="514">INDIAN OCEAN</text>
                      <text x="1285" y="370">PACIFIC OCEAN</text>
                      <text x="730" y="100">ARCTIC OCEAN</text>
                    </g>
                    {showRelationships && presentedConnections.filter(c=>c.type==="same_investigation").map(relation=>{
                      const a=incidentRecords.find(i=>i.id===relation.from),b=incidentRecords.find(i=>i.id===relation.to);
                      if(!a||!b||a.lat===null||b.lat===null||a.lon===null||b.lon===null)return null;
                      const pa=project(a.lon,a.lat),pb=project(b.lon,b.lat);
                      return <line key={relation.from+"_"+relation.to} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#b47b40" strokeWidth={3/view.zoom} strokeDasharray={`${10/view.zoom} ${7/view.zoom}`} opacity=".85"/>;
                    })}
                    <g className={styles.markerLayer}>
                      {clusters.map(cluster=>{
                        const multi=cluster.incidents.length>1;
                        const sample=cluster.incidents[0];
                        const chosenInCluster=cluster.incidents.some(i=>i.id===selectedId);
                        const radius=(multi?19:11)/Math.sqrt(view.zoom);
                        return <g
                          key={cluster.incidents.map(i=>i.id).sort().join("+")}
                          role="button" tabIndex={0} data-incident-pin="true"
                          aria-label={multi?`Zoom to ${cluster.incidents.length} incident tracks near ${sample.place}`:`Inspect ${sample.title}`}
                          onClick={()=>zoomToCluster(cluster)}
                          onKeyDown={(event:ReactKeyboardEvent<SVGGElement>)=>{
                            if(event.key==="Enter"||event.key===" "){event.preventDefault();zoomToCluster(cluster);}
                          }}
                          style={{cursor:"pointer"}}
                        >
                          <circle cx={cluster.x} cy={cluster.y} r={radius*2.3} fill={COLORS[sample.category]} opacity={chosenInCluster?.28:.1} filter="url(#pinHalo)"/>
                          <circle cx={cluster.x} cy={cluster.y} r={radius+2/view.zoom} fill="#faf1cf" stroke={chosenInCluster?"#9c6f26":"#45696d"} strokeWidth={chosenInCluster?3/view.zoom:1.7/view.zoom} />
                          <circle cx={cluster.x} cy={cluster.y} r={radius} fill={multi?"#234e62":COLORS[sample.category]} stroke={STATUS_STROKES[sample.evidence]} strokeWidth={2/view.zoom} strokeDasharray={sample.precision==="site"?undefined:`${5/view.zoom} ${2.5/view.zoom}`} />
                          {multi ? (
                            <text x={cluster.x} y={cluster.y+5/Math.sqrt(view.zoom)} fontWeight="800" fontSize={Math.max(7,15/Math.sqrt(view.zoom))} textAnchor="middle" fill="#fffdf2">{cluster.incidents.length}</text>
                          ):(
                            <circle cx={cluster.x} cy={cluster.y} r={3.2/Math.sqrt(view.zoom)} fill="white"/>
                          )}
                          <title>{multi?`${cluster.incidents.length} indexed incidents (click to zoom)`:`${sample.title} · ${EVIDENCE_LABELS[sample.evidence]}`}</title>
                        </g>;
                      })}
                    </g>
                  </svg>
                  <div className={styles.bookFold} aria-hidden="true"/>
                  <div className={styles.mapTools}>
                    <button type="button" aria-label="Zoom in" onClick={()=>changeZoom(1.5)}>+</button>
                    <span>{view.zoom.toFixed(1)}×</span>
                    <button type="button" aria-label="Zoom out" onClick={()=>changeZoom(1/1.5)}>−</button>
                    <button type="button" onClick={()=>setView(INITIAL_VIEW)}>World</button>
                  </div>
                  <div className={styles.compass} aria-hidden="true"><span>N</span><i>✧</i><span>S</span></div>
                  <div className={styles.mapStamp}>Approximate markers are not precise incident coordinates.</div>
                </div>
                <div className={styles.mapFooter}>
                  <span>Natural Earth · Public-domain geographical data</span>
                  <span>Map reflects {pins.length} filtered location tracks · {clusters.length} selectable pin clusters</span>
                  <span>ZEN INVESTIGATIVE ATLAS / 2026</span>
                </div>
              </div>
              <div className={styles.woodDeskDetails} aria-hidden="true"><span>✦</span><span>RESEARCH FOLIO 200</span></div>
            </div>
            <div className={styles.legendRow}>
              <span><i className={styles.documented}/> Primary-source record</span>
              <span><i className={styles.reported}/> Attributed reporting</span>
              <span><i className={styles.disputed}/> Disputed claims</span>
              <label><input type="checkbox" checked={showRelationships} onChange={e=>setShowRelationships(e.target.checked)}/> Show documented same-investigation site link</label>
            </div>
          </div>

          <aside className={styles.inspector} aria-label="Selected incident details">
            <div className={styles.inspectorHead}>
              <span>INCIDENT EVIDENCE FILE</span>
              <strong>{chosen?"FILE "+chosen.id.toUpperCase().replace(/-/g,"-"):"NO RECORD"}</strong>
            </div>
            {chosen ? (
              <>
                <div className={styles.inspectorTitle}>
                  <p>{chosen.category.toUpperCase()} / {chosen.precision==="distributed"?"DISTRIBUTED SYSTEM":chosen.country}</p>
                  <h2>{chosen.title}</h2>
                  <span className={styles.evidencePill} data-level={chosen.evidence}>{EVIDENCE_LABELS[chosen.evidence]}</span>
                </div>
                <dl className={styles.factGrid}>
                  <div><dt>Event</dt><dd>{formatDate(chosen.eventDate)}</dd></div>
                  <div><dt>Reported</dt><dd>{formatDate(chosen.reportedDate)}</dd></div>
                  <div className={styles.wideFact}><dt>Geography</dt><dd>{chosen.place}</dd></div>
                  <div className={styles.wideFact}><dt>Marker fidelity</dt><dd>{chosen.precision==="site"?"Named site / published coordinate":chosen.precision==="region"?"Representative region, not verified event coordinates":chosen.precision==="approximate"?"Approximate reported sector":"Not geolocatable; represented in the system ledger"}</dd></div>
                </dl>
                <section className={styles.inspectorSection}>
                  <h3>What the evidence establishes</h3><p>{chosen.summary}</p>
                </section>
                <section className={styles.inspectorSection}>
                  <h3>What remains unknown</h3><p>{chosen.unresolved}</p>
                </section>
                <section className={styles.inspectorSection}>
                  <h3>What would change our assessment</h3><p>{chosen.signal}</p>
                </section>
                <div className={styles.recordLinks}>
                  <h3>Read underlying article updates</h3>
                  <div>{sourceUpdates.map(n=>(
                    <a key={n} href={eventLink(n)}>{n===0?"Original article":`Update ${padUpdate(n)}`} ↗</a>
                  ))}</div>
                </div>
                <details className={styles.sourcesDisclosure}>
                  <summary>Source links extracted from published updates ({chosenSources.length})</summary>
                  <ul>{chosenSources.map(src=>(
                    <li key={src.url}><a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a><small>{src.origin} · #{padUpdate(src.update)}</small></li>
                  ))}</ul>
                  <p>Source links come from associated article sections. Attribution may remain disputed even when the notice itself is authentic.</p>
                </details>
                <button className={styles.fullRecordButton} type="button" onClick={()=>setShowFullRecord(v=>!v)}>
                  {showFullRecord?"Hide the original wording":"Read the article's exact evidence excerpt"}
                </button>
                {showFullRecord ? <div className={styles.fullExcerpt}>
                  {sourceUpdates.slice(0,2).map(n=>{
                    const sec=sections.find(s=>s.position===n);
                    return sec?<section key={n}><strong>{n===0?"ORIGINAL RECORD":`UPDATE ${padUpdate(n)}`}</strong><p>{excerpt(sec.body,1600)}…</p><a href={eventLink(n)}>Open full, unshortened source ↗</a></section>:null;
                  })}
                </div>:null}
              </>
            ) : <p>No published evidence tracks matched the current source record.</p>}
          </aside>
        </main>

        <section className={styles.timeline} aria-label="Interactive reporting timeline">
          <div className={styles.timelineIntro}><span>THE CHRONOLOGY</span><strong>Navigate the disclosure window</strong><small>Dates select the report date, not necessarily the date of the incident.</small></div>
          <div className={styles.timelineStrip}>
            <button className={!dateFrom&&!dateTo?styles.dayActive:""} onClick={()=>{setDateFrom("");setDateTo("");setTimeBasis("report");}} type="button"><b>ALL</b><small>{incidentRecords.length} tracks</small></button>
            {dateGrouped.map(day=><button
              key={day.date}
              className={dateFrom===day.date&&dateTo===day.date?styles.dayActive:""}
              type="button"
              onClick={()=>{setTimeBasis("report");setDateFrom(day.date);setDateTo(day.date);}}
            ><b>{shortDate(day.date)}</b><small>{day.count} tracks</small></button>)}
          </div>
        </section>

        <section className={styles.ledger} aria-labelledby="ledger-heading">
          <div className={styles.ledgerHeader}>
            <div><p className={styles.kicker}>PUBLIC RECORD / LATEST THROUGH #{padUpdate(maxNumber)}</p><h2 id="ledger-heading">Incident and update ledger</h2><p>No fabricated coordinates. Distributed systems remain separate from mapped sites; every published update remains accessible.</p></div>
            <div className={styles.ledgerTabs} role="tablist" aria-label="Atlas record index">
              <button type="button" role="tab" aria-selected={activeTab==="incidents"} onClick={()=>setActiveTab("incidents")}>Evidence tracks</button>
              <button type="button" role="tab" aria-selected={activeTab==="updates"} onClick={()=>setActiveTab("updates")}>All article updates</button>
            </div>
          </div>
          {activeTab==="incidents" ? (
            <div className={styles.trackGrid}>
              <div className={styles.trackColumn}>
                <h3>Mapped locations <small>({pins.length})</small></h3>
                <div className={styles.trackList}>
                  {[...pins].sort((a,b)=>b.reportedDate.localeCompare(a.reportedDate)).map(item=><button
                    key={item.id} type="button" onClick={()=>{focusIncident(item);}}
                    className={selectedId===item.id?styles.selectedTrack:""}
                  ><span className={styles.trackColor} style={{background:COLORS[item.category]}}/><span><strong>{item.title}</strong><small>{item.place} · {shortDate(item.reportedDate)} · {EVIDENCE_LABELS[item.evidence]}</small></span><span>↗</span></button>)}
                  {!pins.length?<p>No mapped tracks match these filters.</p>:null}
                </div>
              </div>
              <div className={styles.trackColumn}>
                <h3>Distributed systems <small>({distributed.length})</small></h3>
                <div className={styles.trackList}>
                  {[...distributed].sort((a,b)=>b.reportedDate.localeCompare(a.reportedDate)).map(item=><button
                    key={item.id} type="button" onClick={()=>{setSelectedId(item.id);setShowFullRecord(false);}}
                    className={selectedId===item.id?styles.selectedTrack:""}
                  ><span className={styles.trackColor} style={{background:COLORS[item.category]}}/><span><strong>{item.title}</strong><small>Not geographically pinned · {shortDate(item.reportedDate)} · {EVIDENCE_LABELS[item.evidence]}</small></span><span>↗</span></button>)}
                  {!distributed.length?<p>No distributed tracks match these filters.</p>:null}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.updateLedger}>
              {sections.filter(s=>s.position>0).sort((a,b)=>b.position-a.position).map(block=>(
                <a key={block.id} href={eventLink(block.position)}>
                  <strong>#{padUpdate(block.position)}</strong><span>{getUpdateTitle(block)}</span><em>{incidentRecords.filter(e=>e.updates.includes(block.position)).length} indexed tracks</em><b>↗</b>
                </a>
              ))}
            </div>
          )}
          {unmatchedUpdates.length>0 ? (
            <p className={styles.unmappedNotice}><strong>{unmatchedUpdates.length} newer article updates need a geospatial review.</strong> Their complete text appears in the update ledger. No coordinates are guessed.</p>
          ) : null}
        </section>

        <section className={styles.relations} aria-labelledby="relations-heading">
          <div><p className={styles.kicker}>SECOND-ORDER EVIDENCE</p><h2 id="relations-heading">Connections, not conspiracies</h2><p>Some incidents share a vendor boundary, a dependency or a geography. Only an independently documented pathway is treated as a connection. Co-occurrence alone does not establish a common attacker.</p></div>
          <div className={styles.relationshipGrid}>
            {presentedConnections.map(edge=>{
              const from=incidentRecords.find(i=>i.id===edge.from),to=incidentRecords.find(i=>i.id===edge.to);
              return <article key={edge.from+edge.to}>
                <span>{edge.type==="same_investigation"?"SAME INVESTIGATION":edge.type==="reported_consequence"?"ATTRIBUTED OPERATIONAL LINK":edge.type==="documented_dependency"?"DOCUMENTED DEPENDENCY":"SAME REGION / NO COMMON CAUSE ESTABLISHED"}</span>
                <strong>{from?.title} <i>→</i> {to?.title}</strong>
                <p>{edge.label}</p>
                <a href={eventLink(edge.update)}>Evidence · #{padUpdate(edge.update)} ↗</a>
              </article>;
            })}
          </div>
        </section>

        <footer className={styles.atlasFooter}>
          <div><strong>ZEN AI CO. / ZEN WEEKLY</strong><span>ISSUE #200 · INVESTIGATIVE ATLAS</span></div>
          <p>Public article sections are retrieved from the published Supabase record. Pins use a curated location index with explicit precision; a marker is not independent evidence. World boundaries: Natural Earth 110m public-domain geometry. No tracking pixels, paid mapping API, fabricated incident coordinates or implied cross-incident attribution.</p>
          <div><small>Evidence retrieved: {new Date(retrievedAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short",timeZone:"America/New_York"})} ET</small><a href={ISSUE_200_CANONICAL}>Full source publication ↗</a></div>
        </footer>
      </div>
    </div>
  );
}
