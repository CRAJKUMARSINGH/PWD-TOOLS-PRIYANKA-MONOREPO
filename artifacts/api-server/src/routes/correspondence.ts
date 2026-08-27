/**
 * Correspondence-Assistant routes — integrated from CODE-JUNCTION/Correspondence-Assistant
 *
 * Mounted at /api/correspondence by routes/index.ts
 *
 * Endpoints:
 *   GET    /letters           list (filter type/status)
 *   POST   /letters           create
 *   GET    /letters/stats     stats
 *   GET    /letters/recent    last 5
 *   GET    /letters/:id       get one
 *   PATCH  /letters/:id       update
 *   DELETE /letters/:id       delete
 *   POST   /letters/:id/generate-docx   produce Word file
 *   GET    /letters/:id/download        download produced Word file
 */
import { Router, type IRouter } from "express";
import { and, count, desc, eq } from "drizzle-orm";
import { db, correspondenceLettersTable } from "@workspace/db";
import {
  CorrListLettersQueryParams,
  CorrCreateLetterBody,
  CorrGetLetterParams,
  CorrUpdateLetterParams,
  CorrDeleteLetterParams,
  CorrGenerateDocxParams,
  CorrListLettersResponse,
  CorrCreateLetterResponse,
  CorrGetLetterStatsResponse,
  CorrGetRecentLettersResponse,
  CorrGetLetterResponse,
  CorrUpdateLetterResponse,
  CorrGenerateDocxResponse,
} from "@workspace/api-zod";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  TextRun,
} from "docx";
import * as fs   from "fs";
import * as os   from "os";
import * as path from "path";

const router: IRouter = Router();

// ── helpers ───────────────────────────────────────────────────────────────

function fmt(letter: typeof correspondenceLettersTable.$inferSelect) {
  return {
    ...letter,
    createdAt: letter.createdAt.toISOString(),
    updatedAt: letter.updatedAt.toISOString(),
  };
}

// ── Page layout constants (standing spec) ────────────────────────────────
const A4_WIDTH_TWIPS  = 11906; // 210 mm
const A4_HEIGHT_TWIPS = 16838; // 297 mm
const MARGIN_TWIPS    = 1417;  // 25 mm
const ZERO            = 0;

function para(
  runs: ConstructorParameters<typeof TextRun>[0][],
  opts: {
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    indent?: { firstLine?: number; left?: number };
  } = {}
) {
  return new Paragraph({
    children: runs.map((r) => new TextRun(r)),
    alignment: opts.alignment ?? AlignmentType.JUSTIFIED,
    spacing: { before: ZERO, after: ZERO, line: 276, lineRule: "auto" as any },
    ...(opts.indent ? { indent: opts.indent } : {}),
  });
}

function blankLine() {
  return new Paragraph({
    children: [],
    spacing: { before: ZERO, after: ZERO, line: 276, lineRule: "auto" as any },
  });
}

// ── List ─────────────────────────────────────────────────────────────────

router.get("/letters", async (req, res): Promise<void> => {
  const params = CorrListLettersQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const conditions = [];
  if (params.data.type)   conditions.push(eq(correspondenceLettersTable.type,   params.data.type));
  if (params.data.status) conditions.push(eq(correspondenceLettersTable.status, params.data.status));

  const letters = await db
    .select()
    .from(correspondenceLettersTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(correspondenceLettersTable.createdAt));

  res.json(CorrListLettersResponse.parse(letters.map(fmt)));
});

// ── Create ───────────────────────────────────────────────────────────────

router.post("/letters", async (req, res): Promise<void> => {
  const parsed = CorrCreateLetterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const d = parsed.data;
  const [letter] = await db
    .insert(correspondenceLettersTable)
    .values({
      type:            d.type,
      status:          d.status ?? "draft",
      letterNumber:    d.letterNumber,
      date:            d.date,
      toName:          d.toName,
      toDesignation:   d.toDesignation,
      toOffice:        d.toOffice,
      subject:         d.subject,
      reference:       d.reference ?? null,
      body:            d.body,
      fromName:        d.fromName,
      fromDesignation: d.fromDesignation,
      fromOffice:      d.fromOffice,
      cc:              d.cc ?? null,
    })
    .returning();

  res.status(201).json(CorrCreateLetterResponse.parse(fmt(letter)));
});

// ── Stats ────────────────────────────────────────────────────────────────

router.get("/letters/stats", async (_req, res): Promise<void> => {
  const t = correspondenceLettersTable;
  const [total]  = await db.select({ count: count() }).from(t);
  const [newL]   = await db.select({ count: count() }).from(t).where(eq(t.type,   "new"));
  const [replyL] = await db.select({ count: count() }).from(t).where(eq(t.type,   "reply"));
  const [drafts] = await db.select({ count: count() }).from(t).where(eq(t.status, "draft"));
  const [finals] = await db.select({ count: count() }).from(t).where(eq(t.status, "final"));

  res.json(CorrGetLetterStatsResponse.parse({
    total:        total?.count  ?? 0,
    newLetters:   newL?.count   ?? 0,
    replyLetters: replyL?.count ?? 0,
    drafts:       drafts?.count ?? 0,
    finals:       finals?.count ?? 0,
  }));
});

// ── Recent ───────────────────────────────────────────────────────────────

router.get("/letters/recent", async (_req, res): Promise<void> => {
  const letters = await db
    .select()
    .from(correspondenceLettersTable)
    .orderBy(desc(correspondenceLettersTable.createdAt))
    .limit(5);
  res.json(CorrGetRecentLettersResponse.parse(letters.map(fmt)));
});

// ── Get one ──────────────────────────────────────────────────────────────

router.get("/letters/:id", async (req, res): Promise<void> => {
  const params = CorrGetLetterParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [letter] = await db
    .select()
    .from(correspondenceLettersTable)
    .where(eq(correspondenceLettersTable.id, params.data.id));

  if (!letter) { res.status(404).json({ error: "Letter not found" }); return; }
  res.json(CorrGetLetterResponse.parse(fmt(letter)));
});

// ── Update ───────────────────────────────────────────────────────────────

router.patch("/letters/:id", async (req, res): Promise<void> => {
  const params = CorrUpdateLetterParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const parsed = CorrUpdateLetterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const upd: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.type            !== undefined) upd.type            = d.type;
  if (d.status          !== undefined) upd.status          = d.status;
  if (d.letterNumber    !== undefined) upd.letterNumber    = d.letterNumber;
  if (d.date            !== undefined) upd.date            = d.date;
  if (d.toName          !== undefined) upd.toName          = d.toName;
  if (d.toDesignation   !== undefined) upd.toDesignation   = d.toDesignation;
  if (d.toOffice        !== undefined) upd.toOffice        = d.toOffice;
  if (d.subject         !== undefined) upd.subject         = d.subject;
  if (d.reference       !== undefined) upd.reference       = d.reference ?? null;
  if (d.body            !== undefined) upd.body            = d.body;
  if (d.fromName        !== undefined) upd.fromName        = d.fromName;
  if (d.fromDesignation !== undefined) upd.fromDesignation = d.fromDesignation;
  if (d.fromOffice      !== undefined) upd.fromOffice      = d.fromOffice;
  if (d.cc              !== undefined) upd.cc              = d.cc ?? null;

  const [letter] = await db
    .update(correspondenceLettersTable)
    .set(upd)
    .where(eq(correspondenceLettersTable.id, params.data.id))
    .returning();

  if (!letter) { res.status(404).json({ error: "Letter not found" }); return; }
  res.json(CorrUpdateLetterResponse.parse(fmt(letter)));
});

// ── Delete ───────────────────────────────────────────────────────────────

router.delete("/letters/:id", async (req, res): Promise<void> => {
  const params = CorrDeleteLetterParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [deleted] = await db
    .delete(correspondenceLettersTable)
    .where(eq(correspondenceLettersTable.id, params.data.id))
    .returning();

  if (!deleted) { res.status(404).json({ error: "Letter not found" }); return; }
  res.sendStatus(204);
});

// ── Generate DOCX ────────────────────────────────────────────────────────

router.post("/letters/:id/generate-docx", async (req, res): Promise<void> => {
  const params = CorrGenerateDocxParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [letter] = await db
    .select()
    .from(correspondenceLettersTable)
    .where(eq(correspondenceLettersTable.id, params.data.id));

  if (!letter) { res.status(404).json({ error: "Letter not found" }); return; }

  const doc = new Document({
    sections: [
      {
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
              header: ZERO,
              footer: ZERO,
            },
          },
        },
        children: [
          // ── Office header ────────────────────────────────────────────
          para([{ text: "राजस्थान सरकार", bold: true, size: 28, font: "Mangal" }],
               { alignment: AlignmentType.CENTER }),
          para([{ text: `${letter.fromDesignation}, सार्वजनिक निर्माण विभाग`, bold: true, size: 26, font: "Mangal" }],
               { alignment: AlignmentType.CENTER }),
          para([{ text: letter.fromOffice, bold: true, size: 24, font: "Mangal" }],
               { alignment: AlignmentType.CENTER }),
          blankLine(),

          // ── क्रमांक / दिनांक ─────────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: `क्रमांकः ${letter.letterNumber}`, size: 22, font: "Mangal" }),
              new TextRun({ text: "\t", size: 22, font: "Mangal" }),
              new TextRun({ text: `दिनांकः ${letter.date}`, size: 22, font: "Mangal" }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before: ZERO, after: ZERO, line: 276, lineRule: "auto" as any },
            tabStops: [{ type: "right" as any, position: A4_WIDTH_TWIPS - MARGIN_TWIPS * 2 }],
          }),
          blankLine(),

          // ── Addressee ────────────────────────────────────────────────
          para([{ text: "सेवा में,",                           size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          para([{ text: `${letter.toDesignation},`,            size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          para([{ text: `${letter.toName},`,                   size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          para([{ text: `${letter.toOffice}।`,                 size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          blankLine(),

          // ── विषय ─────────────────────────────────────────────────────
          para([
            { text: "विषयः– ", bold: true, size: 22, font: "Mangal" },
            { text: letter.subject,         size: 22, font: "Mangal" },
          ]),
          blankLine(),

          // ── संदर्भ (optional) ─────────────────────────────────────────
          ...(letter.reference ? [
            para([
              { text: "संदर्भः– ", bold: true, size: 22, font: "Mangal" },
              { text: letter.reference,     size: 22, font: "Mangal" },
            ]),
            blankLine(),
          ] : []),

          // ── महोदय ────────────────────────────────────────────────────
          para([{ text: "महोदय,", size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          blankLine(),

          // ── Body ──────────────────────────────────────────────────────
          ...letter.body.split("\n").map((line) =>
            para([{ text: line, size: 22, font: "Mangal" }],
                 { indent: { firstLine: 720 } })
          ),
          blankLine(),

          // ── भवदीय ────────────────────────────────────────────────────
          para([{ text: "भवदीय,", size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          blankLine(), blankLine(), blankLine(),

          // ── Signature ────────────────────────────────────────────────
          para([{ text: `(${letter.fromName})`,    size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          para([{ text: letter.fromDesignation,    size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          para([{ text: letter.fromOffice,         size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),

          // ── CC (optional) ─────────────────────────────────────────────
          ...(letter.cc ? [
            blankLine(),
            new Paragraph({
              children: [],
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: ZERO, after: ZERO },
            }),
            para([{ text: "प्रतिलिपि सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित:", bold: true, size: 22, font: "Mangal" }],
                 { alignment: AlignmentType.LEFT }),
            blankLine(),
            ...letter.cc.split("\n").map((line, i) =>
              para([{ text: `${i + 1}. ${line}`, size: 22, font: "Mangal" }],
                   { indent: { left: 360 } })
            ),
            blankLine(), blankLine(),
            para([{ text: `(${letter.fromName})`, size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
            para([{ text: letter.fromDesignation, size: 22, font: "Mangal" }], { alignment: AlignmentType.LEFT }),
          ] : []),
        ],
      },
    ],
  });

  // Write to OS temp dir (cross-platform: works on Linux/Windows/macOS)
  const tmpDir = path.join(os.tmpdir(), "pwd-letters");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const safeNum  = letter.letterNumber.replace(/[^a-zA-Z0-9\-_]/g, "_");
  const filename = `patra_${safeNum}_${letter.id}.docx`;
  const filePath = path.join(tmpDir, filename);

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  res.json(CorrGenerateDocxResponse.parse({
    downloadPath: `/api/correspondence/letters/${letter.id}/download`,
    filename,
  }));
});

// ── Download DOCX ────────────────────────────────────────────────────────

router.get("/letters/:id/download", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id  = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [letter] = await db
    .select()
    .from(correspondenceLettersTable)
    .where(eq(correspondenceLettersTable.id, id));
  if (!letter) { res.status(404).json({ error: "Letter not found" }); return; }

  const safeNum  = letter.letterNumber.replace(/[^a-zA-Z0-9\-_]/g, "_");
  const filename = `patra_${safeNum}_${letter.id}.docx`;
  const filePath = path.join(os.tmpdir(), "pwd-letters", filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Document not generated yet. Call generate-docx first." });
    return;
  }

  res.setHeader("Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.sendFile(filePath);
});

export default router;
