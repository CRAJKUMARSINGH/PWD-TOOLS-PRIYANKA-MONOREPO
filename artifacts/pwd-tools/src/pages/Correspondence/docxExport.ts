import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  LineRuleType,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import type { Letter } from "./types";

// A4 with 20 mm margins on all sides
// 1 mm = 56.7 Twips → 20 mm ≈ 1134 Twips
const MARGIN = 1134;
const SINGLE_LINE = 240;

const ZERO_PARAGRAPH_SPACING = {
  before: 0,
  after: 0,
  line: SINGLE_LINE,
  lineRule: LineRuleType.AUTO,
} as const;

function p(
  children: TextRun[],
  opts: {
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    firstLineIndent?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    children,
    alignment: opts.align,
    spacing: ZERO_PARAGRAPH_SPACING,
    indent: opts.firstLineIndent ? { firstLine: opts.firstLineIndent } : undefined,
  });
}

function t(
  text: string,
  opts: { bold?: boolean; size?: number } = {}
): TextRun {
  return new TextRun({
    text,
    bold: opts.bold,
    size: opts.size ?? 22,
    font: "Mangal",
  });
}

export async function exportLetterAsDocx(letter: Letter): Promise<void> {
  const language = letter.language ?? "hindi";
  const versions = [
    ...(language !== "english" ? [{
      language: "hindi" as const,
      toName: letter.toName,
      toDesignation: letter.toDesignation,
      toOffice: letter.toOffice,
      subject: letter.subject,
      reference: letter.reference,
      body: letter.body,
      fromName: letter.fromName,
      fromDesignation: letter.fromDesignation,
      fromOffice: letter.fromOffice,
      cc: letter.cc,
    }] : []),
    ...(language !== "hindi" ? [{
      language: "english" as const,
      toName: letter.toNameEn,
      toDesignation: letter.toDesignationEn,
      toOffice: letter.toOfficeEn,
      subject: letter.subjectEn,
      reference: letter.referenceEn,
      body: letter.bodyEn,
      fromName: letter.fromNameEn,
      fromDesignation: letter.fromDesignationEn,
      fromOffice: letter.fromOfficeEn,
      cc: letter.ccEn,
    }] : []),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: 11906,  // A4 width in Twips  (210 mm)
              height: 16838, // A4 height in Twips (297 mm)
            },
            margin: {
              top: MARGIN,
              right: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
              header: 0,
              footer: 0,
            },
          },
        },
        children: versions.flatMap((version, versionIndex) => {
          const english = version.language === "english";
          const bodyLines = (version.body ?? "").split("\n");
          const ccLines = version.cc ? version.cc.split("\n") : [];
          const paragraphs = [
          // ── Office Header ─────────────────────────────────────────────
          p([t(english ? "Office of the Executive Engineer" : "कार्यालय अधिशासी अभियंता", { bold: true, size: 28 })], {
            align: AlignmentType.CENTER,
          }),
          p([t(english ? "Public Works Department" : "सार्वजनिक निर्माण विभाग", { bold: true, size: 26 })], {
            align: AlignmentType.CENTER,
          }),
          p([t(english ? "District Division–II, Udaipur, Rajasthan" : "जिला खण्ड–II, उदयपुर, राजस्थान", { bold: true, size: 24 })], {
            align: AlignmentType.CENTER,
          }),

          // ── क्रमांक & दिनांक ─────────────────────────────────────────
          new Paragraph({
            children: [
              t(`${english ? "No.:" : "क्रमांकः"} ${letter.letterNumber}`),
              t(`\t\t\t\t\t${english ? "Date:" : "दिनांकः"} ${letter.date}`),
            ],
            spacing: ZERO_PARAGRAPH_SPACING,
          }),

          // ── Addressee ─────────────────────────────────────────────────
          p([t(english ? "To," : "सेवा में,")]),
          p([t(version.toDesignation + ",")]),
          p([t(version.toName + ",")]),
          p([t(version.toOffice + (english ? "." : "।"))]),

          // ── विषय ─────────────────────────────────────────────────────
          new Paragraph({
            children: [t(english ? "Subject: " : "विषयः– ", { bold: true }), t(version.subject)],
            spacing: ZERO_PARAGRAPH_SPACING,
          }),

          // ── संदर्भ (reply only) ────────────────────────────────────────
          ...(version.reference
            ? [
                new Paragraph({
                  children: [t(english ? "Reference: " : "संदर्भः– ", { bold: true }), t(version.reference)],
                  spacing: ZERO_PARAGRAPH_SPACING,
                }),
              ]
            : []),

          // ── महोदय ────────────────────────────────────────────────────
          p([t(english ? "Sir/Madam," : "महोदय,")]),

          // ── Body ──────────────────────────────────────────────────────
          ...bodyLines.map((line) =>
            new Paragraph({
              children: [t(line)],
              spacing: ZERO_PARAGRAPH_SPACING,
              indent: { firstLine: 720 },
            })
          ),

          // ── Valediction ───────────────────────────────────────────────
          p([t(english ? "Yours faithfully," : "भवदीय,")]),

          // ── Signature ────────────────────────────────────────────────
          p([t(`(${version.fromName})`)]),
          p([t(version.fromDesignation)]),
          p([t(version.fromOffice)]),

          // ── प्रतिलिपि ─────────────────────────────────────────────────
          ...(ccLines.length > 0
            ? [
                new Paragraph({
                  children: [t(english ? "Copy to:" : "प्रतिलिपिः–", { bold: true })],
                  spacing: ZERO_PARAGRAPH_SPACING,
                }),
                ...ccLines.map((line, i) =>
                  new Paragraph({
                    children: [t(`${i + 1}. ${line}`)],
                    spacing: ZERO_PARAGRAPH_SPACING,
                  })
                ),
              ]
            : []),
          ];
          return versionIndex < versions.length - 1
            ? [...paragraphs, new Paragraph({ pageBreakBefore: true, spacing: ZERO_PARAGRAPH_SPACING })]
            : paragraphs;
        }),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeNum = letter.letterNumber.replace(/[^a-zA-Z0-9\-_]/g, "_");
  saveAs(blob, `Patra_${safeNum}.docx`);
}
