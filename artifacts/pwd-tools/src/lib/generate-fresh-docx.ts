/**
 * DOCX generator for Fresh Audit Paras (Tab 2).
 * Spec: A4 Landscape, 15 mm margins, no shading/color, Mangal font.
 * Mirrors generate-docx.ts but accepts FreshPara[] instead of CASES.
 */
import type { FreshPara } from "@/hooks/useFreshParas";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

// ── Constants ──────────────────────────────────────────────────────────────
const A4_L_WIDTH = 16838; // A4 landscape width  in twips
const A4_L_HEIGHT = 11906; // A4 landscape height in twips
const MARGIN = 851;   // 15 mm in twips (15/25.4 × 1440 ≈ 851)
const ZERO = 0;

// ── Helpers ────────────────────────────────────────────────────────────────
function mangalRun(text: string, bold = false): TextRun {
  return new TextRun({
    text: text || "",
    bold,
    font: { name: "Mangal", cs: "Mangal" },
    language: { value: "hi-IN", eastAsia: "hi-IN", bidirectional: "hi-IN" },
    size: 18, // 9 pt — body size per spec
  });
}

function cell(text: string, bold = false): Paragraph[] {
  if (!text) return [new Paragraph({ children: [mangalRun("", bold)], spacing: { before: ZERO, after: ZERO, line: 240 } })];
  return text.split("\n").map(
    line =>
      new Paragraph({
        children: [mangalRun(line, bold)],
        spacing: { before: ZERO, after: ZERO, line: 240 },
      })
  );
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

// ── Main export ────────────────────────────────────────────────────────────
export async function generateFreshDocx(paras: FreshPara[]): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: A4_L_WIDTH,
              height: A4_L_HEIGHT,
              orientation: "landscape" as const,
            },
            margin: {
              top: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
              right: MARGIN,
              header: ZERO,
              footer: ZERO,
            },
          },
        },
        children: [
          // Title row
          new Paragraph({
            children: [
              new TextRun({
                text: "अंकेक्षण प्रतिवेदन उत्तर — जिला प्रभाग II, उदयपुर",
                bold: true,
                size: 28,
                font: { name: "Mangal", cs: "Mangal" },
                language: { value: "hi-IN", eastAsia: "hi-IN", bidirectional: "hi-IN" },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: ZERO, after: ZERO, line: 240 },
          }),

          // Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            // 5 columns: Para No | Gist | Obs | Reply | Comments
            // widths (twips) summing to usable page width ≈ 15136 twips
            columnWidths: [567, 1984, 3685, 3685, 5215],
            rows: [
              // ── Header row ──────────────────────────────────────────────
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: cell("Para No.", true), borders }),
                  new TableCell({ children: cell("संक्षिप्त विवरण", true), borders }),
                  new TableCell({ children: cell("अंकेक्षण आपत्ति", true), borders }),
                  new TableCell({ children: cell("उत्तर", true), borders }),
                  new TableCell({ children: cell("उच्चाधिकारी की टिप्पणी", true), borders }),
                ],
              }),

              // ── Data rows (2 per para) ────────────────────────────────
              ...paras.flatMap(p => {
                const row1 = new TableRow({
                  children: [
                    new TableCell({
                      rowSpan: 2,
                      children: cell(p.no, true),
                      borders,
                      verticalAlign: VerticalAlign.TOP,
                    }),
                    new TableCell({
                      columnSpan: 4,
                      children: cell(p.header, true),
                      borders,
                    }),
                  ],
                });

                const row2 = new TableRow({
                  children: [
                    new TableCell({ children: cell(p.gist, true), borders }),
                    new TableCell({ children: cell(p.obs), borders }),
                    new TableCell({ children: cell(p.reply), borders }),
                    new TableCell({ children: cell(p.comments), borders }),
                  ],
                });

                return [row1, row2];
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `FRESH_AUDIT_REPLY_${new Date().toISOString().slice(0, 10)}.docx`);
}
