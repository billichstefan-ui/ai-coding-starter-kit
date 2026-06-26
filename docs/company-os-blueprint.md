# Kordix Company OS — Blueprint

> **Single source of truth dashboard** für Kordix AI. Implementation-ready Design + Architektur.
> **Scope:** baut auf der bestehenden NORA-Codebase auf (Next.js 16 · Supabase · Vercel · Claude/MCP). NORA wird *ein Modul* von vielen.
> **Status:** Blueprint v1 · 2026-06-26 · zur Freigabe vor Build.

---

## 0 · Design-These (vor allen Details lesen)

Drei Prinzipien, die jede Entscheidung in diesem Dokument bestimmen:

1. **Vereinen statt neu bauen.** Kordix besitzt bereits zwei Hälften eines Company OS: **KORDIX OS (Notion)** = Struktur/Wissen/Dokumente, **NORA (Next.js+Supabase)** = Live-Daten + KI-Agenten. Das OS ist die Web-App-Vereinigung beider — Notion bleibt der eingebettete Wissens-/Dokumenten-Layer (iframe/API), nicht ein Konkurrent.
2. **Ein OS lebt von echten Daten, nicht von Modulen.** 10 Module auf einmal = schöne, leere Hülle, die sofort Vertrauen verliert. Wir bauen die **Spine** (CEO Home + Datenmodell + Theme/Auth) und docken Module an, *sobald je eine echte Datenquelle steht*. Reihenfolge nach Entscheidungs-Hebel, nicht nach Vollständigkeit.
3. **Empty-Slot-Doktrin (Anti-Fake).** Wo (noch) keine Quelle existiert (Team, Support-Agent, ETF-Depot), zeigt das Modul einen ehrlichen **„leeren Slot" mit Connect-CTA** — niemals Demo-/Fake-Zahlen. Ein Exec-Dashboard, das einmal beim Lügen erwischt wird, ist tot.

> **Challenge an die Vorgabe:** „Team status" und mehrere Agenten (Support, Sales) haben für einen Solo-Gründer heute keine Datenquelle. Sie bleiben im IA als *Slots* sichtbar (Vision), werden aber nicht mit Platzhalter-Daten befüllt. Das hält das OS heute ehrlich und morgen erweiterbar.

---

## 1 · Information Architecture

### 1.1 Das Spine-+-Module-Modell

```
                        ┌─────────────────────────────┐
                        │        CEO HOME (Spine)       │  ← einziger Pflicht-Screen
                        │  KPIs · Briefing · Approvals  │
                        └──────────────┬──────────────┘
                                       │  zieht aggregiert aus allen Modulen
   ┌──────────┬──────────┬────────────┼────────────┬───────────┬──────────┐
   ▼          ▼          ▼            ▼            ▼           ▼          ▼
PROJECTS   AI AGENTS    CRM        FINANCE     MARKETING   PRODUCTS   KNOWLEDGE
                                                                         + DOCS
                                       │
                                       ▼
                          EXECUTIVE ANALYTICS (liest alle Module)
                                       │
                                       ▼
                              AI COPILOT (RAG über das ganze OS)
```

**Drei Schichten:**

| Schicht | Module | Charakter |
|---------|--------|-----------|
| **Decide** (täglich) | CEO Home, Executive Analytics, Copilot | Aggregiert, read-first, „in 2 Min verstanden" |
| **Operate** (Arbeitsfläche) | Projects, CRM, Finance, Marketing, Products, AI Agents | Module mit eigenen Views, CRUD, Filtern |
| **Remember** (Substrat) | Knowledge Vault, Document Center | Such-/Versions-/Audit-Layer; Notion-gebrückt |

### 1.2 Datenquellen-Realitäts-Matrix (was ist *heute* echt?)

Diese Matrix steuert die Build-Reihenfolge und die Empty-Slot-Logik.

| Modul | Echte Quelle heute | Status | Phase |
|-------|--------------------|--------|-------|
| AI Agents / NORA | Supabase `suggestions`, Claude API | ✅ live | 1 |
| Projects | KORDIX-OS-Notion-DBs (Projekte/Backlog) + Supabase | 🟡 teils | 1 |
| CEO Home | Aggregat der obigen + `kpi_snapshots` | 🟡 baubar | 1 |
| Finance | Bank/Stripe/Gumroad — *noch nicht verbunden* | 🔴 Connector nötig | 2 |
| CRM | manuell + Notion BizDev — dünn | 🟡 seedbar | 2 |
| Marketing | YouTube/LinkedIn API — noch keine Reichweite | 🔴 Connector + Reichweite | 3 |
| Products | Gumroad/Etsy — noch kein Produkt live | 🔴 nach erstem Produkt | 3 |
| Knowledge / Docs | Notion (KORDIX OS, QualiPilot-Vorlagen) | ✅ vorhanden | 2 |
| Executive Analytics | abgeleitet aus allen — braucht ≥3 echte Quellen | ⚪ später | 4 |

> **Regel:** Ein Modul wandert erst von „Slot" zu „Live", wenn seine Quelle in `data_sources` als `connected` registriert ist.

### 1.3 Navigations-Hierarchie (max. 3 Klicks zu allem)

```
/ (CEO Home)
├── /projects          → Board · Timeline · Gantt · Risiken · [Projekt]/…
├── /agents            → Übersicht · [Agent]/Logs · Kosten
├── /crm               → Pipeline · Kontakte · [Deal]/… · Forecast
├── /finance           → Cashflow · Ausgaben · Forecast · Allocation
├── /marketing         → Kanäle · Kalender · [Post]/… · Ideen
├── /products          → Katalog · [Produkt]/Sales · Inventar
├── /knowledge         → Suche · SOPs · Prompt-Library · [Doc]
├── /documents         → GxP-Register · [Doc]/Versionen · Approvals
├── /analytics         → Heatmaps · Trends · Risiko-Matrix · Ziele
└── /copilot           → Chat (overlay, ⌘K-erreichbar von überall)

Querschnitt (in jedem Screen): ⌘K Command Palette · Global Search · Notifications · Theme
```

**3-Klick-Beweis:** Jede Entität ist über `Sidebar → Modul → Liste/Detail` in ≤3 Klicks erreichbar; `⌘K` macht es zu **1** (Sprung zu Entität, Aktion, Modul).

---

## 2 · Navigation Structure

### 2.1 Persistente Shell

```
┌────────────────────────────────────────────────────────────────────────┐
│ ◆ KORDIX   [⌘K Suche/Befehl…]                      🔔3  ◐ Theme  ⚙︎  ◯SB │  ← TopBar (56px)
├────────────┬───────────────────────────────────────────────────────────┤
│ ◆ Home     │                                                            │
│ ▸ Projects │                  MODUL-INHALT (Content-Outlet)             │
│ ▸ Agents   │                                                            │
│ ▸ CRM      │   Jeder Modul-Screen = <ModuleShell> mit:                  │
│ ▸ Finance  │     · Header (Titel · ViewSwitcher · Filter · Aktion)      │
│ ▸ Marketing│     · Sub-Nav (Tabs/Segmented)                            │
│ ▸ Products │     · Content (Cards/Tables/Charts)                        │
│ ─────────  │                                                            │
│ ▸ Knowledge│                                                            │
│ ▸ Documents│                                                            │
│ ▸ Analytics│                                                            │
│ ─────────  │                                                            │
│ ✦ Copilot  │                                                            │
└────────────┴───────────────────────────────────────────────────────────┘
   Sidebar: kollabierbar (Icon-only), Gruppen Decide/Operate/Remember
```

### 2.2 Command Palette (⌘K) — das eigentliche Navigationsprimitiv

Drei Modi in einem Eingabefeld (Arc/Linear/Raycast-Pattern):

- **Navigate** — „finance", „QualiPilot Projekt", „letzter LinkedIn-Post"
- **Act** — „neuer Deal", „Vorschlag genehmigen", „Cash buchen", „Agent X starten"
- **Ask** — alles, was mit `?` endet oder Natural Language ist → eskaliert an **Copilot** („Warum sank der Cashflow?")

### 2.3 Routing-Konventionen

- App Router, Server Components als Default; `"use client"` nur für Interaktivität.
- `/(os)/<modul>/…` Route-Gruppe mit gemeinsamem Shell-Layout + Auth-Guard (Middleware, bestehendes Supabase-Auth-Muster).
- Detail-Routes als parallel/intercepting routes für **Drawer-statt-Page** (Linear-Feel): `/(os)/crm/@drawer/deal/[id]`.

---

## 3 · Database Schema

**Prinzip:** additiv zum bestehenden Schema. Bestehende Tabellen (`suggestions`, `implementations`, `daily_reports`, `app_config`) bleiben unverändert; NORA wird ein Modul. RLS auf **jeder** neuen Tabelle (Repo-Regel). Single-Tenant heute (Stefan), aber `org_id`-ready für Multi-Tenant morgen.

### 3.1 Fundament: Org, Module, Quellen, Events

```sql
-- Mandant (heute 1 Zeile; macht Multi-Tenant später schmerzfrei)
CREATE TABLE orgs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Welche Module sind aktiv / als Slot sichtbar (steuert IA-Rendering)
CREATE TABLE modules (
  key         TEXT PRIMARY KEY,           -- 'finance', 'crm', …
  label       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'slot' -- 'slot' | 'live' | 'hidden'
              CHECK (status IN ('slot','live','hidden')),
  sort_order  INT NOT NULL DEFAULT 0
);

-- Externe Connector-Verbindungen (Empty-Slot-Doktrin + Marketing/Finance APIs)
CREATE TABLE data_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL REFERENCES modules(key),
  provider    TEXT NOT NULL,              -- 'stripe','gumroad','youtube','notion','gocardless'…
  status      TEXT NOT NULL DEFAULT 'disconnected'
              CHECK (status IN ('disconnected','connected','error')),
  last_sync   TIMESTAMPTZ,
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb   -- nicht-geheime Connector-Config
);
-- Secrets/Tokens NICHT hier → Supabase Vault (siehe 11.4).

-- Append-only Activity-Stream: speist Recent Activity, Audit-Trail, Anomalie-Erkennung
CREATE TABLE events (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  module_key  TEXT,
  actor       TEXT NOT NULL,              -- 'user:stefan' | 'agent:nora' | 'system'
  verb        TEXT NOT NULL,              -- 'created','approved','synced','failed'…
  entity      TEXT,                       -- 'deal:uuid', 'post:uuid'
  summary     TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_events_ts ON events(ts DESC);
CREATE INDEX idx_events_module ON events(module_key, ts DESC);
```

### 3.2 BI-Kern: KPI-Snapshots (das Stripe-Analytics-Gefühl)

> **Senior-Move:** Das Dashboard *live* gegen 12 APIs zu rendern ist langsam und fragil. Stattdessen schreibt ein nächtlicher Cron **Snapshots**; das Dashboard liest nur Postgres. Trends, Sparklines und „warum sank X?" werden dadurch trivial.

```sql
CREATE TABLE kpi_snapshots (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  metric      TEXT NOT NULL,             -- 'mrr','arr','cash','leads','customers',
                                          -- 'website_visitors','conversion_rate','open_tasks'
  value       NUMERIC NOT NULL,
  unit        TEXT,                       -- 'eur','count','pct'
  captured_at DATE NOT NULL,
  source      TEXT NOT NULL,              -- data_sources.provider | 'derived'
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (org_id, metric, captured_at)
);
CREATE INDEX idx_kpi_metric_date ON kpi_snapshots(metric, captured_at DESC);
```

KPI-Karten lesen letzten Wert + Δ zur Vorperiode + 30-Tage-Sparkline aus **einer** Tabelle.

### 3.3 Modul-Tabellen (Auszug der Kernschemas)

```sql
-- PROJECTS (spiegelt/ersetzt die KORDIX-OS-Notion-DBs als Source of Truth)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'idea',
  priority TEXT CHECK (priority IN ('P0','P1','P2')),
  rev_potential INT, effort INT, scalability INT, synergy INT,  -- KORDIX-Matrix 1–5
  owner TEXT, progress INT DEFAULT 0, due_date DATE,
  kind TEXT,  -- 'product','csv','validation','content','brand'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL, status TEXT DEFAULT 'open'
    CHECK (status IN ('open','in_progress','done')),
  priority TEXT, due_date DATE, source TEXT  -- 'manual','nora','monday'
);

-- CRM
CREATE TABLE contacts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL, email TEXT, company TEXT, role TEXT, lead_score INT, health TEXT, notes TEXT);
CREATE TABLE deals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL, stage TEXT NOT NULL DEFAULT 'lead'
    CHECK (stage IN ('lead','qualified','proposal','won','lost')),
  amount NUMERIC, currency TEXT DEFAULT 'EUR', close_date DATE, probability INT);

-- FINANCE (Buchungen normalisiert aus Connectors; Forecasts abgeleitet)
CREATE TABLE accounts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL, kind TEXT, currency TEXT DEFAULT 'EUR', balance NUMERIC, provider TEXT);
CREATE TABLE transactions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  ts DATE NOT NULL, amount NUMERIC NOT NULL, category TEXT, counterparty TEXT, kind TEXT
    CHECK (kind IN ('income','expense','transfer')), external_id TEXT);

-- MARKETING
CREATE TABLE content_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  channel TEXT NOT NULL, title TEXT, status TEXT DEFAULT 'idea'
    CHECK (status IN ('idea','draft','scheduled','published')),
  publish_at TIMESTAMPTZ, external_url TEXT, suggestion_id UUID REFERENCES suggestions(id));
CREATE TABLE content_metrics (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  captured_at DATE, views INT, likes INT, ctr NUMERIC, rpm NUMERIC, revenue NUMERIC);

-- PRODUCTS
CREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL, kind TEXT, price NUMERIC, platform TEXT, status TEXT, inventory INT);
CREATE TABLE product_sales (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ts DATE, units INT, revenue NUMERIC, platform TEXT);
```

> **Brücke zu NORA:** `content_items.suggestion_id` und `tasks.source='nora'` verbinden NORAs bestätigte Vorschläge direkt mit Marketing-Posts und Projekt-Tasks — die in der KORDIX-OS-Analyse identifizierte verschenkte Synergie.

### 3.4 AI-Agenten-Schema

```sql
CREATE TABLE agents (
  key TEXT PRIMARY KEY, label TEXT NOT NULL, model TEXT NOT NULL DEFAULT 'claude-opus-4-8',
  module_key TEXT REFERENCES modules(key), enabled BOOLEAN DEFAULT TRUE,
  system_prompt_ref TEXT,           -- → Knowledge/Prompt-Library
  schedule TEXT                     -- cron-Ausdruck | NULL (on-demand)
);
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES orgs(id),
  agent_key TEXT NOT NULL REFERENCES agents(key),
  started_at TIMESTAMPTZ DEFAULT NOW(), finished_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running' CHECK (status IN ('running','succeeded','failed')),
  trigger TEXT,                     -- 'cron','manual','event'
  input_tokens INT, output_tokens INT, cost_usd NUMERIC,
  error TEXT, summary TEXT
);
CREATE INDEX idx_agent_runs_agent ON agent_runs(agent_key, started_at DESC);
```

Kosten-/Token-Tracking ist damit **first-class** (Vorgabe „Cost Tracking, Token Usage"): jede Karte im Agent Control Center liest `agent_runs`.

### 3.5 RLS-Muster (für ALLE neuen Tabellen)

```sql
ALTER TABLE <t> ENABLE ROW LEVEL SECURITY;
-- Single-User heute: eingeloggt = Zugriff (wie bestehende NORA-Policies).
CREATE POLICY "<t>_select" ON <t> FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "<t>_write"  ON <t> FOR ALL    USING (auth.uid() IS NOT NULL)
                                             WITH CHECK (auth.uid() IS NOT NULL);
-- Multi-Tenant-Pfad (später): USING (org_id = auth.jwt() ->> 'org_id'::uuid)
```

> Schreibende Cron-/Agent-Jobs nutzen den **Service-Role-Key** (bestehendes `createServiceRoleClient`-Muster), nicht RLS.

---

## 4 · Dashboard Wireframes

### 4.1 CEO Home (der einzige Pflicht-Screen)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Guten Morgen, Stefan.  Donnerstag, 26. Juni · ☀ 21°       [Tagesbriefing ▸]│
├──────────────────────────────────────────────────────────────────────────┤
│ ┌── KPI-Streifen (8 Karten, je Wert · Δ% · 30T-Sparkline) ──────────────┐ │
│ │ MRR €0  │ ARR €0  │ Cash    │ Leads 3 │ Kunden 0│ Tasks 6 │ Visits │ Conv││
│ │  —      │  —      │ €4.2k ↓ │  +2 ↑   │   —     │  P0:3   │  142↑ │ 1.8%↓││
│ └────────────────────────────────────────────────────────────────────────┘│
│ ┌─────────────── Tagesbriefing (KI) ──────────────┐ ┌─ Genehmigungen (2)─┐ │
│ │ „Heute zählt: QualiPilot-Deploy verifizieren.    │ │ ▸ NORA: 2 Vorschläge│ │
│ │  Schnellster Hebel: GMP Validation Kit aus den   │ │   [Prüfen →]        │ │
│ │  Vorlagen schnüren. Risiko: 0 Pilotkunden seit   │ ├────────────────────┤ │
│ │  14 Tagen."   — Claude · Quelle: 6 offene Tasks  │ │ Meetings heute (0)  │ │
│ │  [Warum? ] [Fokus-Plan]                          │ │ Wichtige Mails (—)  │ │
│ └──────────────────────────────────────────────────┘ └────────────────────┘ │
│ ┌── Projekte (Heatmap) ──────────┐ ┌── Aktivität (Live-Stream) ───────────┐ │
│ │ QualiPilot   ███████░ 70% P0   │ │ 17:38 agent:nora · 2 Vorschläge erz. │ │
│ │ GMP Kit      ██░░░░░░ Idee P0  │ │ 17:36 system · Notion-DBs angelegt   │ │
│ │ Content Fac. ░░░░░░░░ 0%  P1   │ │ 16:17 user · PROJ-9 deployed         │ │
│ │ Kordix Brand ███░░░░░ P1       │ │ …                                    │ │
│ └────────────────────────────────┘ └──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

Leere KPIs zeigen `—` mit dezentem „Quelle verbinden"-Hover — **nicht** €0 als Erfolg getarnt.

### 4.2 Universelle ModuleShell (jedes Operate-Modul)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Finance                         [ Cashflow ▾ ] [ Filter ] [ ⤓ ] [ + Buchung]│  Header
│ ─ Cashflow ─ Ausgaben ─ Forecast ─ Allocation ─                            │  Sub-Nav (Tabs)
├──────────────────────────────────────────────────────────────────────────┤
│ ┌── großer Trend-Chart (Net Worth / Monatsumsatz) ──────────────────────┐ │
│ │   ▁▂▃▅▇█▇▅  (Recharts area, Kordix-Gradient)                          │ │
│ └────────────────────────────────────────────────────────────────────────┘│
│ ┌─ Kategorie-Donut ─┐ ┌─ Tabelle: letzte Transaktionen (virtualisiert) ──┐ │
│ │   Allocation      │ │ Datum · Gegenpartei · Kategorie · Betrag         │ │
│ └───────────────────┘ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
   Wenn data_sources(finance)=disconnected → ganze Fläche = <EmptySlot>:
   ┌──────────────────────────────────────────────────────────────────────┐
   │   🔌 Finance nicht verbunden                                          │
   │   Verbinde Bank (GoCardless), Stripe oder Gumroad, um Cashflow,       │
   │   Forecast und Net Worth live zu sehen.            [ Verbinden → ]    │
   └──────────────────────────────────────────────────────────────────────┘
```

### 4.3 AI Agent Control Center

```
┌──────────────────────────────────────────────────────────────────────────┐
│ AI Agents                              7 Tage:  Runs 14 · $2.41 · 312k tok │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌─ NORA (BizDev) ─────────┐ ┌─ CSV Agent ───────┐ ┌─ Finance Agent ─────┐ │
│ │ ● live · cron 06:00     │ │ ○ on-demand       │ │ ◌ Slot (kein Connector)│
│ │ Letzter Run: ✓ 2 Vorschl│ │ Letzter Run: ✓    │ │ —                   │ │
│ │ 7T: $0.38 · 41k tok     │ │ 7T: $1.90         │ │                     │ │
│ │ [Logs] [Jetzt ausführen]│ │ [Logs] [Ausführen]│ │ [Aktivieren]        │ │
│ └─────────────────────────┘ └───────────────────┘ └─────────────────────┘ │
│ ┌── Execution-Log (live, gestreamt) ───────────────────────────────────┐  │
│ │ 06:00:02 nora  run start (trigger=cron)                              │  │
│ │ 06:00:09 nora  generateSuggestions ✓ (3) · generateProductOpportunity│  │
│ │ 06:00:21 nora  insert 4 rows · cost $0.11 · 41,203 tok               │  │
│ └──────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 5 · UX Guidelines

**Leitsätze**
- **Read-first, act-second.** Jeder Screen beantwortet zuerst „wie steht es?", erst danach Aktionen.
- **Eine Primäraktion pro Screen.** Genau ein gefüllter Button (Kordix-Blau); alles andere ghost/outline.
- **Progressive Disclosure.** Karte → Drawer → Vollseite. Nie mit Optionen erschlagen.
- **Density mit Atemraum.** 4-px-Grid, 8/12/16/24 Spacing-Stufen; lieber kleine Schrift + viel Whitespace als großes Gedränge.

**Pflicht-States für jede daten-tragende Komponente** (sonst gilt sie als unfertig):
`loading` (Skeleton, nie Spinner-Vollbild) · `empty` (EmptySlot mit CTA) · `error` (Inline-Retry) · `partial` (veraltete Daten → „zuletzt 06:00" Badge) · `live`.

**Motion** (subtil, Framer Motion / CSS): Page-Transitions 150–200 ms ease-out; Karten-Hover lift 2 px + Shadow-Step; Zahlen-Count-up nur beim ersten Mount; **niemals** dekorative Dauer-Animation auf einem Exec-Screen.

**Responsive:** Desktop-first (Exec-Tool), aber CEO Home + Approvals voll mobil (Morgen-Check am Handy). Sidebar → Bottom-Tab-Bar < 768 px. Charts → kompakte Sparklines auf Mobile.

**Accessibility:** Kontrast ≥ 4.5:1 (Dark-Mode-Falle: Cyan-Text auf Navy prüfen), Fokus-Ringe sichtbar, `⌘K` + Pfeiltasten vollständig tastaturbedienbar, `prefers-reduced-motion` respektiert.

---

## 6 · Color Palette

Direkt aus `docs/design-system.md` (Kordix Brand Guide) — **kein** neues Farbsystem, Konsistenz mit QualiPilot/NORA.

| Token | Hex | Rolle im OS |
|-------|-----|-------------|
| `--bg` | `#070B1E` | App-Hintergrund (Dark, Default) |
| `--surface` | `#0E1430` | Karten, Sidebar, Sheets |
| `--surface-2` | `#161D3D` | Hover/erhöhte Flächen (abgeleitet) |
| `--primary` | `#0078FF` | Primäraktion, aktive Nav, Links |
| `--accent-cyan` | `#38E5FF` | Highlights, positive Deltas, Live-Puls |
| `--accent-periwinkle` | `#7B81FF` | Sekundär, Charts |
| `--accent-violet` | `#A720FF` | Verlauf-Endpunkt, Hero-Akzent |
| `--accent-teal` | `#0E9594` | Sekundärer Akzent, Kategorie |
| `--text` | `#FFFFFF` | Primärtext auf Dunkel |
| `--text-muted` | `rgba(255,255,255,.64)` | Sekundärtext (abgeleitet) |

**Signature-Gradient** `#38E5FF → #0078FF → #7B81FF → #A720FF` — reserviert für: Logo, CEO-Home-Hero-Rand, aktiver Fortschritt, KI-Antwort-Akzent. **Sparsam** (Premium = Zurückhaltung).

**Semantik** (eigene Hues, nicht Brand verwässern): success `#22C55E` · warning `#F59E0B` · danger `#EF4444` · info = `--accent-cyan`.

**Kategorische Chart-Palette** (deterministisch, kollisionsfrei): `#0078FF · #38E5FF · #7B81FF · #A720FF · #0E9594` — deckt die NORA-Kategorienfarben mit ab.

**Light Mode:** Invertierte Surface-Leiter (`#FFFFFF`/`#F4F6FB`), Navy wird Text; Primary/Akzente bleiben. Über `next-themes` + CSS-Variablen, ein Token-Set pro Theme.

---

## 7 · Typography

- **Font:** **Sora** (Brand) via `next/font` (self-hosted, kein Layout-Shift). Mono: `JetBrains Mono` für Logs/Token/IDs.
- **Headlines** Sora SemiBold, optional uppercase + `letter-spacing: .04em` (Brand-Regel) für Modul-Titel.
- **Scale** (Major-Third, 4-px-rhythmus):

| Token | Größe / Lh | Einsatz |
|-------|-----------|---------|
| Display | 32 / 40 | CEO-Home-Begrüßung, große KPI-Zahl |
| H1 | 24 / 32 | Modul-Titel |
| H2 | 20 / 28 | Karten-Sektionen |
| Body | 14 / 22 | Default UI-Text |
| Small | 13 / 18 | Tabellen, Sekundär |
| Caption | 11 / 16 | Labels, Badges, Achsen |
| Mono | 13 / 20 | Logs, Token-Counts, IDs |

- **Zahlen:** `font-variant-numeric: tabular-nums` überall für KPIs/Tabellen (kein Springen).

---

## 8 · Component Library

Basis = **shadcn/ui** (bereits im Stack, copy-paste, kein Re-Build). Darüber eine dünne, brandgeprägte **OS-Schicht** in `src/components/os/`.

**shadcn-Basis genutzt:** Card, Button, Badge, Tabs, Dialog, Sheet (Drawer), Command (⌘K), Table, DropdownMenu, Tooltip, Skeleton, Toast (sonner), Avatar, ScrollArea, Switch, Select.

**Custom OS-Komponenten (das Kordix-Vokabular):**

| Komponente | Zweck |
|-----------|-------|
| `<AppShell>` / `<Sidebar>` / `<TopBar>` | persistente Navigation, Gruppen, Collapse |
| `<CommandMenu>` | ⌘K: Navigate/Act/Ask (Modus-3 → Copilot) |
| `<KpiCard>` | Wert · Δ% · Sparkline · Quelle-Badge · empty-aware |
| `<ModuleShell>` | Header + ViewSwitcher + Filter + Content-Slot |
| `<EmptySlot>` | Anti-Fake: Icon · Erklärung · Connect-CTA |
| `<TrendChart>` / `<DonutChart>` / `<Sparkline>` | Recharts, Kordix-Gradient, tabular tooltips |
| `<StatusHeatmap>` | Projekt-Fortschritt × Risiko |
| `<KanbanBoard>` | dnd-kit, generisch (Projects/CRM/Backlog) |
| `<ActivityStream>` | `events`-Feed, live (Realtime) |
| `<AgentCard>` / `<RunLog>` | Status · Kosten · Token · Logs |
| `<DataTable>` | TanStack Table: virtualisiert, Filter, Sort, Spalten |
| `<CopilotPanel>` | streamendes Chat-Overlay, zitiert Quellen |
| `<ApprovalCard>` | NORA-Vorschläge genehmigen/ablehnen inline |
| `<GlassPanel>` | Glassmorphism-Wrapper (backdrop-blur, 1px-Border, sparsam) |

**Glassmorphism-Disziplin:** nur für Overlays/CommandMenu/Hero — nicht für Datentabellen (Lesbarkeit > Effekt).

---

## 9 · AI Agent Concepts

### 9.1 Agenten-Modell

Ein Agent = **Trigger → Tools (MCP) → Claude-Loop → Schreiben (events/Tabellen) → Run-Record**. NORA ist die Referenz-Implementierung; alle weiteren folgen dem Muster.

| Agent | Trigger | Liest | Schreibt | Status |
|-------|---------|-------|----------|--------|
| **NORA** (BizDev) | cron 06:00 | suggestions-Historie, Notion | `suggestions` | ✅ live |
| **CSV/GMP Agent** | on-demand | QualiPilot-Vorlagen (Notion) | `documents` Entwürfe | 🟡 QualiPilot |
| **Finance Agent** | nach Sync | `transactions` | `kpi_snapshots`, Anomalie-`events` | 🔴 Slot |
| **Research Agent** | on-demand | Web (Perplexity/MCP) | `knowledge`-Items | 🟡 |
| **Social/Content Agent** | nach NORA-Approval | `content_items` | Entwürfe, SEO | 🟡 |
| **Sales/Support Agent** | event | `deals`/`contacts` | Follow-up-Tasks | 🔴 Slot |

### 9.2 Orchestrierung (Ketten — aus dem KORDIX-OS-Briefing)

`CSV Expert → Risk Manager (ICH Q9) → Part 11 Auditor → Technical Writer → Reviewer` als deklarative Pipeline. Implementierung: **MCP-Tools + Claude tool-use** im Server-Kontext; lange/mehrstufige Läufe als **n8n-Workflow** oder Vercel-Cron-Kette, jeder Schritt schreibt einen `agent_runs`-Record.

### 9.3 Der Copilot (Executive Analytics)

- **RAG über das eigene OS:** Read-only Postgres-Funktionen + `kpi_snapshots`/`events` als Tools. „Warum sank der Cashflow?" → Copilot ruft `get_metric_history('cash')` + `get_events(module='finance')`, synthetisiert, **zitiert Zeilen**.
- **Memory:** `copilot_threads` + zusammengefasstes Langzeit-Gedächtnis (org-scoped).
- **Predictive:** einfache Forecasts (lineare/saisonale Projektion auf `kpi_snapshots`) + LLM-Narrativ — kein Black-Box-ML im MVP.
- **Guardrails:** Copilot schreibt nie direkt; er *schlägt Aktionen vor* → als `ApprovalCard`. (Konsistent mit NORAs Human-in-the-Loop.)

### 9.4 Modelle & Kosten

Default **Claude Opus 4.8** für strategische Tasks (NORA-Muster), **Haiku/Sonnet** für High-Volume/Klassifikation. Jeder Run trackt `input/output_tokens` + `cost_usd` → Agent Control Center. Token-sparsam: Snapshots statt Live-Recompute, Prompt-Caching für stabile Kontexte (Company-Context, Brand Guide).

---

## 10 · Automation Concepts

**Drei Ebenen, klar getrennt:**

1. **Vercel Cron** (in-app, deterministisch): nächtlicher `kpi-snapshot`-Lauf, NORA 06:00, Connector-Syncs. Bestehendes `/api/*`-Muster mit `CRON_SECRET`.
2. **n8n** (externe, mehrstufige Glue): Webhooks von Stripe/Gumroad/YouTube → normalisieren → Supabase; lange Agenten-Ketten; Retry/Branching. n8n-MCP ist bereits angebunden.
3. **Event-getrieben** (`events`-Tabelle als Bus): Supabase-Trigger/Realtime → z. B. „Deal won" → Finance-Snapshot + Aktivität + Copilot-Notiz.

**Konkrete Automations-Rezepte (Tag 1 wertvoll):**
- *Daily Snapshot* → schreibt alle KPIs → CEO Home ist morgens aktuell.
- *NORA-Approval → Content-Pipeline* → bestätigter Marketing-Vorschlag wird `content_item` (draft) + Task.
- *Anomalie-Wächter* → Snapshot weicht > x σ ab → `event` + Copilot-Briefing-Zeile.
- *Connector-Health* → Sync-Fehler → `data_sources.status='error'` → Modul zeigt „partial"-Badge.

**Integrationen** (über MCP/n8n, bereits in der Session verfügbar): Notion · GitHub · Supabase · Vercel · Monday · Gmail/Google · n8n · (geplant) Stripe/Gumroad · YouTube/LinkedIn · Slack/Discord.

---

## 11 · Suggested Tech Stack

### 11.1 Konkret (auf der NORA-Codebase)

| Schicht | Wahl | Begründung |
|---------|------|-----------|
| Framework | **Next.js 16** App Router (vorhanden) | Server Components = schnelle, aggregierte Dashboards |
| UI | **React · Tailwind · shadcn/ui** (vorhanden) | Brand-Tokens via CSS-Vars; kein Component-Re-Build |
| Charts | **Recharts** (+ visx für Heatmaps) | leichtgewichtig, gradient-fähig |
| Tabellen | **TanStack Table** + Virtualisierung | 10k+ Zeilen flüssig |
| State/Data | **Server Actions** + `unstable_cache`; **TanStack Query** nur für Live-Polling | Repo-Konvention |
| DB/Auth | **Supabase** (Postgres · Auth · RLS · Realtime · Vault) (vorhanden) | Realtime speist `ActivityStream`; Vault hält Connector-Secrets |
| AI | **Claude (Opus 4.8/Haiku)** via `@anthropic-ai/sdk` + **MCP** | NORA-Muster; MCP-Server schon angebunden |
| Automation | **Vercel Cron** + **n8n** | in-app vs. externe Glue |
| Deploy | **Vercel** (vorhanden) | Branch→main→Auto-Deploy etabliert |
| Validation | **Zod + react-hook-form** (vorhanden) | Server-seitige Validierung (Repo-Regel) |

> **Bewusst nicht im MVP:** FastAPI/LangChain (aus der Vorgabe). Next.js Route Handlers + `@anthropic-ai/sdk` + MCP decken alles ab; ein zweiter Python-Service ist verfrühte Komplexität für einen Solo-Gründer. Aufnehmen, *wenn* schweres ML/Background-Processing es erzwingt.

### 11.2 Verzeichnis-Erweiterung (additiv)

```
src/
  app/(os)/                 # neue Route-Gruppe mit Shell-Layout + Auth-Guard
    layout.tsx              # AppShell
    page.tsx                # CEO Home
    finance/ crm/ agents/ … # je Modul
    api/cron/kpi-snapshot/  # nächtlicher Snapshot-Job
  components/os/            # OS-Komponentenschicht (Abschnitt 8)
  lib/
    metrics/                # KPI-Aggregation, Forecast
    connectors/             # stripe.ts, gumroad.ts, youtube.ts …
    agents/                 # agent-runner, registry (erweitert anthropic.ts)
supabase/
  schema.sql               # + neue Tabellen (Abschnitt 3), idempotent
docs/company-os-blueprint.md
```

### 11.3 Env / Secrets

Neue Connector-Keys (Vorgabe-Regel: in `.env.local.example` dokumentieren, nie committen, server-only): `STRIPE_SECRET_KEY`, `GUMROAD_TOKEN`, `YOUTUBE_API_KEY`, `LINKEDIN_*`, `GOCARDLESS_TOKEN`, `N8N_WEBHOOK_SECRET`. Connector-OAuth-Tokens → **Supabase Vault**, referenziert über `data_sources.id` (nicht in Klartext-Tabellen).

---

## 12 · Build-Roadmap (vertikale Scheiben, nicht 10 leere Module)

| Phase | Liefert | Definition of Done |
|-------|---------|--------------------|
| **0 · Foundation** | `(os)`-Shell, Sidebar, ⌘K, Theme, Auth-Guard, Brand-Tokens, `orgs/modules/events/data_sources/kpi_snapshots` + RLS | Leere, navigierbare Shell mit echtem Login |
| **1 · Spine** | CEO Home mit **echten** KPIs (Tasks, NORA-Vorschläge, Projekte), Activity-Stream, Approvals, Tagesbriefing (Claude) | Morgen-Check liefert echten Wert |
| **2 · Erste Live-Module** | **AI Agents** (NORA + Kosten live) · **Projects** (Notion-Sync) · **Finance** (1 Connector, z. B. Gumroad/Stripe) | 3 Module „live", Rest sauberer Slot |
| **3 · Wachstum** | CRM · Marketing (YouTube/LinkedIn) · Products (nach 1. Produkt) · Knowledge/Docs (Notion-Brücke) | Module live, sobald Quelle existiert |
| **4 · Intelligence** | Executive Analytics · Copilot (RAG) · Anomalie/Forecast | „Warum…?" wird belastbar beantwortet |

**Erste Scheibe zum Bauen:** Phase 0 + 1 = ein *echtes*, ehrliches Exec-Dashboard in ~1–2 Iterationen, das ab Tag 1 deinen Morgen-Workflow trägt.

---

## 13 · Key Decisions & Challenges (Annahmen hinterfragt)

1. **„Single source of truth" ist ein Reifegrad, kein Tag-1-Feature.** Realistisch: das OS *aggregiert und verlinkt* zuerst (Notion/Supabase/Connectors), bevor es Systeme *ersetzt*. Wir bauen es als Aggregator, der schrittweise Source-of-Truth-Rollen übernimmt.
2. **Snapshot statt Live-Fan-out.** Dashboards lesen `kpi_snapshots`, nicht 12 APIs zur Render-Zeit → schnell, robust, trend-fähig, kosten-/rate-limit-schonend.
3. **Empty-Slot > Fake-Data.** Für einen Solo-Gründer sind viele Module heute leer. Ehrliche Slots erhalten Vertrauen und Erweiterbarkeit; Demo-Zahlen zerstören beides.
4. **Kein Python-Backend im MVP.** Next.js + MCP + n8n genügen; FastAPI/LangChain erst bei echtem ML-Bedarf — vermeidet vorzeitige Zwei-Service-Komplexität.
5. **Org-scoped ab Zeile 1.** Single-User heute, aber `org_id` überall → der Sprung zu Multi-Tenant-SaaS (venture-backed) ist später eine RLS-Änderung, keine Migration der Welt.
6. **Notion behalten, nicht ersetzen.** Wissens-/Dokumenten-Arbeit (SOPs, GxP, QualiPilot-Vorlagen) bleibt in Notion und wird gebrückt — das OS gewinnt nichts daraus, einen exzellenten Doc-Editor nachzubauen.

---

*Blueprint v1 — bereit für Freigabe. Nächster Schritt: Phase 0 + 1 als ersten vertikalen Build aus diesem Dokument.*
