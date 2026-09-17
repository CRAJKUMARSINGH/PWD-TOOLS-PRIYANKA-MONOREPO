---
inclusion: always
---

# DOC / PDF / PRINT SPECIFICATIONS — STANDING INSTRUCTIONS
> **Applies to:** All code changes involving document generation (docx, pdf, print)  
> **Scope:** Correspondence Assistant and any future letter/document generation modules  
> **Authority:** Permanent standing instruction — do not override without explicit user approval

---

## 0. OUTPUT FORMAT — MANDATORY RULE

**The app produces ONLY two output formats:**

| Format | Extension | How |
|---|---|---|
| Word document | `.docx` | `docx` npm package → `Packer.toBuffer()` / `Packer.toBlob()` |
| PDF | `.pdf` | HTML → print-to-PDF via browser `window.print()` or server-side headless |

**NEVER produce `.txt` files as output.**  
**NEVER produce plain-text letter drafts as files.**  
All letter output — drafts, finals, previews — must be either `.docx` or `.pdf` only.  
Text content exists only transiently in memory/UI while the user is editing.

---

## 1. PAGE SETUP

| Property | Specification |
|---|---|
| Paper size | A4 Portrait only |
| Width | 11906 twips (210 mm) |
| Height | 16838 twips (297 mm) |
| Orientation | `PageOrientation.PORTRAIT` |
| Margins (all sides) | 25 mm = **1417 twips** |

---

## 2. HEADER & FOOTER

| Property | Specification |
|---|---|
| Header height | **0** (zero) — `header: 0` in page margin |
| Footer height | **0** (zero) — `footer: 0` in page margin |
| Header content | None — no running header |
| Footer content | None — no page numbers, no running footer |

---

## 3. PARAGRAPH SPACING

| Property | Specification |
|---|---|
| Space before every paragraph | **0** (zero) — `before: 0` |
| Space after every paragraph | **0** (zero) — `after: 0` |
| Line spacing | `line: 276, lineRule: "auto"` (single line) |
| Vertical rhythm control | Use explicit `blankLine()` helper between sections |

> **Rule:** Never use `spacing.before` or `spacing.after` to create visual gaps.  
> Always insert a `blankLine()` — a zero-height empty paragraph — wherever a blank line is needed.  
> This keeps spacing consistent, predictable, and easy to control.

---

## 4. TEXT ALIGNMENT

| Section | Alignment |
|---|---|
| Office header | `AlignmentType.CENTER` |
| Krамаnk / Dinank line | `AlignmentType.LEFT` with right-aligned tab stop for date |
| Addressee (seva mein block) | `AlignmentType.LEFT` |
| Vishay / Sandarbh | `AlignmentType.JUSTIFIED` |
| Salutation (Mahoday) | `AlignmentType.LEFT` |
| **Body paragraphs** | **`AlignmentType.JUSTIFIED`** — mandatory on all body text |
| Valediction (Bhavatiya) | `AlignmentType.LEFT` |
| Signature block | `AlignmentType.LEFT` |
| CC lines | `AlignmentType.JUSTIFIED` |

---

## 5. INDENTATION

| Section | Specification |
|---|---|
| Body paragraphs | `indent: { firstLine: 720 }` (first line indent ~1.27 cm) |
| CC list items | `indent: { left: 360 }` |
| All other sections | No indent |

---

## 6. FONT

| Property | Specification |
|---|---|
| Font family | **Mangal** (for Devanagari / Hindi text) |
| Header size | 28 half-points (14 pt) for office name |
| Sub-header size | 26 half-points (13 pt) for designation line |
| Sub-header size | 24 half-points (12 pt) for office location |
| Body text size | 22 half-points (11 pt) for all body content |

---

## 7. IMPLEMENTATION PATTERN (docx package)

Always use these two helpers — define them inside the route handler:

```typescript
// ── Constants ──────────────────────────────────────────────────────────────
const A4_WIDTH_TWIPS  = 11906;
const A4_HEIGHT_TWIPS = 16838;
const MARGIN_TWIPS    = 1417;   // 25 mm
const ZERO            = 0;

// ── Helper: zero-spaced justified paragraph ────────────────────────────────
const para = (
  runs: ConstructorParameters<typeof TextRun>[0][],
  opts: {
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    indent?: { firstLine?: number; left?: number };
  } = {}
) =>
  new Paragraph({
    children: runs.map((r) => new TextRun(r)),
    alignment: opts.alignment ?? AlignmentType.JUSTIFIED,
    spacing: { before: ZERO, after: ZERO, line: 276, lineRule: "auto" as any },
    ...(opts.indent ? { indent: opts.indent } : {}),
  });

// ── Helper: blank line (zero-height empty paragraph) ──────────────────────
const blankLine = () =>
  new Paragraph({
    children: [],
    spacing: { before: ZERO, after: ZERO, line: 276, lineRule: "auto" as any },
  });
```

Page section properties:

```typescript
properties: {
  page: {
    size: {
      orientation: PageOrientation.PORTRAIT,
      width:  A4_WIDTH_TWIPS,
      height: A4_HEIGHT_TWIPS,
    },
    margin: {
      top:    MARGIN_TWIPS,
      right:  MARGIN_TWIPS,
      bottom: MARGIN_TWIPS,
      left:   MARGIN_TWIPS,
      header: ZERO,   // zero header height
      footer: ZERO,   // zero footer height
    },
  },
},
```

---

## 8. IMPORTS — KEEP ONLY WHAT IS USED

Only import from `docx` what is actually needed. Remove unused imports.

**Minimum required imports for letter generation:**

```typescript
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageOrientation,
  BorderStyle,
} from "docx";
```

**Never import unless actively used:**
- `HeadingLevel`
- `Table`, `TableRow`, `TableCell`
- `WidthType`

---

## 9. CHANGE LOG

| Date | Change | File |
|---|---|---|
| 11.08.2026 | Initial specification established | `letters.ts` |
| 11.08.2026 | Margins corrected 20mm → 25mm | `letters.ts` |
| 11.08.2026 | Header/footer set to zero height | `letters.ts` |
| 11.08.2026 | All paragraph spacing set to zero | `letters.ts` |
| 11.08.2026 | Body alignment set to JUSTIFIED | `letters.ts` |
| 11.08.2026 | Vertical rhythm via `blankLine()` | `letters.ts` |
| 11.08.2026 | Unused docx imports removed | `letters.ts` |
| 11.08.2026 | Output format locked: .docx and .pdf only — no .txt | Standing rule |

---

## 10. RULE SUMMARY (Quick Reference)

```
✅ A4 Portrait always
✅ Margins: 25 mm (1417 twips) all sides
✅ Header height: 0
✅ Footer height: 0
✅ spacing.before = 0 on every paragraph
✅ spacing.after  = 0 on every paragraph
✅ Body text: AlignmentType.JUSTIFIED
✅ Blank lines: use blankLine() helper only
✅ Font: Mangal for Hindi, size 22 (11pt) for body
✅ Remove all unused docx imports
✅ Output: .docx AND .pdf only
❌ Never produce .txt output files
❌ Never use spacing.after/before for visual gaps
❌ Never add headers or footers with content
❌ Never use landscape orientation for letters
```
