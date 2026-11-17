/**
 * Read-only, explicitly dated fall-back for preview environments without the
 * Supabase public client runtime. NOT a mirror of the full article or a live feed.
 * Never replaces the actual published issue when the live source is available.
 */
import type { ZenPublicationArticle, ZenPublicationBlock } from "../publication";
import { ATLAS_ALL_INCIDENTS, ISSUE_200_ID } from "./atlas-data";

export const SNAPSHOT_VERIFIED_AT = "2026-11-16T18:48:00-05:00";
export const SNAPSHOT_LAST_UPDATE = 37;
const sections: ZenPublicationBlock[] = Array.from({length:SNAPSHOT_LAST_UPDATE+1},(_,pos)=>{
  const related=ATLAS_ALL_INCIDENTS.filter(item=>item.updates.includes(pos)).slice(0,2);
  const headline=related.map(r=>r.title).join(" / ");
  return {
    id:`preview-snapshot-reference-${pos}`,
    issueId:ISSUE_200_ID,
    kind:"markdown",
    position:pos,
    heading:pos===0?"Original November 12 investigation":`DEVELOPING STORY — UPDATE ${String(pos).padStart(3,"0")}: ${headline||"Published record"}`,
    body:"This preview contains a dated editorial index, not the full source text. Open the canonical Issue #200 publication to read this original, unshortened update and its primary citations.",
    media:{},
  };
});

export const SNAPSHOT_ISSUE_200: ZenPublicationArticle={
  id:ISSUE_200_ID,
  publicationType:"weekly",
  issueDate:"2026-11-12",
  editionNumber:200,
  title:"WHEN THE SYSTEM THAT RUNS THE WORLD FAILS: MICROSOFT’S CASCADE, TSMC’S DATA BREACH, AND THE HIDDEN FRAGILITY OF OUR INTELLIGENT CIVILIZATION | ZEN WEEKLY | Issue #200",
  summary:"Curated, dated geospatial index of the original ZEN Weekly Issue #200 investigation. Live Supabase data must be restored for real-time updates and full-text sources.",
  coverUrl:null,
  coverAlt:"",
  byline:"ZEN AI Co.",
  category:"Infrastructure and security",
  tags:["infrastructure","security","aviation","maritime","cloud"],
  status:"published",
  publishedAt:"2026-11-13T16:25:00.000Z",
  updatedAt:SNAPSHOT_VERIFIED_AT,
  canonicalPath:"/zen-weekly/when-the-system-that-runs-the-world-fails-microsoft-s-cascade-tsmc-s-data-breach--3d64f3e5-2906-4029-a977-b547346ed66f",
  sections,
};
