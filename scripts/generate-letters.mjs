/**
 * generate-letters.mjs
 * Produces Letter1 and Letter2 as A4 .docx + print-ready .html (→ PDF via browser)
 * Run from repo root:  node --experimental-vm-modules scripts/generate-letters.mjs
 *
 * Uses docx package from artifacts/pwd-tools/node_modules
 */
import { mkdirSync, writeFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(
  path.join(__dirname, "../artifacts/pwd-tools/package.json")
);

const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, PageOrientation, BorderStyle,
} = require("docx");

const OUT = path.join(
  __dirname,
  "../SAMPLE-INPUT-OUTPUT/CORRESPONDENCE TOOL/OUTPUT"
);
mkdirSync(OUT, { recursive: true });

// ── Page layout constants (standing spec) ────────────────────────────────
const A4_W = 11906;   // 210 mm in twips
const A4_H = 16838;   // 297 mm in twips
const MAR = 1417;    // 25 mm in twips
const ZERO = 0;
const FONT = "Mangal";

// ── Helpers ───────────────────────────────────────────────────────────────
const sp = { before: ZERO, after: ZERO, line: 276, lineRule: "auto" };

function para(runs, align = AlignmentType.JUSTIFIED, indent = undefined) {
  return new Paragraph({
    children: runs.map(r => new TextRun({ font: FONT, size: 22, ...r })),
    alignment: align,
    spacing: sp,
    ...(indent ? { indent } : {}),
  });
}
function blank() {
  return new Paragraph({ children: [], spacing: sp });
}
function bold(text, size = 22) {
  return { text, bold: true, size };
}
function t(text, size = 22) {
  return { text, size };
}
function krDate(num, date) {
  return new Paragraph({
    children: [
      new TextRun({ text: `क्रमांकः ${num}`, font: FONT, size: 22 }),
      new TextRun({ text: "\t", font: FONT, size: 22 }),
      new TextRun({ text: `दिनांकः ${date}`, font: FONT, size: 22 }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: sp,
    tabStops: [{ type: "right", position: A4_W - MAR * 2 }],
  });
}

function pageProps() {
  return {
    page: {
      size: {
        orientation: PageOrientation.PORTRAIT,
        width: A4_W, height: A4_H,
      },
      margin: { top: MAR, right: MAR, bottom: MAR, left: MAR, header: ZERO, footer: ZERO },
    },
  };
}

// ── CC divider + lines helper ─────────────────────────────────────────────
function ccSection(lines) {
  return [
    blank(),
    new Paragraph({
      children: [],
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
      spacing: sp,
    }),
    para([bold("प्रतिलिपि सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित:")],
      AlignmentType.LEFT),
    blank(),
    ...lines.map((line, i) =>
      para([t(`${i + 1}.  ${line}`)], AlignmentType.JUSTIFIED, { left: 360 })
    ),
  ];
}

// ── Signature block ───────────────────────────────────────────────────────
function signBlock(name = "अनिल खिची") {
  return [
    para([t(`(${name})`)], AlignmentType.LEFT),
    para([t("अधिशाषी अभियंता,")], AlignmentType.LEFT),
    para([t("सा.नि.वि. जिला खण्ड द्वितीय, उदयपुर")], AlignmentType.LEFT),
  ];
}

// ════════════════════════════════════════════════════════════════════════
// LETTER 1 — EE → SE City Circle Udaipur (Blacklist / Registration Withdrawal)
// ════════════════════════════════════════════════════════════════════════
function buildLetter1() {
  const children = [
    // Header
    para([bold("राजस्थान सरकार", 28)], AlignmentType.CENTER),
    para([bold("कार्यालय अधिशाषी अभियंता, सार्वजनिक निर्माण विभाग", 26)], AlignmentType.CENTER),
    para([bold("जिला खण्ड द्वितीय, उदयपुर", 24)], AlignmentType.CENTER),
    blank(),

    // क्रमांक / दिनांक
    krDate("____________/सा.नि.वि./जि.ख.-II/उदयपुर/2026", "___________"),
    blank(),

    // Addressee
    para([t("प्रेषित:")], AlignmentType.LEFT),
    para([t("श्रीमान अधीक्षण अभियंता,")], AlignmentType.LEFT),
    para([t("सार्वजनिक निर्माण विभाग,")], AlignmentType.LEFT),
    para([t("वृत (शहर), उदयपुर।")], AlignmentType.LEFT),
    blank(),

    // विषय
    para([bold("विषय:– "), t("मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर का पंजीयन निरस्त/वापस करने अथवा समुचित समय के लिए विभागीय कार्यों से प्रतिबंधित (ब्लैकलिस्ट) करने हेतु समुचित कार्यवाही के लिए प्रकरण अग्रेषण के सम्बन्ध में।")]),
    blank(),

    // संदर्भ
    para([bold("संदर्भ:– ")], AlignmentType.LEFT),
    para([t("1.  इस कार्यालय का पत्र क्र. 642 दिनांक 17.07.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("2.  आपके कार्यालय का क्रमांक 1734 दिनांक 28.03.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("3.  इस कार्यालय का पत्र क्र. 67 दिनांक 21.04.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("4.  इस कार्यालय का पत्र क्र. 267 दिनांक 22.05.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("5.  इस कार्यालय का पत्र क्र. 846 दिनांक 21.08.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("6.  इस कार्यालय का पत्र क्र. 1785 दिनांक 16.02.2026")], AlignmentType.LEFT, { left: 360 }),
    para([t("7.  अधीक्षण अभियंता सा.नि.वि. वृत (शहर) उदयपुर का पत्र क्र. 182 दिनांक 01.05.2026")], AlignmentType.LEFT, { left: 360 }),
    para([t("8.  कार्यालय आदेश क्र. 222-224 दिनांक 11.05.2026")], AlignmentType.LEFT, { left: 360 }),
    blank(),

    // महोदय
    para([t("महोदय,")], AlignmentType.LEFT),
    blank(),
  ];

  // Body paragraphs
  const body = [
    "        उपरोक्त विषयान्तर्गत निवेदन है कि CONSTRUCTION OF VARIOUS BT ROADS UNDER DMFT SCHEME 2024-25, PACKAGE NO. DD-02/UDR/DMFT 2024-25/08 का कार्य कार्यानुबंध संख्या 74/2024-25, राशि रु. 1,05,06,950/- मेसर्स ओम साईं कन्स्ट्रक्शन 'ए' श्रेणी संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर को आवंटित किया गया था, जिसमें कार्य प्रारम्भ एवं समाप्ति की तिथि क्रमशः 01.01.2025 एवं 30.04.2025 निर्धारित थी।",
    "        2.    उक्त पैकेज के कार्य की प्रगति बढ़ाने एवं कार्य को समय पर पूर्ण करने के सम्बन्ध में इस कार्यालय द्वारा संदर्भित पत्रों के माध्यम से संवेदक को पत्राचार एवं दूरभाष पर बारम्बार सूचित किया गया था। परन्तु संवेदक ने इस कार्यालय के प्रासंगिक पत्र का कोई प्रत्युत्तर प्रस्तुत नहीं किया। इस कार्यालय के पत्र क्र. 843 दिनांक 19.08.2025 द्वारा संवेदक को बैठक हेतु आमंत्रित किया गया था परन्तु संवेदक बैठक में उपस्थित नहीं हुआ।",
    "        3.    सहायक अभियंता, उपखण्ड सायरा की रिपोर्ट के अनुसार उक्त कार्य स्थल पर दिनांक 04.02.2026 तक केवल आंशिक रूप से अर्थ-वर्क (Earth Work) का ही कार्य किया गया था, जो कि संवेदक की कार्य के प्रति घोर अरुचि दर्शाता है। तत्पश्चात संवेदक ने अपने पत्र दिनांक 29.10.2025 द्वारा सशर्त वर्क प्रोग्राम प्रस्तुत किया, जिसकी कार्य समाप्ति तिथि दिनांक 24.02.2026 दर्शाई गई थी, परन्तु दिनांक 24.02.2026 को सहायक अभियंता द्वारा स्थल निरीक्षण में केवल आंशिक रूप से Earth Work का कार्य प्रारम्भ किया गया था एवं कार्य बंद कर दिया गया था।",
    "        4.    संदर्भ 7 में उल्लेखित अधीक्षण अभियंता महोदय के पत्र एवं संदर्भ 8 में जारी कार्यालय आदेश के क्रम में कार्यानुबंध की धारा 2 एवं 3 के अंतर्गत कार्यानुबंध रिसाइड किया जा चुका है। उक्त कार्यानुबंध रिसाइड के फलस्वरूप मेसर्स ओम साईं कन्स्ट्रक्शन को रिस्क एवं कोस्ट के आधार पर पुनः निविदा प्रक्रिया पश्चात राशि रु. 10,50,695/- (अधिकतम अधिप्राप्ति पर 10.50% की दर से) संवेदक से वसूल किए जाने का निर्धारण किया गया है।",
    "        5.    संवेदक का उपरोक्त आचरण — कार्य आवंटित होने के उपरांत भी कार्य को निर्धारित समय-सीमा में पूर्ण न करना, बारम्बार सूचना दिए जाने पर भी कोई प्रतिक्रिया न देना, बैठक में अनुपस्थित रहना, एवं कार्यस्थल पर अपेक्षित प्रगति न दर्शाना — अत्यंत अनुशासनहीन, अविश्वसनीय एवं विभाग के हितों के विपरीत है।",
    "        6.    अतः आपसे सादर निवेदन है कि मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर का पंजीयन निरस्त/वापस करने अथवा समुचित समय के लिए विभागीय कार्यों से प्रतिबंधित (ब्लैकलिस्ट) करने हेतु पंजीयन नियमों के अनुसार समुचित कार्यवाही अमल में लाने हेतु प्रकरण को सक्षम अधिकारी को अग्रेषित करने की कृपा करें।",
    "        इस सम्बन्ध में समस्त आवश्यक अभिलेख / साक्ष्य इस कार्यालय में उपलब्ध हैं, जो आवश्यकतानुसार प्रस्तुत किए जा सकते हैं।",
  ];
  body.forEach(line => children.push(para([t(line)], AlignmentType.JUSTIFIED)));

  children.push(
    blank(),
    para([t("भवदीय,")], AlignmentType.LEFT),
    blank(), blank(), blank(),
    ...signBlock(),
    ...ccSection([
      "सहायक अभियंता, उपखण्ड सायरा, सा.नि.वि. — अभिलेख हेतु।",
      "कार्यालय अभिलेख।",
    ]),
    blank(), blank(),
    ...signBlock(),
  );

  return new Document({
    sections: [{ properties: pageProps(), children }],
  });
}

// ════════════════════════════════════════════════════════════════════════
// LETTER 2 — EE → CE PWD Jaipur (Recovery)
// ════════════════════════════════════════════════════════════════════════
function buildLetter2() {
  const children = [
    para([bold("राजस्थान सरकार", 28)], AlignmentType.CENTER),
    para([bold("कार्यालय अधिशाषी अभियंता, सार्वजनिक निर्माण विभाग", 26)], AlignmentType.CENTER),
    para([bold("जिला खण्ड द्वितीय, उदयपुर", 24)], AlignmentType.CENTER),
    blank(),
    krDate("____________/सा.नि.वि./जि.ख.-II/उदयपुर/2026", "___________"),
    blank(),
    para([t("प्रेषित:")], AlignmentType.LEFT),
    para([t("श्रीमान मुख्य अभियंता,")], AlignmentType.LEFT),
    para([t("सार्वजनिक निर्माण विभाग,")], AlignmentType.LEFT),
    para([t("जयपुर (राजस्थान)।")], AlignmentType.LEFT),
    blank(),
    para([bold("विषय:– "), t("मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर से रिस्क एवं कोस्ट के आधार पर निर्धारित राशि रु. 10,50,695/- की वसूली हेतु समस्त सम्बंधित विभागीय खण्डों को निर्देशित किए जाने के सम्बन्ध में।")]),
    blank(),
    para([bold("संदर्भ:– ")], AlignmentType.LEFT),
    para([t("1.  इस कार्यालय का पत्र क्र. 642 दिनांक 17.07.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("2.  अधीक्षण अभियंता, सा.नि.वि. वृत (शहर) उदयपुर का क्रमांक 1734 दिनांक 28.03.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("3.  इस कार्यालय का पत्र क्र. 267 दिनांक 22.05.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("4.  इस कार्यालय का पत्र क्र. 846 दिनांक 21.08.2025")], AlignmentType.LEFT, { left: 360 }),
    para([t("5.  इस कार्यालय का पत्र क्र. 1785 दिनांक 16.02.2026")], AlignmentType.LEFT, { left: 360 }),
    para([t("6.  अधीक्षण अभियंता, सा.नि.वि. वृत (शहर) उदयपुर का पत्र क्र. 182 दिनांक 01.05.2026")], AlignmentType.LEFT, { left: 360 }),
    para([t("7.  इस कार्यालय का कार्यालय आदेश क्र. 222-224 दिनांक 11.05.2026")], AlignmentType.LEFT, { left: 360 }),
    blank(),
    para([t("महोदय,")], AlignmentType.LEFT),
    blank(),
  ];

  const body = [
    "        उपरोक्त विषयान्तर्गत सादर निवेदन है कि CONSTRUCTION OF VARIOUS BT ROADS UNDER DMFT SCHEME 2024-25, PACKAGE NO. DD-02/UDR/DMFT 2024-25/08 का कार्य कार्यानुबंध संख्या 74/2024-25, राशि रु. 1,05,06,950/- मेसर्स ओम साईं कन्स्ट्रक्शन 'ए' श्रेणी संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर को आवंटित किया गया था। कार्य प्रारम्भ एवं समाप्ति की तिथि क्रमशः 01.01.2025 एवं 30.04.2025 निर्धारित थी।",
    "        2.    संवेदक द्वारा बारम्बार सूचित एवं आमंत्रित किए जाने के उपरांत भी निर्धारित समय-सीमा में कार्य पूर्ण नहीं किया गया। सहायक अभियंता, उपखण्ड सायरा की स्थल रिपोर्ट के अनुसार दिनांक 24.02.2026 को केवल आंशिक अर्थ-वर्क (Earth Work) ही किया गया था एवं कार्य बंद कर दिया गया था।",
    "        3.    संदर्भ 6 में उल्लेखित अधीक्षण अभियंता महोदय की अनुशंसा एवं संदर्भ 7 में जारी कार्यालय आदेश के क्रम में उक्त कार्यानुबंध को धारा 2 एवं 3 के अंतर्गत रिसाइड किया जा चुका है।",
    "        4.    कार्यानुबंध रिसाइड के फलस्वरूप रिस्क एवं कोस्ट के आधार पर पुनः निविदा प्रक्रिया पश्चात राशि रु. 10,50,695/- (अधिकतम अधिप्राप्ति पर 10.50% की दर से) मेसर्स ओम साईं कन्स्ट्रक्शन से वसूल किए जाने का निर्धारण किया गया है। यह राशि संवेदक को इस विभाग में देय किसी भी भुगतान से भी वसूल की जा सकती है।",
    "        5.    संवेदक मेसर्स ओम साईं कन्स्ट्रक्शन अन्य जिला खण्डों / विभागीय इकाइयों में भी कार्यरत हो सकता है अथवा उसका भुगतान लंबित हो सकता है। ऐसी स्थिति में उक्त बकाया वसूली हेतु समस्त सम्बंधित विभागीय खण्डों को निर्देशित किया जाना अत्यंत आवश्यक है।",
    "        6.    अतः आपसे सादर निवेदन है कि मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर से उपर्युक्त राशि रु. 10,50,695/- की वसूली सुनिश्चित किए जाने हेतु विभाग के समस्त जिला खण्डों / डिवीजनों को यह निर्देश जारी करने की कृपा करें कि —",
    "        (i)   उक्त संवेदक को किसी भी प्रकार के देय भुगतान में से उपरोक्त वसूली राशि काटकर इस कार्यालय को प्रेषित की जाए, तथा",
    "        (ii)  उक्त संवेदक को किसी नए कार्य का भुगतान करने से पूर्व इस वसूली के सम्बन्ध में इस कार्यालय को अवगत कराया जाए।",
    "        आपकी इस विषय में शीघ्र एवं सकारात्मक कार्यवाही अपेक्षित है।",
  ];
  body.forEach(line => children.push(para([t(line)], AlignmentType.JUSTIFIED)));

  children.push(
    blank(),
    para([t("भवदीय,")], AlignmentType.LEFT),
    blank(), blank(), blank(),
    ...signBlock(),
    ...ccSection([
      "अधीक्षण अभियंता, सा.नि.वि. वृत (शहर), उदयपुर — सूचनार्थ एवं आवश्यक कार्यवाही हेतु।",
      "सहायक अभियंता, उपखण्ड सायरा, सा.नि.वि. — अभिलेख हेतु।",
      "कार्यालय अभिलेख।",
    ]),
    blank(), blank(),
    ...signBlock(),
  );

  return new Document({
    sections: [{ properties: pageProps(), children }],
  });
}

// ════════════════════════════════════════════════════════════════════════
// GENERATE HTML (print-to-PDF)
// ════════════════════════════════════════════════════════════════════════
function letterToHtml(title, addressee, subject, refs, bodyParas, ccLines) {
  const refRows = refs.map((r, i) => `<p class="ref">${i + 1}.&nbsp;&nbsp;${r}</p>`).join("\n");
  const bodyRows = bodyParas.map(p => `<p class="body">${p}</p>`).join("\n");
  const ccRows = ccLines.map((c, i) => `<p class="cc-line">${i + 1}.&nbsp;&nbsp;${c}</p>`).join("\n");
  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  @page { size: A4 portrait; margin: 25mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Mangal', 'Noto Sans Devanagari', Arial, sans-serif;
         font-size: 11pt; line-height: 1.15; color: #000; }
  .center { text-align: center; }
  .bold   { font-weight: bold; }
  .blank  { height: 1.15em; }
  .kr-date { display: flex; justify-content: space-between; }
  .subject { text-align: justify; }
  .ref    { padding-left: 20pt; text-align: left; }
  .body   { text-align: justify; text-indent: 0; }
  .sign   { margin-top: 0; }
  .cc-block { border-top: 1.5pt solid #000; padding-top: 4pt; margin-top: 4pt; }
  .cc-line  { padding-left: 20pt; }
  @media print {
    body { -webkit-print-color-adjust: exact; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="no-print" style="background:#1e3a5f;color:#fff;padding:8px 16px;font-family:sans-serif;font-size:10pt;position:sticky;top:0;">
  &#128438; Print Preview &mdash; Press <strong>Ctrl+P</strong> &rarr; Save as PDF &nbsp;|&nbsp;
  <strong>Destination:</strong> Save as PDF &nbsp;|&nbsp; <strong>Paper:</strong> A4 &nbsp;|&nbsp; <strong>Margins:</strong> None (we handle margins)
</div>

<p class="center bold" style="font-size:14pt;">राजस्थान सरकार</p>
<p class="center bold" style="font-size:13pt;">कार्यालय अधिशाषी अभियंता, सार्वजनिक निर्माण विभाग</p>
<p class="center bold" style="font-size:12pt;">जिला खण्ड द्वितीय, उदयपुर</p>
<div class="blank"></div>

<div class="kr-date">
  <span>क्रमांकः ____________/सा.नि.वि./जि.ख.-II/उदयपुर/2026</span>
  <span>दिनांकः ___________</span>
</div>
<div class="blank"></div>

<p>प्रेषित:</p>
${addressee}
<div class="blank"></div>

<p class="subject"><strong>विषय:–</strong> ${subject}</p>
<div class="blank"></div>

<p><strong>संदर्भ:–</strong></p>
${refRows}
<div class="blank"></div>

<p>महोदय,</p>
<div class="blank"></div>

${bodyRows}
<div class="blank"></div>

<p>भवदीय,</p>
<div class="blank"></div>
<div class="blank"></div>
<div class="blank"></div>

<p class="sign">(अनिल खिची)</p>
<p class="sign">अधिशाषी अभियंता,</p>
<p class="sign">सा.नि.वि. जिला खण्ड द्वितीय, उदयपुर</p>

<div class="cc-block">
  <p><strong>प्रतिलिपि सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित:</strong></p>
  <div class="blank"></div>
  ${ccRows}
  <div class="blank"></div>
  <div class="blank"></div>
  <p class="sign">(अनिल खिची)</p>
  <p class="sign">अधिशाषी अभियंता,</p>
  <p class="sign">सा.नि.वि. जिला खण्ड द्वितीय, उदयपुर</p>
</div>
</body>
</html>`;
}

// ════════════════════════════════════════════════════════════════════════
// MAIN — write both DOCX files
// ════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("Generating Letter 1 (SE City Circle Udaipur)...");
  const doc1 = buildLetter1();
  const buf1 = await Packer.toBuffer(doc1);
  const out1 = path.join(OUT, "Letter1_SE_CityCircle_Udaipur_Blacklist.docx");
  writeFileSync(out1, buf1);
  console.log("  ✅ " + out1);

  console.log("Generating Letter 2 (CE PWD Jaipur)...");
  const doc2 = buildLetter2();
  const buf2 = await Packer.toBuffer(doc2);
  const out2 = path.join(OUT, "Letter2_CE_PWD_Jaipur_Recovery.docx");
  writeFileSync(out2, buf2);
  console.log("  ✅ " + out2);

  // HTML (print-to-PDF) for Letter 1
  const html1 = letterToHtml(
    "Letter1 – SE City Circle Udaipur",
    `<p>श्रीमान अधीक्षण अभियंता,</p><p>सार्वजनिक निर्माण विभाग,</p><p>वृत (शहर), उदयपुर।</p>`,
    "मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर का पंजीयन निरस्त/वापस करने अथवा समुचित समय के लिए विभागीय कार्यों से प्रतिबंधित (ब्लैकलिस्ट) करने हेतु समुचित कार्यवाही के लिए प्रकरण अग्रेषण के सम्बन्ध में।",
    [
      "इस कार्यालय का पत्र क्र. 642 दिनांक 17.07.2025",
      "आपके कार्यालय का क्रमांक 1734 दिनांक 28.03.2025",
      "इस कार्यालय का पत्र क्र. 67 दिनांक 21.04.2025",
      "इस कार्यालय का पत्र क्र. 267 दिनांक 22.05.2025",
      "इस कार्यालय का पत्र क्र. 846 दिनांक 21.08.2025",
      "इस कार्यालय का पत्र क्र. 1785 दिनांक 16.02.2026",
      "अधीक्षण अभियंता सा.नि.वि. वृत (शहर) उदयपुर का पत्र क्र. 182 दिनांक 01.05.2026",
      "कार्यालय आदेश क्र. 222-224 दिनांक 11.05.2026",
    ],
    [
      "उपरोक्त विषयान्तर्गत निवेदन है कि CONSTRUCTION OF VARIOUS BT ROADS UNDER DMFT SCHEME 2024-25, PACKAGE NO. DD-02/UDR/DMFT 2024-25/08 का कार्य कार्यानुबंध संख्या 74/2024-25, राशि रु. 1,05,06,950/- मेसर्स ओम साईं कन्स्ट्रक्शन 'ए' श्रेणी संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर को आवंटित किया गया था, जिसमें कार्य प्रारम्भ एवं समाप्ति की तिथि क्रमशः 01.01.2025 एवं 30.04.2025 निर्धारित थी।",
      "2.&nbsp;&nbsp;&nbsp;&nbsp;उक्त पैकेज के कार्य की प्रगति बढ़ाने एवं कार्य को समय पर पूर्ण करने के सम्बन्ध में इस कार्यालय द्वारा संदर्भित पत्रों के माध्यम से संवेदक को पत्राचार एवं दूरभाष पर बारम्बार सूचित किया गया था। परन्तु संवेदक ने इस कार्यालय के प्रासंगिक पत्र का कोई प्रत्युत्तर प्रस्तुत नहीं किया। इस कार्यालय के पत्र क्र. 843 दिनांक 19.08.2025 द्वारा संवेदक को बैठक हेतु आमंत्रित किया गया था परन्तु संवेदक बैठक में उपस्थित नहीं हुआ।",
      "3.&nbsp;&nbsp;&nbsp;&nbsp;सहायक अभियंता, उपखण्ड सायरा की रिपोर्ट के अनुसार उक्त कार्य स्थल पर दिनांक 04.02.2026 तक केवल आंशिक रूप से अर्थ-वर्क (Earth Work) का ही कार्य किया गया था। तत्पश्चात संवेदक ने अपने पत्र दिनांक 29.10.2025 द्वारा सशर्त वर्क प्रोग्राम प्रस्तुत किया, जिसकी कार्य समाप्ति तिथि दिनांक 24.02.2026 दर्शाई गई थी, परन्तु दिनांक 24.02.2026 को स्थल निरीक्षण में केवल आंशिक Earth Work प्रारम्भ था एवं कार्य बंद कर दिया गया था।",
      "4.&nbsp;&nbsp;&nbsp;&nbsp;संदर्भ 7 एवं 8 के क्रम में कार्यानुबंध की धारा 2 एवं 3 के अंतर्गत कार्यानुबंध रिसाइड किया जा चुका है। उक्त रिसाइड के फलस्वरूप रिस्क एवं कोस्ट के आधार पर राशि रु. 10,50,695/- (10.50% की दर से) संवेदक से वसूल किए जाने का निर्धारण किया गया है।",
      "5.&nbsp;&nbsp;&nbsp;&nbsp;संवेदक का उपरोक्त आचरण — कार्य समय पर पूर्ण न करना, सूचना पर प्रतिक्रिया न देना, बैठक में अनुपस्थित रहना — अत्यंत अनुशासनहीन एवं विभाग के हितों के विपरीत है।",
      "6.&nbsp;&nbsp;&nbsp;&nbsp;अतः आपसे सादर निवेदन है कि उक्त संवेदक का पंजीयन निरस्त/वापस करने अथवा समुचित समय के लिए ब्लैकलिस्ट करने हेतु पंजीयन नियमों के अनुसार समुचित कार्यवाही अमल में लाने हेतु प्रकरण को सक्षम अधिकारी को अग्रेषित करने की कृपा करें।",
      "इस सम्बन्ध में समस्त आवश्यक अभिलेख / साक्ष्य इस कार्यालय में उपलब्ध हैं।",
    ],
    [
      "सहायक अभियंता, उपखण्ड सायरा, सा.नि.वि. — अभिलेख हेतु।",
      "कार्यालय अभिलेख।",
    ]
  );
  const outH1 = path.join(OUT, "Letter1_SE_CityCircle_Udaipur_Blacklist_PRINT.html");
  writeFileSync(outH1, html1, "utf8");
  console.log("  ✅ " + outH1);

  // HTML for Letter 2
  const html2 = letterToHtml(
    "Letter2 – CE PWD Jaipur Recovery",
    `<p>श्रीमान मुख्य अभियंता,</p><p>सार्वजनिक निर्माण विभाग,</p><p>जयपुर (राजस्थान)।</p>`,
    "मेसर्स ओम साईं कन्स्ट्रक्शन, श्रेणी 'ए' संवेदक 2, श्यामनगर, दक्षिणी सुन्दरवास, उदयपुर से रिस्क एवं कोस्ट के आधार पर निर्धारित राशि रु. 10,50,695/- की वसूली हेतु समस्त सम्बंधित विभागीय खण्डों को निर्देशित किए जाने के सम्बन्ध में।",
    [
      "इस कार्यालय का पत्र क्र. 642 दिनांक 17.07.2025",
      "अधीक्षण अभियंता, सा.नि.वि. वृत (शहर) उदयपुर का क्रमांक 1734 दिनांक 28.03.2025",
      "इस कार्यालय का पत्र क्र. 267 दिनांक 22.05.2025",
      "इस कार्यालय का पत्र क्र. 846 दिनांक 21.08.2025",
      "इस कार्यालय का पत्र क्र. 1785 दिनांक 16.02.2026",
      "अधीक्षण अभियंता, सा.नि.वि. वृत (शहर) उदयपुर का पत्र क्र. 182 दिनांक 01.05.2026",
      "इस कार्यालय का कार्यालय आदेश क्र. 222-224 दिनांक 11.05.2026",
    ],
    [
      "उपरोक्त विषयान्तर्गत सादर निवेदन है कि CONSTRUCTION OF VARIOUS BT ROADS UNDER DMFT SCHEME 2024-25, PACKAGE NO. DD-02/UDR/DMFT 2024-25/08 का कार्य कार्यानुबंध संख्या 74/2024-25, राशि रु. 1,05,06,950/- मेसर्स ओम साईं कन्स्ट्रक्शन 'ए' श्रेणी संवेदक 2 को आवंटित था। कार्य प्रारम्भ एवं समाप्ति तिथि क्रमशः 01.01.2025 एवं 30.04.2025 निर्धारित थी।",
      "2.&nbsp;&nbsp;&nbsp;&nbsp;संवेदक द्वारा बारम्बार सूचित किए जाने के उपरांत भी निर्धारित समय-सीमा में कार्य पूर्ण नहीं किया गया। सहायक अभियंता, उपखण्ड सायरा की स्थल रिपोर्ट के अनुसार दिनांक 24.02.2026 को केवल आंशिक अर्थ-वर्क ही किया गया था एवं कार्य बंद कर दिया गया था।",
      "3.&nbsp;&nbsp;&nbsp;&nbsp;संदर्भ 6 एवं 7 के क्रम में उक्त कार्यानुबंध को धारा 2 एवं 3 के अंतर्गत रिसाइड किया जा चुका है।",
      "4.&nbsp;&nbsp;&nbsp;&nbsp;कार्यानुबंध रिसाइड के फलस्वरूप रिस्क एवं कोस्ट के आधार पर राशि रु. 10,50,695/- (अधिकतम अधिप्राप्ति पर 10.50% की दर से) मेसर्स ओम साईं कन्स्ट्रक्शन से वसूल किए जाने का निर्धारण किया गया है। यह राशि संवेदक को देय किसी भी भुगतान से भी वसूल की जा सकती है।",
      "5.&nbsp;&nbsp;&nbsp;&nbsp;संवेदक अन्य जिला खण्डों / विभागीय इकाइयों में भी कार्यरत हो सकता है अथवा उसका भुगतान लंबित हो सकता है। अतः समस्त विभागीय खण्डों को निर्देशित किया जाना आवश्यक है।",
      "6.&nbsp;&nbsp;&nbsp;&nbsp;अतः आपसे सादर निवेदन है कि विभाग के समस्त जिला खण्डों / डिवीजनों को यह निर्देश जारी करने की कृपा करें कि — <br>(i) उक्त संवेदक को किसी भी प्रकार के देय भुगतान में से वसूली राशि काटकर इस कार्यालय को प्रेषित की जाए, तथा <br>(ii) संवेदक को किसी नए कार्य का भुगतान करने से पूर्व इस कार्यालय को अवगत कराया जाए।",
      "आपकी इस विषय में शीघ्र एवं सकारात्मक कार्यवाही अपेक्षित है।",
    ],
    [
      "अधीक्षण अभियंता, सा.नि.वि. वृत (शहर), उदयपुर — सूचनार्थ एवं आवश्यक कार्यवाही हेतु।",
      "सहायक अभियंता, उपखण्ड सायरा, सा.नि.वि. — अभिलेख हेतु।",
      "कार्यालय अभिलेख।",
    ]
  );
  const outH2 = path.join(OUT, "Letter2_CE_PWD_Jaipur_Recovery_PRINT.html");
  writeFileSync(outH2, html2, "utf8");
  console.log("  ✅ " + outH2);

  console.log("\nDone. Files saved to:\n  " + OUT);
}

main().catch(e => { console.error(e); process.exit(1); });
