# Minnesota ICE Awareness Dashboard

Community awareness dashboard for Minnesota immigration enforcement activity. Built from scratch in our standard stack, inspired by [WorldMonitor](https://github.com/koala73/worldmonitor)'s OSINT dashboard patterns.

---

## Why Minnesota

Minnesota is the epicenter of the largest immigration enforcement operation in U.S. history. **Operation Metro Surge**, launched December 4, 2025, deployed ~2,700 federal agents to the Minneapolis-St. Paul metro area. As of February 2026:

- **3,000+ arrests** — only ~5% with violent crime records per ICE's own data
- **96+ court order violations** by ICE documented by a federal judge
- **Two fatal shootings** of U.S. citizens by federal agents (Renee Nicole Macklin Good on Jan 7; Alex Jeffrey Pretti on Jan 24)
- **50,000+ person general strike** on January 23 in subzero temps — largest U.S. general strike since 1946
- **700+ businesses** closed in solidarity
- **72% of all MN demonstrations** in January 2026 were pro-migration/anti-ICE (ACLED data)
- **Operation PARRIS** — parallel operation targeting ~5,600 refugees from travel-ban countries, many with legal status

The community needs a single, reliable dashboard for situational awareness, legal resources, and verified information.

---

## Approach: Build From Scratch, Not Port

WorldMonitor is useful as **inspiration and a reference for data patterns**, not as a codebase to port. Its core value to us:

**Copy from WorldMonitor:**
- Feed URL lists and credibility tier patterns
- Circuit breaker concept for unreliable data sources
- RSS proxy with domain allowlist pattern
- Stale-while-revalidate caching strategy
- Threat classification keyword approach (swap military terms for immigration enforcement)

**Ignore from WorldMonitor:**
- Vanilla TS + innerHTML rendering (we use React + shadcn)
- 213KB monolithic CSS (we use Tailwind)
- 2500-line God Object orchestrator (we use React hooks/contexts)
- Browser-side ML via ONNX (we use server-side AI SDK)
- D3/SVG mobile map fallback (react-map-gl handles mobile)
- Anything military, maritime, financial, or crypto

Building from scratch in our stack is faster than porting because shadcn gives us 80% of the panel UI for free, TanStack Query handles all data fetching patterns, and AI SDK replaces the entire Groq + ONNX hybrid pipeline.

---

## Tech Stack

Our standard stack — nothing new except the map library.

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router + Turbopack) | Standard |
| UI | React 19 + shadcn v4 | Card, Badge, Table, ScrollArea, Accordion, Switch |
| Styling | Tailwind CSS v4 | Zero custom CSS |
| Language | TypeScript 5.9 (strict) | Standard |
| Runtime | Bun | Standard |
| Linting | Biome | Standard |
| Map | react-map-gl + MapLibre GL | **New dep** — React wrapper for MapLibre, well-maintained |
| Data Fetching | TanStack Query | Polling, caching, stale states, deduplication — all built in |
| AI | AI SDK + Anthropic | Classification and daily briefs |
| Deployment | Vercel (death-note team) | Standard |

**Optional additions if needed later:**
- `@deck.gl/react` — only if MapLibre's built-in layers aren't enough (likely not needed for our use case)
- Upstash Redis — only if we need cross-user caching for AI classification results
- Supabase — only if we add user-submitted reports or community moderation

---

## Hosting: 8lee.ai/mn First, Then Extract

Build at `8lee.ai/mn` for fast iteration, extract to standalone domain when ready.

### File Structure

```
app/mn/
  layout.tsx              # MN-specific metadata, optional providers
  page.tsx                # Dashboard entry point
  components/
    mn-map.tsx            # MapLibre map with MN layers
    alert-panel.tsx       # Live alerts feed
    news-panel.tsx        # Filtered news from MN sources
    resources-panel.tsx   # KYR info, hotlines, legal aid
    stats-panel.tsx       # Enforcement stats (arrests, agents, court orders)
    detention-panel.tsx   # Facility status and 287(g) tracker
    legal-panel.tsx       # Active lawsuits and court rulings
  lib/
    config.ts             # Feed URLs, keywords, geo coordinates, facility data
    hooks.ts              # TanStack Query hooks for each data source
    types.ts              # NewsItem, Facility, AlertLevel, etc.
    classify.ts           # Client-side keyword matcher (fast path)
app/api/mn/
  rss/route.ts            # RSS proxy with domain allowlist
  classify/route.ts       # AI SDK classification (slow path, for ambiguous items)
  brief/route.ts          # Daily AI situation summary
```

### Isolation Rules

**Allowed imports from 8leeai:**
- `lib/utils.ts` — `cn()`, `openExternalLink()`, `focusRing()`
- `contexts/theme-context.tsx` — `useTheme()`
- shadcn components from `components/ui/`

**No imports from:** terminal components, command router, portfolio data

**proxy.ts change:** Add `pathname.startsWith("/mn")` to the skip condition.

### Extraction (When Ready)

1. Copy `app/mn/` and `app/api/mn/` to new project
2. Copy shared utils and shadcn components
3. New Vercel project, new domain — done

---

## Dashboard Panels

Start with **6 panels**. Add more later if needed. Resist scope creep.

### MVP Panels

| Panel | shadcn Components | Data Source |
|-------|------------------|-------------|
| **Map** | (react-map-gl) | Static geo data + ACLED API |
| **Live Alerts** | Card, ScrollArea, Badge | RSS feeds, classified by severity |
| **News Feed** | Card, ScrollArea | RSS feeds from 12 MN sources |
| **Community Resources** | Accordion, Card | Static data (hotlines, KYR, legal aid) |
| **Enforcement Stats** | Card (stat cards) | Scraped/manual data, updated as available |
| **Detention & 287(g)** | Table, Badge | Static data + manual updates |

### Post-MVP Panels (add later)

| Panel | Purpose |
|-------|---------|
| **Legal Tracker** | Active lawsuits, court dates, rulings |
| **Policy Watch** | Federal actions, state responses |
| **AI Situation Brief** | Daily AI-generated summary |
| **My Monitors** | Custom keyword alerts (localStorage) |
| **Protest Monitor** | ACLED demonstration data with map integration |

### Layout

Responsive CSS Grid via Tailwind:
```
Mobile:  1 column (map stacked on top, panels below)
Tablet:  2 columns (map spans full width above)
Desktop: 3 columns (map takes 2 cols, panels fill remaining space)
```

The map is the hero. On mobile it's the first thing you see.

---

## Data Sources

### Tier 1 — Structured Data with API/Query Access

| Source | URL | Data Type | Update Frequency |
|--------|-----|-----------|-----------------|
| **TRAC Immigration** (Syracuse) | https://tracreports.org/immigration/tools/ | Arrests, detentions, court data, removals. FOIA-obtained. Data from Oct 1991-present. | Varies (monthly-quarterly) |
| **Immigration Enforcement Dashboard** | https://enforcementdashboard.com/ | Filterable by state, gender, criminal history, age, citizenship. Charts + maps. | Regular |
| **Deportation Data Project** | https://deportationdata.org/ | Individual-level anonymized enforcement datasets (arrests, removals). Created by Austin Kocher. | Regular |
| **ICE ERO Statistics** | https://www.ice.gov/statistics | Official arrests, detentions, removals, ATD data. Searchable by ERO field office. | Quarterly |
| **Data.gov ICE Datasets** | https://catalog.data.gov/dataset?publisher=ICE | Federal open data with API access | Varies |
| **ACLED** | https://acleddata.com/ | Protest/demonstration event data with geolocation. MN-specific analysis available. | Weekly |
| **Deportation Tracker Live** | https://deportationtracker.live/ | Real-time ICE raid tracker | Real-time |
| **House Oversight Dashboard** | https://oversightdemocrats.house.gov/immigration-dashboard | Congressional enforcement data tracker | Regular |

### Tier 2 — Structured Data (Manual Collection/Scraping)

| Source | URL | Data Type |
|--------|-----|-----------|
| **EOIR Court Hearing Portal** | https://portal.ice.gov/eoir | Immigration court hearing search |
| **DHS OHSS Monthly Tables** | https://ohss.dhs.gov/topics/immigration/immigration-enforcement/monthly-tables | Monthly enforcement and legal process tables |
| **ICE Detentions (OHSS)** | https://ohss.dhs.gov/khsm/ice-detentions | Detention data from Enforcement Integrated Database |
| **Vera Institute Dashboard** | https://www.vera.org/ending-mass-incarceration/reducing-incarceration/detention-of-immigrants/advancing-universal-representation-initiative/immigration-court-legal-representation-dashboard | Legal representation rates in immigration courts |
| **MN State Demographic Center** | https://mn.gov/admin/demography/data-by-topic/immigration-language/ | State immigration and language data |
| **MN Compass** | https://www.mncompass.org/topics/demographics/immigration | MN demographic data by immigrant group |
| **Migration Policy Institute - MN** | https://www.migrationpolicy.org/data/state-profiles/state/demographics/MN | State-level demographics |
| **MPI Unauthorized Population** | https://www.migrationpolicy.org/data/unauthorized-immigrant-population/state/MN | Unauthorized population estimates |
| **Center for Migration Studies** | https://data.cmsny.org/ | State/national immigration data tool |
| **Immigration Policy Tracking Project** | https://immpolicytracking.org/ | Policy change tracker including Operation PARRIS |
| **Prison Policy Initiative** | https://www.prisonpolicy.org/blog/2025/12/11/ice-jails-update/ | ICE arrest data, state/local cooperation patterns |

### Tier 3 — News Sources (RSS Feeds)

| Source | URL | Coverage Focus |
|--------|-----|---------------|
| **MPR News - Live Updates** | https://www.mprnews.org/live-updates | Real-time MN updates |
| **MPR News - ICE in Minnesota** | https://www.mprnews.org/ice-in-minnesota | Dedicated topic page |
| **Sahan Journal** | https://sahanjournal.com/ | Immigrant communities, surveillance tech, racial profiling, Operation PARRIS |
| **Star Tribune** | https://www.startribune.com/ice-raids-minnesota/601546426 | Rolling coverage. Whistleblower tips: whistleblower@startribune.com |
| **Minnesota Reformer** | https://minnesotareformer.com/ | ICE impacts on children, economy, legal developments, cell tracking |
| **Unicorn Riot** | https://unicornriot.ninja/ | Daily "ICE in Minnesota - Day XX" series, live protest streaming |
| **Bring Me The News** | https://bringmethenews.com/ | Daily incident lists |
| **Axios Twin Cities** | https://www.axios.com/local/twin-cities/ | Policy-focused updates |
| **KSTP** | https://kstp.com/ | Local TV, legal developments, AG opinions |
| **CBS Minnesota (WCCO)** | https://www.cbsnews.com/minnesota/ | Investigative: detention locations, county agreements |
| **FOX 9** | https://www.fox9.com/ | Workplace raids, construction site enforcement |
| **Democracy Now** | https://www.democracynow.org/ | National coverage with MN focus |

### Tier 4 — Community Rapid Response (Real-Time, Unstructured)

| Source | Contact | Role |
|--------|---------|------|
| **Immigrant Defense Network (IDN)** | 612-255-3112 | 90+ org network, rapid response dispatch |
| **Monarca Rapid Response** | 612-441-2881 | Community alert line |
| **ILCM Detention Line** | (651) 641-1011 (Mon-Thu 1-3pm) | Legal intake for detained individuals |
| **Defend the 612** | Signal-based (no public URL) | ICE-watching via encrypted messaging, 1000+ signups after each fatal shooting |
| **ICE ERO Minnesota** | 612-843-8600 | Official ICE field office |

---

## Map Data

### ICE Facilities and Detention Centers

| Facility | Location | Type |
|----------|----------|------|
| **Whipple Federal Building** | Minneapolis | Initial processing/intake |
| **Fort Snelling** | Minneapolis/St. Paul | Processing (Operation PARRIS) |
| **Sherburne County Jail** | Elk River | 287(g) jail enforcement model |
| **Freeborn County Jail** | Albert Lea | 287(g) warrant service officer |
| **Kandiyohi County Jail** | Willmar | 287(g) warrant service officer |
| **Crow Wing County Jail** | Brainerd | 287(g) warrant service officer |
| **Cass County Jail** | Walker | 287(g) agreement |
| **Itasca County Jail** | Grand Rapids | 287(g) agreement |
| **Jackson County Jail** | Jackson | 287(g) agreement |
| **Mille Lacs County Jail** | Milaca | 287(g) agreement |

### Map Layers (MVP)

1. **Detention facilities** — ScatterplotLayer, red markers
2. **287(g) counties** — GeoJSON fill, highlighted boundaries (8 counties)
3. **Sanctuary jurisdictions** — GeoJSON fill, different color (Minneapolis, St. Paul, Hennepin, Ramsey)
4. **Community resources** — Legal aid offices, org HQs, green markers

### Map Layers (Post-MVP)

5. **ACLED protest events** — filtered to MN, sized by participant count
6. **Verified enforcement incidents** — from news reports, timestamped
7. **Immigration courts** — Minneapolis location
8. **Affected school districts** — Duluth, Fridley, others

### Map Config

- Center: Minneapolis-St. Paul metro (lat: 44.9778, lng: -93.2650, zoom: 8)
- Zoom out to see full state (lat: 46.7296, lng: -94.6859, zoom: 6)
- Base tiles: MapLibre with free tile provider (MapTiler, Stadia, or Protomaps)
- Dark theme default (matches 8leeai aesthetic)

---

## Community Organizations

| Organization | URL | Role |
|-------------|-----|------|
| **Immigrant Defense Network (IDN)** | https://immigrantdefensenetwork.org/ | Statewide 90+ org network, rapid response, expanding ICE observer trainings to 30+ Midwest cities |
| **MIRAC** | https://www.miracmn.com/ | All-volunteer grassroots since 2006, campaigns for legalization, community education |
| **ILCM** | https://www.ilcm.org/ | Free immigration legal representation, KYR resources, detention intake |
| **ACLU of Minnesota** | https://www.aclu-mn.org/ | Class-action lawsuits, 287(g) challenges, rights documentation |
| **Defend the 612** | Signal-based | Street-level ICE monitoring, observer trainings |
| **Unidos MN** (fka Navigate MN) | — | Immigrant young adult leadership, healthcare worker resistance training |
| **CTUL** | — | Worker power, fair wages, workplace raid prevention |
| **Indivisible Twin Cities** | — | Protest coordination, organized general strike |
| **ICE OUT OF MINNESOTA** | — | Broad coalition organizing mass actions |
| **MN Council of Nonprofits** | https://minnesotanonprofits.org/community-resources-ice-operations | Community resources hub |

### Know Your Rights Resources

- **ILCM KYR Page**: https://www.ilcm.org/immigration-resources/know-your-rights/ (multilingual)
- **ACLU-MN Stop 287(g)**: https://www.aclu-mn.org/campaigns-initiatives/stop287g/
- **City of Minneapolis**: https://www.minneapolismn.gov/government/programs-initiatives/city-federal-response/
- **City of St. Paul**: https://www.stpaul.gov/departments/city-attorney/immigration-resources
- **MN Office of Ombudsperson**: https://mn.gov/ombudfam/resources/immigration.jsp

---

## Active Legal Proceedings

| Case | Parties | Status |
|------|---------|--------|
| **State v. DHS** | MN + Minneapolis + St. Paul v. DHS | Federal lawsuit to end Operation Metro Surge. TRO denied Jan 31, 2026. |
| **ACLU Class Action** | ACLU v. ICE/CBP | Challenging racial profiling, warrantless arrests, suspicionless stops. Filed Jan 15, 2026. |
| **Freeborn County** | ACLU-MN v. Freeborn County | Challenging illegal use of 287(g) agreement |
| **Schools v. DHS** | Duluth/Fridley Schools + Education MN v. DHS | Challenging rescission of sensitive areas policy |
| **DOJ Sanctuary Suit** | DOJ v. Minnesota/Minneapolis/St. Paul | Federal suit over sanctuary policies |
| **Operation PARRIS Injunction** | Judge Tunheim | Order blocking refugee detentions, requiring return of TX-transferred detainees |

---

## Key Policy Context

### Driver's License for All (effective Oct 1, 2024)

- No proof of immigration status required for MN driver's license, permit, or ID
- Application data classified as **private** under state law
- DVS **cannot share information** with civil immigration enforcement
- Does not grant immigration status or work authorization
- Source: https://dps.mn.gov/news/dvs-getting-minnesotans-ready-drivers-license-all

### Sanctuary Status

- **DHS designated Minnesota** a "sanctuary state" as of July 8, 2025 (along with 20 counties + Minneapolis + St. Paul)
- **No state law** actually makes MN a sanctuary state — the label is a federal designation
- **State prisons** routinely coordinated with ICE on custody transfers, complying with every request over a two-year period ending October 2025
- **AG Ellison opinion** (Dec 12, 2025): Sheriffs cannot enter 287(g) agreements without prior county board approval

### ICE Surveillance Technology in Use

Per Sahan Journal reporting, federal agencies are using in Minnesota:
- Facial recognition technology
- **Stingray devices** (fake cell towers for data collection)
- Cell phone tracking (MN state law may provide some protection)
- License plate readers
- Social media monitoring
- Source: https://sahanjournal.com/immigration/ice-surveillance-technology-facial-recognition-phones-minnesota/

---

## Demographics

**Foreign-born population**: ~524,000 (~9% of state population)

| Community | Population | Notes |
|-----------|-----------|-------|
| **Mexican-born** | ~64,500 | Largest immigrant group |
| **Somali-born** | ~33,500 | Total Somali ancestry ~107,000 (2% of state); 78% in Twin Cities |
| **Indian-born** | ~30,200 | |
| **Hmong (Laos/Thailand)** | ~42,900 combined | |
| **Ethiopian-born** | ~21,900 | |
| **Vietnamese-born** | ~18,600 | |
| **Chinese-born** | ~18,600 | |

**Somali community**: 37.5% of adults below poverty line (vs 6.9% native-born). 52.3% of children in Somali immigrant homes live in poverty.

---

## Implementation Plan

### Phase 1 — Scaffold + Static Content [1 session]

Everything that doesn't require external data. Ship something visible immediately.

1. Create `app/mn/layout.tsx` with MN-specific metadata
2. Create `app/mn/page.tsx` — dashboard shell with CSS Grid layout
3. Update `proxy.ts` to skip `/mn` routes
4. Build **Community Resources panel** — static data, Accordion with:
   - Emergency hotlines (IDN: 612-255-3112, Monarca: 612-441-2881, ILCM: 651-641-1011)
   - Know Your Rights links (ILCM, ACLU-MN, city resources)
   - Legal aid contacts
5. Build **Detention & 287(g) panel** — static Table of 10 facilities and 8 counties
6. Build **Enforcement Stats panel** — static stat cards (3,000+ arrests, 96+ court violations, etc.)
7. Update CSP headers for map tile domains

At the end of Phase 1: a live page at `8lee.ai/mn` with useful static information. Already valuable to the community even without live data.

### Phase 2 — Map [1 session]

The visual centerpiece.

1. `bun add react-map-gl maplibre-gl`
2. Build `mn-map.tsx`:
   - MapLibre GL with dark base tiles
   - Centered on Twin Cities metro (zoom 8), zoom-out shows full state
   - Markers for detention facilities (red)
   - GeoJSON fill for 287(g) counties
   - GeoJSON fill for sanctuary jurisdictions
   - Markers for community resources (green)
3. Layer toggle controls (shadcn Switch)
4. Click-to-details popups (react-map-gl Popup component)
5. Mobile: map is full-width hero at top, panels stack below

MapLibre + react-map-gl is straightforward — no need for deck.gl at our scale (~50 data points, not thousands). If we later need WebGL performance for ACLED data with thousands of events, we can add `@deck.gl/react` then.

### Phase 3 — Live News Feed [1 session]

Wire up RSS feeds for real-time content.

1. Build `app/api/mn/rss/route.ts` — RSS proxy:
   - Fetch from 12 MN news sources
   - Domain allowlist (mprnews.org, sahanjournal.com, startribune.com, etc.)
   - Parse RSS/Atom XML to normalized NewsItem objects
   - Cache responses (5 min TTL via Cache-Control headers)
2. Build `app/mn/lib/hooks.ts`:
   - `useNewsFeeds()` — TanStack Query, polls every 3 min
3. Build **News Feed panel** — ScrollArea with cards, source badges, timestamps
4. Build **Live Alerts panel** — same feed but filtered to high-severity items
5. Client-side keyword classification (fast path, no AI needed):
   - CRITICAL: `active raid`, `shots fired`, `fatal`, `mass arrest`
   - HIGH: `ICE checkpoint`, `federal agents`, `detained`, `deportation`
   - MEDIUM: `court hearing`, `sanctuary`, `287(g)`, `asylum`
   - LOW: `policy`, `community meeting`, `legal clinic`

### Phase 4 — Polish + Ship [1 session]

1. Responsive design pass — mobile-first (most users on phones)
2. Loading skeletons for async panels
3. Error boundaries with fallback UI
4. Accessibility: focus management, screen reader labels, color contrast
5. **Panic button** — prominent UI element that instantly navigates to google.com
6. Test on real devices, verify map performance on mobile
7. Ship to production via `/ship`

### Phase 5 — Enhancements [as needed, post-launch]

Add only after MVP is live and getting feedback:

- **AI Situation Brief** — daily summary via AI SDK (needs Anthropic API call)
- **ACLED integration** — protest event data on map
- **Legal Tracker panel** — court dates and rulings
- **Policy Watch panel** — federal/state policy changes
- **Multilingual UI** — Spanish, Somali, Hmong, Oromo for static strings
- **Custom monitors** — keyword alerts stored in localStorage
- **Shareable URLs** — map state in query params via useSearchParams

---

## Effort Estimate

| Phase | Sessions | What Gets Built |
|-------|----------|----------------|
| 1. Scaffold + Static | 1 | Dashboard shell, 3 static panels, CSP updates |
| 2. Map | 1 | MapLibre map with 4 layers, popups, mobile layout |
| 3. Live News | 1 | RSS proxy, news feed, alerts, keyword classification |
| 4. Polish + Ship | 1 | Responsive, a11y, error handling, panic button, deploy |
| **MVP Total** | **4 sessions** | |
| 5. Enhancements | 1-3 | AI briefs, ACLED, legal tracker, i18n (as needed) |
| **Full Total** | **5-7 sessions** | |

### Why This Is Faster

- **No porting** — zero time spent wrestling with someone else's architecture
- **shadcn does the heavy lifting** — Card, Table, Accordion, Badge, ScrollArea, Switch covers 90% of the UI
- **react-map-gl is simple** — no deck.gl complexity needed at our data scale
- **TanStack Query handles data** — polling, caching, stale states, error handling out of the box
- **Static content is immediately useful** — Phase 1 ships a working resource page before any API work
- **Our muscle memory** — this is the exact same stack as all 7 other projects

### Real Risks

1. **RSS feed reliability** — Some sources may not have RSS, or their feeds may be rate-limited. The proxy needs graceful degradation per source. Build a simple circuit breaker (3 failures -> skip for 5 min).

2. **Map tile provider** — Free tiers have request limits. MapTiler free = 100K loads/month. Protomaps (self-hosted PMTiles) is unlimited but requires hosting the tile file. Start with MapTiler, switch if needed.

3. **Content accuracy** — Keyword classification will have false positives. A news article about "ICE" (the substance) gets flagged. Keep classification visible to users (show the badge + source) so they can judge for themselves.

4. **The map is the product** — If it doesn't work on mobile, the dashboard fails. Test early, test often. react-map-gl has good mobile support but touch interactions need verification.

5. **Security for vulnerable users** — No analytics that track individual users. No login required. No cookies beyond theme preference. Panic button that instantly leaves the site. Consider `rel="noreferrer"` on all external links.

6. **CSP headaches** — MapLibre needs `worker-src blob:` and tile server domains in `connect-src`. WebGL needs testing. This might require a few iterations to get right.

---

## Reference Links

### Key Sources

- [Britannica: 2025-26 Minnesota ICE Deployment](https://www.britannica.com/event/2025-26-Minnesota-ICE-Deployment)
- [Wikipedia: Operation Metro Surge](https://en.wikipedia.org/wiki/Operation_Metro_Surge)
- [Wikipedia: 2026 Minnesota General Strike](https://en.wikipedia.org/wiki/2026_Minnesota_general_strike)
- [ACLED: Confrontations Between ICE and Protesters](https://acleddata.com/report/confrontations-between-ice-and-protesters-how-does-minnesota-compare-other-states)
- [Lawfare: Minnesota's 10th Amendment Case](https://www.lawfaremedia.org/article/minnesota-s-compelling-10th-amendment-case-against-trump-s-ice-surge)

### Government

- [DHS: 3,000 Arrests Press Release](https://www.dhs.gov/news/2026/01/19/ice-continues-remove-worst-worst-minneapolis-streets-dhs-law-enforcement-marks-3000)
- [White House: Minnesota's Sanctuary Defiance](https://www.whitehouse.gov/articles/2026/01/minnesotas-sanctuary-defiance-has-consequences/)
- [ICE ERO Statistics](https://www.ice.gov/statistics)

### News Coverage

- [CNN: Minneapolis ICE Crackdown](https://www.cnn.com/2026/01/06/us/minneapolis-ice-crackdown-what-we-know)
- [MPR: ICE in Minnesota](https://www.mprnews.org/ice-in-minnesota)
- [Sahan Journal: Operation PARRIS](https://sahanjournal.com/immigration/minnesota-refugees-immigration-operation-parris/)
- [MinnPost: Sanctuary Label vs Actual Cooperation](https://www.minnpost.com/public-safety/2026/01/sanctuary-label-obscures-actual-levels-of-ice-cooperation-across-minnesota/)

### Research Tools

- [TRAC Immigration](https://tracreports.org/immigration/)
- [Immigration Enforcement Dashboard](https://enforcementdashboard.com/)
- [Deportation Data Project](https://deportationdata.org/)
- [Deportation Tracker Live](https://deportationtracker.live/)

### Inspiration

- [WorldMonitor](https://github.com/koala73/worldmonitor) — OSINT dashboard patterns, feed architecture, classification approach
