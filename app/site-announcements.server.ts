import "server-only";

import { readPublicRpc } from "./managed-pages.server";
import {
  normalizeZenSiteAnnouncement,
  type ZenSiteAnnouncement,
} from "./site-announcements";

const ZEN_SITE_KEY = "zen_world";

export async function listVisibleZenSiteAnnouncements(): Promise<
  ZenSiteAnnouncement[]
> {
  const rows = await readPublicRpc("list_visible_site_announcements", {
    requested_site_key: ZEN_SITE_KEY,
  });

  return rows
    .map(normalizeZenSiteAnnouncement)
    .filter(
      (announcement): announcement is ZenSiteAnnouncement =>
        Boolean(announcement),
    );
}
