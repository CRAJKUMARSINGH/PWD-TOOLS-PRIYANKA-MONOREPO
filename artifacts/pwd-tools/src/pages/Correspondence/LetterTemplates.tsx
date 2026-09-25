/**
 * LetterTemplates — ready-made PWD letter templates
 * One click → .docx download. No form needed.
 */
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { exportLetterAsDocx } from "./docxExport";
import type { Letter } from "./types";

// ── Template data ──────────────────────────────────────────────────────────

/** Build a full Letter shell from partial data */
function makeTemplate(partial: Partial<Letter> & { subject: string; body: string }): Letter {
    return {
        id: "tpl",
        type: "reply",
        status: "final",
        language: "hindi",
        letterNumber: "",
        date: todayStr(),
        toName: "",
        toDesignation: "",
        toOffice: "",
        toNameEn: "",
        toDesignationEn: "",
        toOfficeEn: "",
        subjectEn: "",
        reference: "",
        referenceEn: "",
        bodyEn: "",
        fromName: "अनिल खीची",
        fromDesignation: "अधिशासी अभियंता",
        fromOffice: "सा.नि.वि., जिला खण्ड–II, उदयपुर",
        fromNameEn: "",
        fromDesignationEn: "",
        fromOfficeEn: "",
        cc: "",
        ccEn: "",
        toMany: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...partial,
    };
}

function todayStr(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

// ── The screenshot letter ──────────────────────────────────────────────────

const TEMPLATES: {
    id: string;
    label: string;           // short name shown on card
    desc: string;            // one-line description
    refNo: string;           // संदर्भ पत्र क्रमांक
    getLetter: (letterNo: string, date: string, toDesig: string, toName: string, toOffice: string, refNo: string) => Letter;
}[] = [
        {
            id: "anupalna-report",
            label: "अनुपालना रिपोर्ट भेजने का पत्र",
            desc: "विशेष जांच प्रतिवेदन 2025-26 — आदेशों की अनुपालना रिपोर्ट भिजवाने बाबत",
            refNo: "एक2(1308)अनु.14/SAR/2025-26/दी-3435 दिनांक 01/07/2026",
            getLetter: (letterNo, date, toDesig, toName, toOffice, refNo) =>
                makeTemplate({
                    type: "reply",
                    letterNumber: letterNo,
                    date,
                    toDesignation: toDesig,
                    toName,
                    toOffice,
                    subject: "विशेष जांच प्रतिवेदन वर्ष 2025-26 के संबंध में आदेशों की अनुपालना रिपोर्ट भिजवाने बाबत",
                    reference: `आपका पत्र क्रमांक ${refNo}`,
                    body:
                        "उपरोक्त विषयान्तर्गत एवं प्रासंगिक पत्र के संदर्भ में लेख है कि आपके कार्यालय द्वारा भिजवाए गए विशेष जांच प्रतिवेदन वर्ष 2025-26 की छायाप्रति में उल्लेखित आदेशों/बिन्दुओं की इस कार्यालय द्वारा विस्तृत समीक्षा एवं जांच कर ली गई है। उक्त जांच प्रतिवेदन में उठाए गए आदेशों की बिन्दुवार ठोस एवं पूर्ण प्रथम अनुपालना/टिप्पणी (Compliance Report) इस पत्र के साथ संलग्न कर आगामी आवश्यक कार्यवाही हेतु सादर प्रेषित है।\n\nसलग्नकः बिन्दुवार विस्तृत अनुपालना रिपोर्ट (Detailed Compliance Report)",
                    cc: "मुख्य अभियंता सार्वजनिक निर्माण विभाग, राजस्थान, जयपुर",
                }),
        },
    ];

// ── Component ──────────────────────────────────────────────────────────────

export default function LetterTemplates() {
    return (
        <div className="border border-amber-200 rounded-xl bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-amber-700" />
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    त्वरित टेम्पलेट — एक क्लिक में डाउनलोड
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {TEMPLATES.map((tpl) => (
                    <TemplateCard key={tpl.id} tpl={tpl} />
                ))}
            </div>
        </div>
    );
}

// ── Template card with inline fill form ───────────────────────────────────

function TemplateCard({
    tpl,
}: {
    tpl: (typeof TEMPLATES)[number];
}) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [letterNo, setLetterNo] = useState("");
    const [date, setDate] = useState(todayStr());
    const [toDesig, setToDesig] = useState("मुख्य अभियंता");
    const [toName, setToName] = useState("");
    const [toOffice, setToOffice] = useState("सार्वजनिक निर्माण विभाग, राजस्थान, जयपुर");
    const [refNo, setRefNo] = useState(tpl.refNo);

    async function handleDownload() {
        setBusy(true);
        try {
            const letter = tpl.getLetter(letterNo, date, toDesig, toName, toOffice, refNo);
            await exportLetterAsDocx(letter);
        } finally {
            setBusy(false);
        }
    }

    const INPUT = "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";
    const LABEL = "block text-xs font-semibold text-gray-600 mb-0.5";

    return (
        <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{tpl.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tpl.desc}</p>
                </div>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="shrink-0 text-xs font-semibold text-amber-700 border border-amber-300 rounded-md px-3 py-1.5 hover:bg-amber-50 transition-colors"
                >
                    {open ? "बंद करें ▲" : "भरें और डाउनलोड करें ▼"}
                </button>
            </div>

            {/* Expandable fill form */}
            {open && (
                <div className="border-t border-amber-100 px-4 pb-4 pt-3 bg-amber-50/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

                        <div>
                            <label className={LABEL}>क्रमांक (Letter No.)</label>
                            <input className={INPUT} value={letterNo}
                                onChange={(e) => setLetterNo(e.target.value)}
                                placeholder="PWD/EE/DD-II/UDR/2026/___" />
                        </div>

                        <div>
                            <label className={LABEL}>दिनांक (Date)</label>
                            <input className={INPUT} value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="DD.MM.YYYY" />
                        </div>

                        <div>
                            <label className={LABEL}>प्रति — पदनाम</label>
                            <input className={INPUT} value={toDesig}
                                onChange={(e) => setToDesig(e.target.value)}
                                placeholder="मुख्य अभियंता" />
                        </div>

                        <div>
                            <label className={LABEL}>प्रति — नाम</label>
                            <input className={INPUT} value={toName}
                                onChange={(e) => setToName(e.target.value)}
                                placeholder="श्री रामलाल शर्मा" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={LABEL}>प्रति — कार्यालय</label>
                            <input className={INPUT} value={toOffice}
                                onChange={(e) => setToOffice(e.target.value)}
                                placeholder="सार्वजनिक निर्माण विभाग, राजस्थान, जयपुर" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={LABEL}>संदर्भ पत्र क्रमांक</label>
                            <input className={INPUT} value={refNo}
                                onChange={(e) => setRefNo(e.target.value)} />
                        </div>

                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={busy}
                        className="flex items-center gap-2 px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 disabled:opacity-60 transition-colors"
                    >
                        <Download size={15} />
                        {busy ? "तैयार हो रहा है…" : "Word (.docx) डाउनलोड करें"}
                    </button>
                </div>
            )}
        </div>
    );
}
