/**
 * A4 print-faithful HTML preview of a legal letter.
 * Used both in the edit panel (live preview) and the print route.
 */
import type { LegalLetterLocal, LegalStyleLocal } from "./types";

interface Props {
  letter: Partial<LegalLetterLocal>;
  style?: LegalStyleLocal | null;
  printMode?: boolean;
}

export default function LetterPrintPreview({ letter, style, printMode = false }: Props) {
  const marginMm  = style?.marginTopMm  ?? 25;
  const fontSize  = style?.fontSize     ?? "11pt";
  const lineH     = style?.lineHeight   ?? "1.15";
  const fontFam   = style?.fontFamily   ?? "Mangal, serif";

  const pad = `${marginMm}mm`;

  const bodyLines    = (letter.body    ?? "").split("\n");
  const hierarchyLines = letter.hierarchy ?? [];
  const copyToLines  = letter.copyTo   ?? [];

  return (
    <div
      data-testid="legal-letter-preview"
      style={{
        width:      "210mm",
        minHeight:  "297mm",
        padding:    pad,
        background: "#fff",
        fontFamily: fontFam,
        fontSize,
        lineHeight: lineH,
        boxSizing:  "border-box",
        ...(printMode ? {} : {
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          borderRadius: "2px",
        }),
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "2mm" }}>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "14pt" }}>
          {letter.fromName ?? ""}
        </p>
        {letter.fromDesignation && (
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "12pt" }}>
            {letter.fromDesignation}
          </p>
        )}
        {letter.fromOffice && (
          <p style={{ margin: 0, fontSize: "11pt" }}>{letter.fromOffice}</p>
        )}
        <hr style={{ border: "none", borderTop: "2px solid #000", margin: "2mm 0 0" }} />
      </div>

      {/* ── Letter No. & Date ────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "2mm 0" }}>
        <span>No.: {letter.letterNumber ?? ""}</span>
        <span>Date: {letter.date ?? ""}</span>
      </div>

      {/* ── Hierarchy (subject labels) ───────────────────────────── */}
      {hierarchyLines.length > 0 && (
        <div style={{ margin: "2mm 0" }}>
          {hierarchyLines.map((line, i) => (
            <p key={i} style={{ margin: 0, fontWeight: i === hierarchyLines.length - 1 ? "bold" : "normal" }}>
              {line}
            </p>
          ))}
        </div>
      )}

      {/* ── Addressee ────────────────────────────────────────────── */}
      <div style={{ margin: "2mm 0" }}>
        <p style={{ margin: 0 }}>{letter.toName ?? ""}</p>
        <p style={{ margin: 0, whiteSpace: "pre-line" }}>{letter.toAddress ?? ""}</p>
      </div>

      {/* ── Subject ──────────────────────────────────────────────── */}
      {letter.subject && (
        <p style={{ margin: "2mm 0", fontWeight: "bold", textDecoration: "underline" }}>
          Sub: {letter.subject}
        </p>
      )}

      {/* ── Salutation ───────────────────────────────────────────── */}
      <p style={{ margin: "2mm 0" }}>{letter.salutation ?? "Sir/Madam,"}</p>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div style={{ margin: "2mm 0", textAlign: "justify" }}>
        {bodyLines.map((line, i) => (
          <p key={i} style={{ margin: 0, textIndent: "10mm" }}>{line}</p>
        ))}
      </div>

      {/* ── Closing ──────────────────────────────────────────────── */}
      <p style={{ margin: "4mm 0 0" }}>{letter.closing ?? "Yours faithfully,"}</p>

      {/* ── Signature block ──────────────────────────────────────── */}
      <div style={{ marginTop: "14mm" }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>({letter.fromName ?? ""})</p>
        {letter.fromDesignation && <p style={{ margin: 0 }}>{letter.fromDesignation}</p>}
        {letter.fromOffice      && <p style={{ margin: 0 }}>{letter.fromOffice}</p>}
      </div>

      {/* ── Copy to ──────────────────────────────────────────────── */}
      {copyToLines.length > 0 && (
        <div style={{ marginTop: "6mm", borderTop: "1px solid #000", paddingTop: "3mm" }}>
          <p style={{ margin: "0 0 1mm", fontWeight: "bold" }}>Copy to:</p>
          {copyToLines.map((line, i) => (
            <p key={i} style={{ margin: 0 }}>{i + 1}. {line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
