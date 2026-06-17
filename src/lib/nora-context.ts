/**
 * NORA — Firmen-Briefing über KIcasso (Wissensbasis der Suggestion Engine, PROJ-2)
 *
 * Dieser Kontext wird Claude bei jedem Generierungs-Lauf mitgegeben. Er ersetzt
 * (für das MVP) externe Live-Datenquellen. Stefan kann diesen Text jederzeit
 * verfeinern — je präziser das Briefing, desto relevanter die Vorschläge.
 *
 * Quelle des Erstentwurfs: docs/PRD.md + docs/design-system.md (2026-06-07).
 */
export const NORA_COMPANY_CONTEXT = `
# Unternehmen: KIcasso

**Tagline:** Intelligence. Compliance. Impact.
**Positionierung:** KI-gestützte Lösungen für Excellence in Pharma & Healthcare.

## Gründer
Stefan Billich — Solo-Gründer, GMP Qualification Specialist. Baut KI-Lösungen für
Pharma & Healthcare. Entwickelt allein; Zeit ist die knappste Ressource. Business
Development wird leicht zugunsten von Produktarbeit vernachlässigt — genau hier
soll NORA gegensteuern.

## Erstes Produkt: QualiPilot
QualiPilot ist Produkt #1 von KIcasso ("QualiPilot — a KIcasso product").
Es richtet sich an die GMP-Qualifizierung/Validierung im pharmazeutischen Umfeld
und zielt darauf ab, zeitaufwändige, regulierte Qualifizierungsprozesse durch KI
drastisch zu beschleunigen (z. B. Validierungsdokumentation, Compliance-Nachweise).

## Zielgruppe
- B2B: Pharma- und Healthcare-Unternehmen mit GMP-Anforderungen
- Entscheider: QA/QC-Leitung, Validierungs-/Qualifizierungs-Verantwortliche,
  Head of Quality, Compliance-Manager
- Schmerzpunkte der Zielgruppe: hoher manueller Dokumentationsaufwand, regulatorischer
  Druck (GMP, GxP, Annex 1, CSV/Computer System Validation), Fachkräftemangel,
  lange Validierungszyklen

## Markenwerte
Intelligent, Vertrauenswürdig (höchste Qualität & GMP-Konformität), Innovativ,
Vernetzt, Zukunftsorientiert, Impact (Mehrwert für Gesundheit & Gesellschaft).

## Visuelle Identität & Brand Guide (Neon-Graffiti, seit 2026-06)
KIcasso tritt visuell als mutige Neon-Graffiti-/Street-Art-Marke auf — dies ist die
Grundlage für Vorschläge der Kategorie "design" (Design & Brand):
- Typografie: Sora (Google Fonts, modern-geometrisch) als UI-Font; Fallback Segoe UI → Arial.
  Wortmarke „KI" (Cyan) + „casso" (Pink) im Graffiti-Drip-Stil.
- Palette: Neon-Cyan #38E5FF (Primär-Akzent), Hot-Pink/Magenta #FF2D9C (Sekundär),
  Neon-Lime #A6FF3C (Tertiär), Electric Blue #0078FF (Buttons/Links). Hintergründe:
  Navy #070B1E, Wall-Charcoal #12101C, Surface #0E1430; Text #FFFFFF.
- Signature-Look: Neon-Glow (Text/Outline + gleichfarbiger Schatten), Gradient Cyan→Violet,
  Farbspritzer und tropfende Farbe (Drip) auf dunkler, rissiger Wand → Dark-Premium-Ästhetik.
- Maskottchen: Neon-Cyborg-Kopf (Cyan-Outline, Antenne, Kamera-Blenden-Auge, neon-grüner
  Wackelmund, tropfende Farbe).
- Vibe: kreativ, verspielt, energetisch — visuell auffällig, während die fachliche
  Tonalität (Pharma/GMP) seriös bleibt. Vollständige Specs: docs/design-system.md.

## Aktuelle Geschäftsziele (BizDev-Fokus)
1. Sichtbarkeit & Thought Leadership im Pharma/GMP-Umfeld aufbauen (v. a. LinkedIn)
2. QualiPilot von der Idee zum verkaufsfähigen ersten Produkt bringen
3. Erste Pilotkunden / Design-Partner aus der Pharma-Branche gewinnen
4. Operative Effizienz als Solo-Gründer steigern (Prozesse, Automatisierung)

## Tonalität & Stil
Premium, fachlich fundiert, vertrauenswürdig. Kein generisches Marketing-Geschwätz —
konkret, GMP-/Pharma-kompetent, auf Augenhöhe mit Fachentscheidern.

## Rahmenbedingungen
- Solo-Gründer mit begrenzter Zeit: Vorschläge müssen in < 2 Minuten bewertbar und
  realistisch allein umsetzbar sein.
- Kein bezahltes Marketing-Budget im MVP — Fokus auf organische, eigenleistbare Maßnahmen.
- Kein Auto-Posting: Vorschläge bleiben Entwürfe, die Stefan prüft.
`.trim()
