import { CASES } from "@/data/audit-cases";
import { AlignmentType, BorderStyle, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from "docx";
import { saveAs } from "file-saver";

function mangalRun(text: string, bold = false): TextRun {
  return new TextRun({
    text: text || "",
    bold,
    font: { name: "Mangal", cs: "Mangal" },
    language: { value: "hi-IN", eastAsia: "hi-IN", bidirectional: "hi-IN" },
    size: 18,
  });
}

function createCellContent(text: string, bold = false) {
  if (!text) text = "";
  return text.split('\n').map(line =>
    new Paragraph({
      children: [mangalRun(line, bold)],
      spacing: { before: 0, after: 0, line: 240 },
    })
  );
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

export async function generateDocx(cases: typeof CASES, replies: Record<string, { reply: string; comments: string }>) {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 16838, height: 11906, orientation: "landscape" as const },
          margin: { top: 851, bottom: 851, left: 851, right: 851, header: 0, footer: 0 },
        },
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "अंकेक्षण प्रतिवेदन उत्तर — जिला प्रभाग II, उदयपुर",
              bold: true,
              size: 28,
              font: { name: "Mangal", cs: "Mangal" },
              language: { value: "hi-IN", eastAsia: "hi-IN", bidirectional: "hi-IN" },
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0, line: 240 },
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [567, 1984, 3685, 3685, 5214],
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ children: createCellContent("Para No.", true), borders }),
                new TableCell({ children: createCellContent("संक्षिप्त विवरण", true), borders }),
                new TableCell({ children: createCellContent("अंकेक्षण आपत्ति", true), borders }),
                new TableCell({ children: createCellContent("उत्तर", true), borders }),
                new TableCell({ children: createCellContent("उच्चाधिकारी की टिप्पणी", true), borders }),
              ]
            }),
            ...cases.flatMap(c => {
              const r = replies[c.no] || { reply: "", comments: "" };

              const row1 = new TableRow({
                children: [
                  new TableCell({
                    rowSpan: 2,
                    children: createCellContent(c.no, true),
                    borders,
                    verticalAlign: VerticalAlign.TOP,
                  }),
                  new TableCell({
                    columnSpan: 4,
                    children: createCellContent(c.header, true),
                    borders,
                  })
                ]
              });

              const row2 = new TableRow({
                children: [
                  new TableCell({ children: createCellContent(c.gist, true), borders }),
                  new TableCell({ children: createCellContent(c.obs), borders }),
                  new TableCell({
                    children: createCellContent(r.reply),
                    borders,
                  }),
                  new TableCell({
                    children: createCellContent(r.comments),
                    borders,
                  }),
                ]
              });

              return [row1, row2];
            })
          ]
        })
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `DRAFT_REPLY_${new Date().toISOString().slice(0, 10)}.docx`);
}
