# zenai.world former-Wix migration control ledger

Updated: 2026-08-13
Source inventory snapshot: 2026-08-07

This ledger separates approved compatibility redirects from content and data that still require export or human classification. Unknown URLs intentionally remain unmapped instead of being sent to an unrelated destination merely to avoid a 404.

## Confirmed source inventory

| Wix-era source | Confirmed state | Migration treatment |
| --- | --- | --- |
| Online Programs | Two known AI Pioneer challenge URLs | Redirect to the canonical public ZEN Program discovery entry. Protected delivery continues in Arsenal. |
| Group directories | Nine group discussion entry points | Route group landing pages to Arsenal Community. |
| Group posts | 37 indexed posts in the reviewed sitemap sample | Return 410. The reviewed public feed contained unrelated spam and is not approved for migration. |
| Member profiles | No public URLs returned in the reviewed sitemap chunk | Preserve any private export for compliance; do not expose member data on the public site. |
| Company and legal pages | Homepage, official AI literacy source, ZEN Legacy Dossier, GEO2, policies, accessibility, Constitution, and Solutions | Retain canonical equivalents or explicit redirects in the gateway. |
| Blog / ZEN Weekly | Child sitemap was rate-limited during the prior inventory | Export and classify every article, author, date, canonical path, body, and media reference before mapping. |
| Store | Search inventory reported an All Products catalog with 72 products | Keep the catalog-level entry mapped to Arsenal Marketplace. Do not wildcard-map individual `/product-page/*` URLs until each product and any commerce obligations are classified. |
| Playground and experiments | Multiple indexed tools and simulators | Classify each as migrate, archive, replace with an Arsenal capability, or retire. Avoid generic homepage redirects. |

## Approved gateway mappings

| Former Wix route | Destination or status | Classification |
| --- | --- | --- |
| `/legacydossier` | `/legacy-dossier` | ZEN Legacy product |
| `/geo2` | `/work?category=accomplishments` | Public ZEN proof |
| `/ai-literacy-foundation-zen-ai-co-official-source` | `/work?category=initiatives` | Public ZEN information |
| `/arsenal` | `https://arsenal.world` | Arsenal discovery |
| `/solutions` | `/#solutions` | Smart Business Solutions |
| `/pricing` | Arsenal login with `next=/pricing` | Arsenal plan and billing surface |
| `/category/all-products` | Arsenal login with `next=/marketplace` | Marketplace catalog |
| Two approved Pioneer `/challenge-page/{id}` URLs | `/programs#pioneer` | Public Program discovery |
| `/programs/pioneer` | `/programs#pioneer` | Public Program discovery compatibility |
| `/programs/vanguard` | `/programs#vanguard` | Public Program discovery compatibility |
| `/groups` and former Wix group landing pages | `https://arsenal.world/community` | Arsenal Community |
| Individual `/group/.../discussion/{post}` URLs | `410 Gone` | Explicitly retired contaminated content |

## Deferred inventory

- Every individual `/product-page/*` URL.
- Unknown challenge, course, online-program, and Program URLs not listed above.
- ZEN Weekly and research article paths not yet tied to a reviewed public record.
- Merchandise URLs until destination commerce, fulfillment, refund, and subscription obligations are reconciled.
- Credential and proof URLs until the specific public record or Arsenal credential destination is confirmed.
- Playground, tool, and simulator URLs until each has an approved migrate, archive, replace, or retire decision.

## Required export package

1. Wix site and CMS content export with stable URL, title, metadata, canonical, body, publish and update dates, authors, and media.
2. Media library export with filenames, alt text, rights or consent owner, and source-page relationships.
3. Contacts, newsletter consent, form submissions, and suppression or unsubscribe records.
4. Store products, orders, refunds, fulfillment, subscriptions, taxes, discounts, and payment-provider references.
5. Program enrollments, member and group records, consent records, and minor-related data through a controlled private export.
6. Search Console and analytics baselines including indexed pages, queries, backlinks, traffic, conversions, and crawl errors.

## Approval gates

- Claim evidence: first-party Wix copy may become a ZEN company record, not independent verification.
- Partner identities: publish names and logos only with documented permission.
- Commerce: map or retire products only after open obligations are reconciled.
- Legal: obtain the required review for privacy, refunds, education, minors, accessibility, and jurisdiction language.
- Redirects: add a mapping only after the closest truthful destination is established.
