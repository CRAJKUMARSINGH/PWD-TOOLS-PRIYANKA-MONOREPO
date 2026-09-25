import { ArrowLeft, Download, Edit2, Printer, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { exportLetterAsDocx } from "./docxExport";
import type { Letter, View } from "./types";

interface Props {
  letter: Letter;
  onNavigate: (view: View) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABEL: Record<string, string> = { new: "नया पत्र", reply: "प्रत्युत्तर" };
const STATUS_LABEL: Record<string, string> = { draft: "Draft", final: "Final" };
const LANGUAGE_LABEL: Record<string, string> = {
  hindi: "हिन्दी",
  english: "English",
  both: "हिन्दी + English",
};

// ── HTML builder (single source of truth for preview + print) ─────────────

function esc(v: string): string {
  return (v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

function buildLetterBodyHtml(letter: Letter, lang: "hindi" | "english"): string {
  const en = lang === "english";
  const toName = en ? letter.toNameEn : letter.toName;
  const toDesig = en ? letter.toDesignationEn : letter.toDesignation;
  const toOffice = en ? letter.toOfficeEn : letter.toOffice;
  const subject = en ? letter.subjectEn : letter.subject;
  const reference = en ? letter.referenceEn : letter.reference;
  const body = en ? letter.bodyEn : letter.body;
  const fromName = en ? letter.fromNameEn : letter.fromName;
  const fromDesig = en ? letter.fromDesignationEn : letter.fromDesignation;
  const fromOff = en ? letter.fromOfficeEn : letter.fromOffice;
  const cc = en ? letter.ccEn : letter.cc;

  const bodyParas = (body || "")
    .split("\n")
    .map((line) => `<p class="body-para">${esc(line)}</p>`)
    .join("");

  const ccBlock = cc
    ? `<div class="divider"></div>
       <p><strong>${en ? "Copy to:" : "प्रतिलिपि सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित:"}</strong></p>
       ${cc.split("\n").map((l, i) => `<p class="cc-line">${i + 1}. ${esc(l)}</p>`).join("")}
       <div class="blank"></div><div class="blank"></div>
       <p>(${esc(fromName)})</p>
       <p>${esc(fromDesig)}</p>`
    : "";

  return `
<div lang="${en ? "en" : "hi"}">
  <div class="office-hdr">
    <p class="hdr-1">${en ? "Office of the Executive Engineer" : "कार्यालय अधिशासी अभियंता"}</p>
    <p class="hdr-2">${en ? "Public Works Department" : "सार्वजनिक निर्माण विभाग"}</p>
    <p class="hdr-3">${en ? "District Division–II, Udaipur, Rajasthan" : "जिला खण्ड–II, उदयपुर, राजस्थान"}</p>
    <div class="hdr-rule"></div>
  </div>

  <div class="meta-row">
    <span><strong>${en ? "No.:" : "क्रमांकः"}</strong> ${esc(letter.letterNumber) || "–"}</span>
    <span><strong>${en ? "Date:" : "दिनांकः"}</strong> ${esc(letter.date)}</span>
  </div>
  <div class="blank"></div>

  <p>${en ? "सेवा में," : "सेवा में,"}</p>
  <p>${esc(toDesig)},</p>
  <p>${esc(toName)},</p>
  <p>${esc(toOffice)}${en ? "." : "।"}</p>
  <div class="blank"></div>

  <p><strong>${en ? "Subject:&nbsp;" : "विषयः–&nbsp;"}</strong>${esc(subject)}</p>
  ${reference ? `<div class="blank"></div><p><strong>${en ? "Reference:&nbsp;" : "संदर्भः–&nbsp;"}</strong>${esc(reference)}</p>` : ""}
  <div class="blank"></div>

  <p>${en ? "Sir/Madam," : "महोदय,"}</p>
  <div class="blank"></div>

  ${bodyParas}
  <div class="blank"></div>

  <p>${en ? "Yours faithfully," : "भवदीय,"}</p>
  <div class="blank"></div>
  <div class="blank"></div>
  <div class="blank"></div>

  <p>(${esc(fromName)})</p>
  <p>${esc(fromDesig)}</p>
  <p>${esc(fromOff)}</p>

  ${ccBlock}
</div>`;
}

/** Shared CSS used in both the iframe preview AND the print window */
const LETTER_CSS = `
  /* ── page ── */
  @page {
    size: A4 portrait;
    margin: 0;
    @bottom-center {
      content: "DRAFTED BY PRIYANKA JAIN, PWD UDAIPUR";
      font-size: 8pt;
      font-family: Arial, sans-serif;
      color: #000;
    }
  }
  header, footer { display: none !important; }

  html, body {
    margin: 0; padding: 0;
    background: #fff;
    color: #000;
    font-family: 'Mangal', 'Nirmala UI', 'Noto Sans Devanagari', sans-serif;
    font-size: 11pt;
  }

  /* ── page wrapper — carries the 25 mm margin ── */
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 25mm;
    box-sizing: border-box;
    background: #fff;
    margin: 0 auto;
  }

  /* ── all paragraphs: zero margin, justified ── */
  p {
    margin: 0; padding: 0;
    line-height: 1.65;
    text-align: justify;
  }

  /* ── office header ── */
  .office-hdr { text-align: center; }
  .office-hdr p { text-align: center; margin: 0; padding: 0; line-height: 1.4; }
  .hdr-1 { font-weight: 700; font-size: 14pt; }
  .hdr-2 { font-weight: 700; font-size: 13pt; }
  .hdr-3 { font-weight: 700; font-size: 12pt; }
  .hdr-rule {
    border: none;
    border-top: 1.5px solid #000;
    margin: 4px 0 0 0;
  }

  /* ── kramank / dinank row ── */
  .meta-row {
    display: flex;
    justify-content: space-between;
    line-height: 1.65;
  }

  /* ── body indent ── */
  .body-para {
    text-indent: 1.27cm;
    text-align: justify;
    margin: 0; padding: 0;
    line-height: 1.65;
  }

  /* ── cc lines ── */
  .cc-line {
    padding-left: 0.63cm;
    text-indent: 0;
    text-align: justify;
    margin: 0; padding: 0;
    padding-left: 0.63cm;
    line-height: 1.65;
  }

  /* ── blank line spacer (≡ blankLine() in docx) ── */
  .blank { height: 1.65em; display: block; }

  /* ── CC divider ── */
  .divider { border-top: 1px solid #000; margin: 0; }

  /* ── page-break between bilingual versions ── */
  .lang-break { page-break-after: always; }
`;

/**
 * Build the full standalone HTML document used for:
 *   1. The iframe preview (srcDoc)
 *   2. The print window
 */
export function buildStandaloneHtml(letter: Letter): string {
  const language = letter.language ?? "hindi";
  const parts: string[] = [];

  if (language !== "english") {
    parts.push(`<div class="${language === "both" ? "lang-break" : ""}">${buildLetterBodyHtml(letter, "hindi")}</div>`);
  }
  if (language !== "hindi") {
    parts.push(`<div>${buildLetterBodyHtml(letter, "english")}</div>`);
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Patra — ${letter.letterNumber}</title>
<style>${LETTER_CSS}</style>
</head>
<body>
<div class="page">
  ${parts.join('\n')}
</div>
</body>
</html>`;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LetterDetail({ letter, onNavigate, onDelete }: Props) {
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(1123);

  // Rebuild HTML whenever letter changes
  const html = buildStandaloneHtml(letter);

  // Auto-size iframe to content height
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    function onLoad() {
      try {
        const h = iframe!.contentDocument?.body?.scrollHeight ?? 1123;
        setIframeHeight(Math.max(h + 40, 1123));
      } catch { /* cross-origin guard */ }
    }
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [html]);

  async function handleDownload() {
    setDownloading(true);
    try { await exportLetterAsDocx(letter); }
    finally { setDownloading(false); }
  }

  function handlePrint() {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 450);
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onNavigate({ name: "list" })}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        {/* badges */}
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${letter.type === "reply" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"
          }`}>
          {TYPE_LABEL[letter.type]}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${letter.status === "final" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
          {STATUS_LABEL[letter.status]}
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
          {LANGUAGE_LABEL[letter.language] ?? "हिन्दी"}
        </span>

        <div className="flex-1" />

        {/* action buttons */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <Printer size={13} /> Print / PDF
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
        >
          <Download size={13} />
          {downloading ? "तैयार हो रहा है…" : "Word (.docx)"}
        </button>
        <button
          onClick={() => onNavigate({ name: "edit", id: letter.id })}
          className="p-1.5 rounded hover:bg-amber-50 text-gray-500 hover:text-amber-700 transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => {
            if (confirm("क्या आप इस पत्र को हटाना चाहते हैं?")) {
              onDelete(letter.id);
              onNavigate({ name: "list" });
            }
          }}
          className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ── Inline doc preview (iframe) ── */}
      {/* Outer wrapper: grey background like a document viewer */}
      <div className="rounded-lg overflow-hidden bg-slate-200 shadow-inner p-6">
        {/* Paper shadow card */}
        <div
          className="mx-auto shadow-2xl"
          style={{ width: "210mm", background: "#fff" }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="Letter Preview"
            scrolling="no"
            style={{
              width: "210mm",
              height: `${iframeHeight}px`,
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>

    </div>
  );
}
