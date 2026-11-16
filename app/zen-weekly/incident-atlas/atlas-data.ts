/** ZEN Weekly Issue 200: curated geospatial index of source-backed incident tracks.
 * These are *map labels*, not evidence of the event happening at the plotted point:
 * point = known named site; region = representative area; approximate = broad reported
 * sector; distributed = NOT geographically pinned.
 * The authoritative evidence remains the existing immutable sections in Supabase.
 * Never infer common cause from temporal or geographic proximity.
 */
export type AtlasCategory = "aviation" | "cloud" | "industrial" | "finance" | "maritime" | "security" | "crypto";
export type EvidenceLevel = "documented" | "reported" | "disputed" | "unverified";
export type GeoPrecision = "site" | "region" | "approximate" | "distributed";

export type AtlasIncident = {
  id: string;
  title: string;
  place: string;
  country: string;
  lat: number | null;
  lon: number | null;
  precision: GeoPrecision;
  category: AtlasCategory;
  evidence: EvidenceLevel;
  eventDate: string;
  reportedDate: string;
  updates: number[];
  summary: string;
  unresolved: string;
  signal: string;
};

export const ISSUE_200_ID = "3d64f3e5-2906-4029-a977-b547346ed66f";
export const ISSUE_200_CANONICAL =
  "https://www.zenai.world/zen-weekly/when-the-system-that-runs-the-world-fails-microsoft-s-cascade-tsmc-s-data-breach--3d64f3e5-2906-4029-a977-b547346ed66f";

export const ATLAS_CATEGORIES: ReadonlyArray<{ id: "all" | AtlasCategory; name: string; color: string }> = [
  { id: "all", name: "All evidence", color: "#355f75" },
  { id: "aviation", name: "Aviation", color: "#267c9b" },
  { id: "cloud", name: "Cloud & AI", color: "#496fc1" },
  { id: "industrial", name: "Industrial", color: "#a17831" },
  { id: "finance", name: "Banking", color: "#4a846f" },
  { id: "maritime", name: "Maritime", color: "#167fa5" },
  { id: "security", name: "Security", color: "#aa6653" },
  { id: "crypto", name: "On-chain", color: "#956aa0" },
];

export const EVIDENCE_LABELS: Record<EvidenceLevel,string> = {
  documented: "Primary record",
  reported: "Attributed report",
  disputed: "Disputed outcome",
  unverified: "Unverified claim",
};

export const ATLAS_INCIDENTS: ReadonlyArray<AtlasIncident> = [
  {
    id:"faa-el-dorado",title:"FAA router-change investigation · El Dorado",place:"El Dorado, Arkansas",country:"United States",lat:33.2076,lon:-92.6663,precision:"region",category:"aviation",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[1,7,19,22,28,35],
    summary:"FAA identifies this locality in its two-site technical investigation. Officials describe a newly activated router and abnormal network traffic; the precise initiating mechanism is not yet established.",
    unresolved:"Exact device configuration, failure propagation, and vendor-versus-FAA change approval.",signal:"Dated FAA root-cause report, packet/configuration comparison, change-control and failover records.",
  },
  {
    id:"faa-amarillo",title:"FAA router-change investigation · Amarillo",place:"Amarillo, Texas",country:"United States",lat:35.2219,lon:-101.8313,precision:"region",category:"aviation",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[1,19,22,28,35],
    summary:"FAA names Amarillo as a second investigated network site. Duffy says its installation preceded Friday's El Dorado work by weeks.",
    unresolved:"Whether behavior was expected, misconfigured, propagated unexpectedly, or shared a defect.",signal:"Juniper/HPE and L3Harris engineering evidence and FAA test outcomes.",
  },
  {
    id:"new-orleans-allision",title:"Atlantic Asphalt–American Heritage collision",place:"New Orleans, Louisiana",country:"United States",lat:29.9537,lon:-90.072,precision:"region",category:"maritime",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[9,11,26],
    summary:"Tanker struck a docked cruise vessel; people were injured and the NTSB recovered recorder data. Preliminary material describes a steering casualty.",
    unresolved:"Final steering-failure mechanism, exact impact-time discrepancy and causation.",signal:"NTSB preliminary/final findings, voyage recorder analysis and safety recommendations.",
  },
  {
    id:"peoria-bio-urja",title:"BioUrja ethanol-facility security emergency",place:"Peoria, Illinois",country:"United States",lat:40.6936,lon:-89.589,precision:"region",category:"industrial",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[8],
    summary:"Authorities investigated a credible suspicious device, ordered precautionary evacuation and temporarily restricted Illinois River traffic; restrictions were lifted.",
    unresolved:"Device composition, suspect and motive; no demonstrated connection to other incidents.",signal:"Police, ATF or FBI forensic determination and any subsequent charges.",
  },
  {
    id:"eversource-connecticut",title:"Eversource account-intrusion and regulator inquiry",place:"Connecticut impact region",country:"United States",lat:41.62,lon:-72.72,precision:"region",category:"industrial",evidence:"documented",eventDate:"2026-04-14",reportedDate:"2026-11-15",updates:[13],
    summary:"Connecticut's consumer counsel reported employee-account compromise and subsequent customer-data exposure. This marker represents affected jurisdiction, NOT attacker location.",
    unresolved:"Duration, corrective controls and any operational-system exposure beyond vendor statements.",signal:"Public independent audit results and state utility regulator orders.",
  },
  {
    id:"hotel-bruehl",title:"Hotel Ling Bao chlorine-dosing emergency",place:"Brühl, Germany",country:"Germany",lat:50.8306,lon:6.899,precision:"site",category:"industrial",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[36],
    summary:"The hotel operator linked an undelivered safety alert to Microsoft 365 disruption after a separate chlorine-dosing problem; 15 injuries were reported.",
    unresolved:"Exact alarm paths, local safety interlocks, and whether alternative notification systems functioned.",signal:"German safety-agency findings and operator technical incident report.",
  },
  {
    id:"france-refrigeration",title:"French industrial-refrigeration controller incidents",place:"France · multi-site impact",country:"France",lat:46.9,lon:2.3,precision:"region",category:"industrial",evidence:"reported",eventDate:"2026-10-11",reportedDate:"2026-11-15",updates:[14],
    summary:"French government attributed malicious controller activity across commercial refrigeration sites. The marker is a country-level impact label, not the attack origin.",
    unresolved:"Attribution corroboration, site-level equipment controls and verification of claimed physical damage.",signal:"French forensic annexes, affected controller vendor disclosures, CISA industrial advisories.",
  },
  {
    id:"arkea-france",title:"Crédit Mutuel Arkéa supplier-access payment fraud",place:"France · financial impact",country:"France",lat:47.75,lon:-3.65,precision:"region",category:"finance",evidence:"reported",eventDate:"2026-11-01",reportedDate:"2026-11-15",updates:[17],
    summary:"The bank described roughly €100 million in fraudulent instant payments after a compromised third-party service relationship. Location represents affected institution, not attacker or transfer origin.",
    unresolved:"Authorization controls, exact loss recovery and why some activity continued after supplier disconnection.",signal:"Bank's forensic report, payment network controls and recovery accounting.",
  },
  {
    id:"taiwan-tsmc",title:"TSMC employee-data disclosure",place:"Taiwan · national context",country:"Taiwan",lat:24.25,lon:120.95,precision:"region",category:"cloud",evidence:"documented",eventDate:"2026-11-12",reportedDate:"2026-11-12",updates:[0],
    summary:"TSMC disclosed unauthorized employee-data publication matching records held by an external cloud provider. This is a regional context marker, not a geolocated intrusion.",
    unresolved:"Access path, responsible actor and affected population; no proven relationship to Microsoft outage.",signal:"TSMC amended filings and cloud provider's incident analysis.",
  },
  {
    id:"raf-lakenheath",title:"RAF Lakenheath suspected drone security response",place:"Suffolk, United Kingdom",country:"United Kingdom",lat:52.41,lon:0.56,precision:"region",category:"security",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[10],
    summary:"U.S. base and British authorities reported a security response and shelter-in-place after suspected unauthorized aerial activity, without confirmed damage.",
    unresolved:"Physical aircraft/drone verification, operator and intent.",signal:"UK MoD/USAFE investigation or authenticated defense notice.",
  },
  {
    id:"raf-mildenhall",title:"RAF Mildenhall precautionary aircraft relocation",place:"Suffolk, United Kingdom",country:"United Kingdom",lat:52.36,lon:0.49,precision:"region",category:"security",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[10],
    summary:"A separate precautionary aircraft-relocation report. Its timing does not establish involvement in the Lakenheath incident.",
    unresolved:"Operational rationale and any documented common security alert.",signal:"U.S. Air Force or UK Ministry of Defence records.",
  },
  {
    id:"raf-fairford",title:"RAF Fairford national-security investigation",place:"Gloucestershire, United Kingdom",country:"United Kingdom",lat:51.682,lon:-1.79,precision:"region",category:"security",evidence:"reported",eventDate:"2026-11-12",reportedDate:"2026-11-14",updates:[10],
    summary:"UK authorities disclosed separate national-security charges; attribution in that case cannot be transferred to Lakenheath.",
    unresolved:"Case evidence and whether any particular site was endangered.",signal:"UK prosecutorial records and court findings.",
  },
  {
    id:"bahrain-nov13",title:"Bahrain radar-strike claim · November 13",place:"Bahrain · reported radar area",country:"Bahrain",lat:26.05,lon:50.56,precision:"region",category:"security",evidence:"disputed",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[3],
    summary:"Iran claimed a U.S. early-warning radar was destroyed; U.S. CENTCOM said drones were intercepted without reported damage. Claimed destruction remains unverified.",
    unresolved:"Independent battle-damage assessment and targeting evidence.",signal:"CENTCOM documentation, satellite imagery and validated facility damage report.",
  },
  {
    id:"bahrain-nov15",title:"Bahrain aerial interceptions and disputed radar claim",place:"Riffa region, Bahrain",country:"Bahrain",lat:26.13,lon:50.54,precision:"region",category:"security",evidence:"disputed",eventDate:"2026-11-15",reportedDate:"2026-11-15",updates:[12,16],
    summary:"Bahraini military reports interceptions; Iranian claims of successful radar strikes remain contested and independently unverified.",
    unresolved:"Number of drones, impact sites, actual damage and attribution of specific outcomes.",signal:"Bahrain Defence Force, CENTCOM or independent geospatial battle-damage confirmation.",
  },
  {
    id:"riyadh-intercepts",title:"Riyadh missile-interception reports",place:"Riyadh region, Saudi Arabia",country:"Saudi Arabia",lat:24.7136,lon:46.6753,precision:"region",category:"security",evidence:"reported",eventDate:"2026-11-15",reportedDate:"2026-11-15",updates:[12],
    summary:"The Saudi-led coalition reported intercepting missiles directed toward Riyadh; reported interceptions do not prove damage to critical infrastructure.",
    unresolved:"Full interceptor telemetry, launch provenance and debris damage.",signal:"Official defense assessment and independently verified impact records.",
  },
  {
    id:"saudi-eastern",title:"Eastern Province drone-interception reports",place:"Eastern Province, Saudi Arabia",country:"Saudi Arabia",lat:26.35,lon:49.9,precision:"region",category:"security",evidence:"reported",eventDate:"2026-11-15",reportedDate:"2026-11-15",updates:[12],
    summary:"Sequential official reports described multiple drone interceptions in the Eastern Province; no independently established oil-facility strike.",
    unresolved:"Exact sites and any operational effect.",signal:"Saudi defense and energy-operator bulletins.",
  },
  {
    id:"oman-didamar",title:"Didamar Island navigation-aid attack report",place:"Didamar Island, Oman",country:"Oman",lat:26.4815,lon:56.5381,precision:"site",category:"maritime",evidence:"reported",eventDate:"2026-11-10",reportedDate:"2026-11-15",updates:[12],
    summary:"Reuters sources reported an attack; visible smoke and thermal activity did not independently prove navigation systems were destroyed or shipping interrupted.",
    unresolved:"Equipment status, actual damage, whether navigational services experienced an outage.",signal:"Omani authority, IALA or NAVTEX notice documenting aid status.",
  },
  {
    id:"hormuz-ukmto",title:"Hormuz tanker warnings #205 / #207 / #208",place:"Strait of Hormuz · broad corridor",country:"Oman / Iran waters",lat:26.35,lon:56.3,precision:"approximate",category:"maritime",evidence:"reported",eventDate:"2026-11-16",reportedDate:"2026-11-16",updates:[23,30,37],
    summary:"UKMTO published multiple reported tanker danger notices, including engine-room fires. Unnamed vessels in #207 and #208 are NOT yet deconflicted as distinct casualties.",
    unresolved:"Vessel identities, possible duplicate incident reports, origin of projectile and damage.",signal:"UKMTO correction, ship IMO/MMSI, SAR/AIS corroboration and Coast Guard updates.",
  },
  {
    id:"gulf-ras-al-khaimah",title:"Gulf tanker engine-room strike report",place:"Near Ra's al Khaymah, United Arab Emirates",country:"United Arab Emirates",lat:25.94,lon:55.92,precision:"approximate",category:"maritime",evidence:"reported",eventDate:"2026-11-11",reportedDate:"2026-11-14",updates:[10],
    summary:"UKMTO #204 records a reported unknown-projectile strike and crew evacuation in the Arabian Gulf.",
    unresolved:"Attacker, weapon and final damage assessment.",signal:"UKMTO technical update and identified vessel/master report.",
  },
  {
    id:"hormuz-early-reports",title:"Earlier Hormuz projectile incidents",place:"Strait of Hormuz · broad sector",country:"Oman / Iran waters",lat:26.58,lon:56.65,precision:"approximate",category:"maritime",evidence:"reported",eventDate:"2026-11-08",reportedDate:"2026-11-14",updates:[4,10],
    summary:"Separate November 8–11 UKMTO incident notices describe projectile encounters; these do not corroborate later Iranian mine claims.",
    unresolved:"Weapon classification, independent casualty verification and vessel identities.",signal:"Updated UKMTO bulletin with identified vessel and attributable forensic evidence.",
  },
  {
    id:"bab-el-mandeb",title:"Bab el-Mandeb coastal withdrawal and shipping exposure",place:"Dhubab / Bab el-Mandeb, Yemen",country:"Yemen",lat:12.59,lon:43.38,precision:"region",category:"maritime",evidence:"reported",eventDate:"2026-11-15",reportedDate:"2026-11-15",updates:[15],
    summary:"Saudi-backed Yemeni forces reported withdrawal near the southern Red Sea chokepoint; no completed strait closure or attack is established by the withdrawal alone.",
    unresolved:"Control of exact positions, maritime traffic consequences and new verified attacks.",signal:"MARAD/UKMTO restrictions and independently confirmed vessel transit disruption.",
  },
  {
    id:"socotra-armed-skiff",title:"Suspicious armed-skiff approach off Socotra",place:"Arabian Sea, east of Socotra · approximate sector",country:"International waters",lat:12.3,lon:61.2,precision:"approximate",category:"maritime",evidence:"reported",eventDate:"2026-11-16",reportedDate:"2026-11-16",updates:[29],
    summary:"UKMTO #206 documents suspicious armed activity and possible boarding preparation, not a confirmed boarding or hijacking. Pin is derived from a broad reported offset, not GPS.",
    unresolved:"Ship identity and armed group's intent or affiliation.",signal:"UKMTO incident upgrade, vessel statement or naval response.",
  },
  {
    id:"romania-sulina-triple",title:"Three merchant vessels struck near Sulina",place:"Danube Delta / Sulina waters, Romania",country:"Romania",lat:45.14,lon:29.72,precision:"region",category:"maritime",evidence:"reported",eventDate:"2026-11-14",reportedDate:"2026-11-15",updates:[12,20],
    summary:"Romanian authorities identify Evia Petrol V, Marsol and Ali Najafov in the overnight attack reports. Marker represents coastal sector; not the precise vessels.",
    unresolved:"Attack platform origin and any additional verified maritime casualties.",signal:"Romanian MApN investigation and hydrographic warnings.",
  },
  {
    id:"romania-larissa",title:"Larissa 1 earlier vessel-damage report",place:"Danube mouth, Romania · regional",country:"Romania",lat:45.16,lon:29.65,precision:"region",category:"maritime",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-15",updates:[12,20],
    summary:"A separately dated reported vessel strike; not a fourth ship in the November 14–15 overnight group.",
    unresolved:"Precise location and launching actor.",signal:"Romanian maritime incident report and vessel/operator confirmation.",
  },
  {
    id:"romania-marina-m",title:"MARIAM M drifting vessel reclassified as stranded",place:"Romanian Black Sea · published coordinate",country:"Romania",lat:44.41055,lon:28.7575,precision:"site",category:"maritime",evidence:"documented",eventDate:"2026-11-15",reportedDate:"2026-11-16",updates:[27,33],
    summary:"Romania's hydrographic authority moved from drift warning to stranded-and-dangerous-to-navigation notice. Published coordinates are for navigation; no sabotage finding.",
    unresolved:"Vessel condition, cause of stranding and salvage route.",signal:"ARN follow-up/revocation and vessel recovery bulletin.",
  },
  {
    id:"romania-danger-area",title:"Romanian Black Sea dangerous-navigation warning",place:"Northwestern Black Sea · area, not a point",country:"Romania offshore",lat:44.64,lon:29.7,precision:"approximate",category:"maritime",evidence:"documented",eventDate:"2026-11-15",reportedDate:"2026-11-16",updates:[27],
    summary:"ARN 172/2026 advised vessels to avoid a defined area because of unidentified floating objects; it did not formally close the sea lane or identify mines.",
    unresolved:"Object classification, exact restricted navigation consequences.",signal:"Subsequent Romanian navigational notices and clearance advisories.",
  },
  {
    id:"romania-offshore-routes",title:"Romanian offshore-platform service-route advisory",place:"Romania offshore service corridor · representative marker",country:"Romania",lat:44.07,lon:29.98,precision:"region",category:"maritime",evidence:"documented",eventDate:"2026-11-16",reportedDate:"2026-11-16",updates:[33],
    summary:"Hydrographic notice recommends service routes for offshore platforms. It is a navigation measure, not evidence that a platform was attacked.",
    unresolved:"Effects on actual shipping or platform operations.",signal:"Platform/operator bulletins and revised navigation advisories.",
  },
  {
    id:"bulgaria-betul",title:"BETUL 8 capsizing and multinational rescue",place:"Southeast of Cape Kaliakra · approximate sector",country:"Bulgaria offshore",lat:42.91,lon:29.18,precision:"approximate",category:"maritime",evidence:"documented",eventDate:"2026-11-16",reportedDate:"2026-11-16",updates:[34],
    summary:"Bulgaria confirmed vessel capsizing and rescue of 12 crew. Crew-reported sea-drone strikes have not been independently established as the cause.",
    unresolved:"Vessel forensic condition, cause, spill risk and allegation of drone impacts.",signal:"Bulgarian Transport Ministry or rescue authority final report.",
  },
  {
    id:"oman-shipping-piracy",title:"Gulf / Arabian Sea shipping security environment",place:"Arabian Sea regional context",country:"International waters",lat:15.5,lon:58.8,precision:"approximate",category:"maritime",evidence:"reported",eventDate:"2026-11-12",reportedDate:"2026-11-16",updates:[10,15,29,32],
    summary:"Maritime advisories cover multiple independently documented threats and warnings. The plotted location illustrates the sea area, not a new attack.",
    unresolved:"Attribution and changing vessel-routing behavior.",signal:"NAVAREA, MARAD and JMIC operational notices.",
  },
  {
    id:"gulf-jmic-data",title:"JMIC Hormuz congestion / GNSS-interference assessment",place:"Strait of Hormuz regional monitoring",country:"International waters",lat:25.98,lon:56.9,precision:"region",category:"maritime",evidence:"documented",eventDate:"2026-11-12",reportedDate:"2026-11-16",updates:[32],
    summary:"JMIC reports U.S.-facilitated transits, anchorage counts, and GNSS/AIS anomalies across different measurement populations; do not combine denominators.",
    unresolved:"Root causes of individual electronic-navigation anomalies and vessel-level effects.",signal:"JMIC subsequent reporting with the same time windows and observation method.",
  },
];

export const DISTRIBUTED_INCIDENTS: ReadonlyArray<AtlasIncident> = [
  {
    id:"microsoft-global",title:"Microsoft 365 worldwide service cascade",place:"Distributed cloud service — no single failure location",country:"Global",lat:null,lon:null,precision:"distributed",category:"cloud",evidence:"reported",eventDate:"2026-11-12",reportedDate:"2026-11-16",updates:[0,1,4,5,31],
    summary:"Microsoft's November 16 engineering account describes interacting gateway-capacity, software and failover failures. A server health-check cascade affected dependent services.",
    unresolved:"Final vendor postmortem and scope across tenants; no evidence this outage was caused by a cyberattack.",signal:"Final Microsoft incident review, operator notices and recurrence reports.",
  },
  {
    id:"microsoft-phishing",title:"Outage-themed Microsoft phishing campaigns",place:"Distributed digital threat, not geolocatable",country:"Global",lat:null,lon:null,precision:"distributed",category:"security",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[5],
    summary:"Microsoft documented exploitation of genuine incident identifiers in phishing; this does not prove phishing caused the outage.",
    unresolved:"Actor, recipient impact and credential theft success.",signal:"Microsoft Threat Intelligence updates and documented credential-compromise records.",
  },
  {
    id:"l3harris-ftis",title:"FAA vendor ownership and future network transition",place:"U.S. national telecommunications program",country:"United States",lat:null,lon:null,precision:"distributed",category:"aviation",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[2,5,7,19,22,28,35],
    summary:"L3Harris existing FTI, AT&T future FENS and Peraton system-integrator mandates are distinct. Contract governance cannot be inferred from equipment proximity.",
    unresolved:"Specific change-control approvals and contractor liability.",signal:"FAA procurement/technical reports, integration acceptance records.",
  },
  {
    id:"flight-recovery",title:"U.S. aviation cancellations and airline recovery",place:"National operational impact, not one point",country:"United States",lat:null,lon:null,precision:"distributed",category:"aviation",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-16",updates:[2,6,8,9,35],
    summary:"A nationwide ground stop had secondary airline scheduling impacts that lasted after FAA service restoration; successive cancellation snapshots use different scopes and times.",
    unresolved:"Total unique flight disruptions and cost.",signal:"FAA/FlightAware dated comparable aggregates and airline statements.",
  },
  {
    id:"fedwire-status",title:"Fedwire / Clearing House status monitoring",place:"National financial infrastructure; no outage-origin pin",country:"United States",lat:null,lon:null,precision:"distributed",category:"finance",evidence:"reported",eventDate:"2026-11-12",reportedDate:"2026-11-16",updates:[1,8],
    summary:"Historical third-party status reports and a rescheduled Fedwire standards release require different treatment from an operator-confirmed system outage.",
    unresolved:"Historical Federal Reserve incident notice detail; no proven nationwide bank compromise.",signal:"Federal Reserve and Clearing House timestamped operator advisories.",
  },
  {
    id:"paysafe-payments",title:"Paysafe merchant-processing delay reports",place:"Multi-merchant payment system",country:"Global",lat:null,lon:null,precision:"distributed",category:"finance",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[1],
    summary:"Merchant-processing delay reporting; no proven relation to FAA, Microsoft or Fedwire causes.",
    unresolved:"Affected merchant population and network pathways.",signal:"Processor outage report and independent settlement-rail notices.",
  },
  {
    id:"chase-plaid",title:"Chase payment delays and Plaid connection disruption",place:"National banking connections",country:"United States",lat:null,lon:null,precision:"distributed",category:"finance",evidence:"documented",eventDate:"2026-11-16",reportedDate:"2026-11-16",updates:[36],
    summary:"Chase acknowledged delayed transactions and Plaid documented a subset of impaired connections. Systemic central-payment compromise not established.",
    unresolved:"Detailed root cause and exact settlement versus API dependency.",signal:"Chase and Plaid post-incident notices with end times.",
  },
  {
    id:"cursor-fireworks",title:"Fireworks–Cursor developer-supply-chain compromise",place:"Cloud/marketplace trust boundary, not a physical attack site",country:"Global",lat:null,lon:null,precision:"distributed",category:"cloud",evidence:"documented",eventDate:"2026-10-29",reportedDate:"2026-11-15",updates:[6,18],
    summary:"Cursor's published chronology traces credential exposure through cloud-service access into malicious extension distribution. Microsoft independently analyzed malicious extension code.",
    unresolved:"Per-endpoint compromise, identity theft and affected-machine count.",signal:"Provider remediation, extension integrity and customer forensics.",
  },
  {
    id:"notion-uber-data",title:"Notion and Uber separately disclosed data incidents",place:"Distributed vendor and customer records",country:"Global",lat:null,lon:null,precision:"distributed",category:"cloud",evidence:"reported",eventDate:"2026-10-23",reportedDate:"2026-11-14",updates:[6],
    summary:"Separate access and data exposures; the article does not establish a common credential path.",
    unresolved:"Exact overlapping victims and any direct linkage.",signal:"Updated vendor breach notices and independent indicators.",
  },
  {
    id:"binance-wallet",title:"Binance signing-service theft and recovery",place:"Digital custody and chain networks",country:"Global",lat:null,lon:null,precision:"distributed",category:"crypto",evidence:"reported",eventDate:"2026-10-29",reportedDate:"2026-11-14",updates:[6],
    summary:"Reported large-scale custody theft and withdrawal recovery; the FBI's attribution applies to this case, not other incidents in Issue #200.",
    unresolved:"Complete asset tracing and restitution.",signal:"Exchange attestations and verifiable transaction identifiers.",
  },
  {
    id:"wfx-github",title:"wfx-loot GitHub Actions / CI credential campaign",place:"Distributed repositories and cloud identities",country:"Global",lat:null,lon:null,precision:"distributed",category:"security",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-15",updates:[25],
    summary:"Security researchers documented stolen GitHub credentials, malicious workflow commits and attempted cloud-identity persistence.",
    unresolved:"Independent deduplication of affected repositories and success rates.",signal:"GitHub advisories, code-signing evidence and cloud identity audit records.",
  },
  {
    id:"screenconnect-sckit",title:"ScreenConnect / SCKit remote-management compromise",place:"Distributed IT support systems",country:"Global",lat:null,lon:null,precision:"distributed",category:"security",evidence:"documented",eventDate:"2026-11-11",reportedDate:"2026-11-15",updates:[24],
    summary:"Two observed waves of malicious remote-support activity; measured affected computers are not necessarily unique organizations or all successfully lateral-moved targets.",
    unresolved:"Actual cross-tenant propagation and technician-session compromise.",signal:"ConnectWise and endpoint-vendor remediation/telemetry.",
  },
  {
    id:"checkpoint-esxi",title:"Check Point gateway to ESXi intrusion chain",place:"Distributed firewall / virtualization infrastructure",country:"Global",lat:null,lon:null,precision:"distributed",category:"security",evidence:"documented",eventDate:"2026-10-01",reportedDate:"2026-11-15",updates:[21],
    summary:"Check Point documented compromise paths involving exposed gateways, elevated privileges and virtualization targets; CISA issued remediation guidance.",
    unresolved:"Attacker identity and total affected estate.",signal:"Vendor CVE advisories, CISA exploitation updates and endpoint forensics.",
  },
  {
    id:"btc-dormant",title:"Two distinct dormant-Bitcoin movements",place:"Blockchain ledger activity — not a geographic event",country:"On-chain",lat:null,lon:null,precision:"distributed",category:"crypto",evidence:"reported",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[1],
    summary:"100 BTC from 2010 outputs and 75 BTC from a separate 2011-noticed wallet were reported moved. Neither movement proves owner identity or incident coordination.",
    unresolved:"Exact wallet ownership and motive.",signal:"Primary transaction IDs and spend-path confirmation.",
  },
  {
    id:"nws-radar",title:"NWS radar rumor corrected",place:"U.S. weather system; no nationwide radar failure",country:"United States",lat:null,lon:null,precision:"distributed",category:"industrial",evidence:"documented",eventDate:"2026-11-13",reportedDate:"2026-11-14",updates:[1],
    summary:"NWS said the radar network and radar website remained operational; social claims of a nationwide radar shutdown were inaccurate.",
    unresolved:"Specific weather-product availability issues, if separately reported.",signal:"NWS official outage messages.",
  },
];

export const ATLAS_ALL_INCIDENTS = [...ATLAS_INCIDENTS, ...DISTRIBUTED_INCIDENTS] as const;

export const ATLASEVIDENCE_RELATIONS: ReadonlyArray<{
  from:string;to:string;type:"same_investigation"|"documented_dependency"|"reported_consequence"|"unresolved_overlap";
  label:string;update:number;
}> = [
  { from:"faa-el-dorado",to:"faa-amarillo",type:"same_investigation",label:"FAA names two sites; technical cause unresolved.",update:19 },
  { from:"microsoft-global",to:"hotel-bruehl",type:"reported_consequence",label:"Hotel operator reports missed email safety warnings during outage; separate chemical-equipment failure.",update:36 },
  { from:"cursor-fireworks",to:"notion-uber-data",type:"unresolved_overlap",label:"Different vendor disclosures; no shared access path proven.",update:6 },
  { from:"hormuz-ukmto",to:"gulf-jmic-data",type:"unresolved_overlap",label:"Same shipping corridor; warnings and GNSS statistics are not a proven shared cause.",update:32 },
  { from:"romania-sulina-triple",to:"romania-danger-area",type:"unresolved_overlap",label:"Coastal danger warnings followed attacks; unidentified objects not classified.",update:27 },
];
