# QualiPilot — Local AI powered GMP Qualification Platform

QualiPilot ist eine GMP-orientierte Webplattform für Pharma-, Biotech- und
MedTech-Projekte: Erstellung, Verwaltung, Versionierung und Prüfung von
Qualifizierungs- und Validierungsdokumenten — unterstützt durch **lokale KI**
(LM Studio, LocalAI, Ollama) über einen austauschbaren Provider-Layer.

> **GMP-Grundsatz:** QualiPilot ist ein **Assistenzsystem**. KI-Ausgaben sind
> immer **Entwürfe** (Review Required) und werden nie automatisch freigegeben.

## Einordnung im Repo

QualiPilot ist eine **eigenständige Sub-App** im bestehenden Repo (das zugleich
das Kordix Company OS und den NORA-BizDev-Agent enthält). Sie ist bewusst
isoliert und später leicht extrahierbar:

- **Routen:** alles unter `src/app/qualipilot/*` (eigener Login, eigene Shell).
- **DB:** eigene, `qp_`-geprefixte Tabellen im `public`-Schema (keine Kollision
  mit den Company-OS-Tabellen `projects`/`documents`; kein „Exposed schema"-Setup nötig).
- **Wiederverwendung:** shadcn/ui-Komponenten, Supabase-Clients, Tailwind-/Brand-Tokens.

## Setup

### 1. Datenbank
Führe `supabase/qualipilot_schema.sql` im Supabase SQL-Editor aus (idempotent).
Legt alle `qp_*`-Tabellen an, aktiviert RLS, bereitet `pgvector` für späteres RAG vor.

### 2. Environment-Variablen
QualiPilot nutzt die bestehenden Supabase-Variablen und optional die AI-Provider-Variablen.

**Supabase (erforderlich — bereits im Projekt vorhanden):**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # für Registrierung/Onboarding (Org+Profil bootstrappen)
```

**Lokale KI (optional — kann auch pro Org in der App unter Einstellungen → KI-Provider gesetzt werden):**

_OpenAI-kompatibel (LM Studio, LocalAI, llama-cpp-python …):_
```
AI_PROVIDER=openai-compatible
AI_BASE_URL=http://localhost:1234/v1
AI_API_KEY=local-not-required
AI_MODEL=local-model-name
AI_TEMPERATURE=0.2
AI_MAX_TOKENS=4000
```

_Ollama:_
```
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
AI_TEMPERATURE=0.2
AI_MAX_TOKENS=4000
```

> Ohne erreichbaren KI-Server bleibt die App voll nutzbar. Der AI Draft
> Generator meldet dann klar **„Local AI unavailable"**; alle übrigen Module
> funktionieren normal.

### 3. Registrieren
`/qualipilot/register` anlegen → erzeugt Organisation + Admin-Profil (via
Service-Role) und meldet direkt an. Bestehende Company-OS-Nutzer ohne
QualiPilot-Profil werden beim Aufruf zum Onboarding geführt.

## Architektur

### AI Provider Layer (`src/lib/qualipilot/ai/`)
Ein einheitliches `AIProvider`-Interface entkoppelt die App vom Anbieter:

| Provider | Datei | Zweck |
|----------|-------|-------|
| `OpenAICompatibleProvider` | `openai-compatible.ts` | LM Studio, LocalAI, llama-cpp-python … (`/chat/completions`, `/embeddings`) |
| `OllamaProvider` | `ollama.ts` | native Ollama-API (`/api/chat`, `/api/embeddings`) |
| `DisabledProvider` | `disabled.ts` | kein Server konfiguriert — wirft klare Fehler statt Crash |

`factory.ts` löst pro Organisation den aktiven Provider auf: DB-Default
(`qp_ai_providers`) → ENV-Fallback → Disabled. `testConnection()` prüft
Erreichbarkeit · Modell · Chat-Completion · optional Embedding.

### Kernmodule (`src/app/qualipilot/(app)/`)
Dashboard · Projekte · Dokumente · AI Draft Generator · Risk/FMEA ·
Traceability · Audit Trail · Einstellungen (KI-Provider / Organisation / Nutzer).

### GMP-Logik
- **FMEA** (`lib/qualipilot/fmea.ts`): `RPN = S×O×D`; Klassen 1–30 Low, 31–80
  Medium, 81–150 High, >150 Critical; Critical/High benötigen eine Maßnahme.
- **Dokumentenschutz:** Approved-Dokumente werden per RLS nicht überschrieben;
  Änderungen erzeugen eine neue Version (`qp_document_versions`).
- **Audit-Trail:** append-only (kein UPDATE/DELETE via RLS).
- **KI-Ausgaben:** `review_required = true`, Status nie automatisch `approved`.

### RAG (vorbereitet, nicht überbaut)
`qp_rag_sources` + `qp_rag_chunks` (mit `vector(768)`) und die
`generateEmbedding`-Fähigkeit der Provider stehen bereit; Chunking/Index/Suche
folgen später.

## Sicherheit / RLS
Row Level Security auf allen Tabellen, org-scoped über `qp_user_org_id()`.
KI-Provider-Secrets sind admin-only (`qp_is_admin()`). Offene Härtung
(als SQL-TODOs markiert): echte Secret-Verschlüsselung via Supabase Vault,
Trigger-erzwungene Append-Only-Semantik für `qp_ai_generations`.
