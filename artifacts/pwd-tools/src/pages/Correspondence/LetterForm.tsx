import { useState } from "react";
import { ArrowLeft, FileCheck, Save } from "lucide-react";
import type { Letter, LetterFormData, LetterLanguage, LetterType } from "./types";
import {
  DEFAULT_FROM_DESIGNATION,
  DEFAULT_FROM_DESIGNATION_EN,
  DEFAULT_FROM_NAME,
  DEFAULT_FROM_NAME_EN,
  DEFAULT_FROM_OFFICE,
  DEFAULT_FROM_OFFICE_EN,
} from "./types";

interface Props {
  initialType: LetterType;
  existing?: Letter;
  onSubmit: (data: LetterFormData) => void;
  onBack: () => void;
}

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

const LABEL = "block text-xs font-semibold text-gray-600 mb-1";
const INPUT =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const TEXTAREA = INPUT + " resize-none";

const LANGUAGE_LABEL: Record<LetterLanguage, string> = {
  hindi: "हिन्दी",
  english: "English",
  both: "हिन्दी + English",
};

export default function LetterForm({ initialType, existing, onSubmit, onBack }: Props) {
  const isEdit = !!existing;
  const isReply = (existing?.type ?? initialType) === "reply";
  const [form, setForm] = useState<LetterFormData>({
    type: existing?.type ?? initialType,
    status: existing?.status ?? "draft",
    language: existing?.language ?? "hindi",
    letterNumber: existing?.letterNumber ?? "",
    date: existing?.date ?? todayStr(),
    toName: existing?.toName ?? "",
    toDesignation: existing?.toDesignation ?? "",
    toOffice: existing?.toOffice ?? "",
    toNameEn: existing?.toNameEn ?? "",
    toDesignationEn: existing?.toDesignationEn ?? "",
    toOfficeEn: existing?.toOfficeEn ?? "",
    subject: existing?.subject ?? "",
    subjectEn: existing?.subjectEn ?? "",
    reference: existing?.reference ?? "",
    referenceEn: existing?.referenceEn ?? "",
    body: existing?.body ?? "",
    bodyEn: existing?.bodyEn ?? "",
    fromName: existing?.fromName ?? DEFAULT_FROM_NAME,
    fromDesignation: existing?.fromDesignation ?? DEFAULT_FROM_DESIGNATION,
    fromOffice: existing?.fromOffice ?? DEFAULT_FROM_OFFICE,
    fromNameEn: existing?.fromNameEn ?? DEFAULT_FROM_NAME_EN,
    fromDesignationEn: existing?.fromDesignationEn ?? DEFAULT_FROM_DESIGNATION_EN,
    fromOfficeEn: existing?.fromOfficeEn ?? DEFAULT_FROM_OFFICE_EN,
    cc: existing?.cc ?? "",
    ccEn: existing?.ccEn ?? "",
  });

  function set(field: keyof LetterFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setLanguage(language: LetterLanguage) {
    setForm((prev) => ({ ...prev, language }));
  }

  const showHindi = form.language !== "english";
  const showEnglish = form.language !== "hindi";

  function handleSubmit(status: "draft" | "final") {
    if (!form.letterNumber.trim()) {
      alert("क्रमांक / Letter number आवश्यक है");
      return;
    }
    if (form.language === "hindi" && (!form.toName.trim() || !form.subject.trim() || !form.body.trim())) {
      alert("हिन्दी में प्राप्तकर्ता, विषय और पत्र की सामग्री आवश्यक है");
      return;
    }
    if (form.language === "english" && (!form.toNameEn.trim() || !form.subjectEn.trim() || !form.bodyEn.trim())) {
      alert("In English mode, recipient, subject, and letter body are required");
      return;
    }
    if (form.language === "both" && (!form.toName.trim() || !form.subject.trim() || !form.body.trim() || !form.toNameEn.trim() || !form.subjectEn.trim() || !form.bodyEn.trim())) {
      alert("हिन्दी और English दोनों संस्करणों में प्राप्तकर्ता, विषय और सामग्री भरें");
      return;
    }
    onSubmit({ ...form, status });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button data-testid="btn-back" onClick={onBack} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-base font-bold text-gray-800">
          {isEdit ? "पत्र संपादित करें / Edit Letter" : isReply ? "प्रत्युत्तर पत्र / Reply Letter" : "नया पत्र / New Letter"}
        </h2>
      </div>

      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">Draft language / पत्र की भाषा</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LANGUAGE_LABEL) as LetterLanguage[]).map((language) => (
            <button
              key={language}
              type="button"
              data-testid={`language-${language}`}
              onClick={() => setLanguage(language)}
              className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                form.language === language ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {LANGUAGE_LABEL[language]}
            </button>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-2">Both mode keeps Hindi and English as separate versions in the preview and Word file.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>क्रमांक / Letter No. *</label>
          <input data-testid="input-letter-number" className={INPUT} value={form.letterNumber} onChange={(e) => set("letterNumber", e.target.value)} placeholder="PWD/EE/DD-II/UDR/2026/___" />
        </div>
        <div>
          <label className={LABEL}>दिनांक / Date *</label>
          <input data-testid="input-date" className={INPUT} value={form.date} onChange={(e) => set("date", e.target.value)} placeholder="DD.MM.YYYY" />
        </div>
      </div>

      <section className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">प्राप्तकर्ता / Recipient</p>
        {showHindi && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div><label className={LABEL}>नाम *</label><input data-testid="input-to-name" className={INPUT} value={form.toName} onChange={(e) => set("toName", e.target.value)} placeholder="अधीक्षण अभियंता" /></div>
            <div><label className={LABEL}>पदनाम *</label><input data-testid="input-to-designation" className={INPUT} value={form.toDesignation} onChange={(e) => set("toDesignation", e.target.value)} placeholder="अधीक्षण अभियंता" /></div>
            <div><label className={LABEL}>कार्यालय *</label><input data-testid="input-to-office" className={INPUT} value={form.toOffice} onChange={(e) => set("toOffice", e.target.value)} placeholder="सा.नि.वि., वृत्त–उदयपुर" /></div>
          </div>
        )}
        {showEnglish && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label className={LABEL}>Name *</label><input data-testid="input-to-name-en" className={INPUT} value={form.toNameEn} onChange={(e) => set("toNameEn", e.target.value)} placeholder="Superintending Engineer" /></div>
            <div><label className={LABEL}>Designation *</label><input data-testid="input-to-designation-en" className={INPUT} value={form.toDesignationEn} onChange={(e) => set("toDesignationEn", e.target.value)} placeholder="Superintending Engineer" /></div>
            <div><label className={LABEL}>Office *</label><input data-testid="input-to-office-en" className={INPUT} value={form.toOfficeEn} onChange={(e) => set("toOfficeEn", e.target.value)} placeholder="PWD Circle, Udaipur" /></div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4">
        {showHindi && <div><label className={LABEL}>विषय *</label><input data-testid="input-subject" className={INPUT} value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="विषय लिखें..." /></div>}
        {showEnglish && <div><label className={LABEL}>Subject *</label><input data-testid="input-subject-en" className={INPUT} value={form.subjectEn} onChange={(e) => set("subjectEn", e.target.value)} placeholder="Enter subject..." /></div>}
      </section>

      {isReply && (
        <section className="grid grid-cols-1 gap-4">
          {showHindi && <div><label className={LABEL}>संदर्भ</label><textarea data-testid="input-reference" className={TEXTAREA} rows={2} value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="संदर्भित पत्र का विवरण..." /></div>}
          {showEnglish && <div><label className={LABEL}>Reference</label><textarea data-testid="input-reference-en" className={TEXTAREA} rows={2} value={form.referenceEn} onChange={(e) => set("referenceEn", e.target.value)} placeholder="Reference letter details..." /></div>}
        </section>
      )}

      <section className="grid grid-cols-1 gap-4">
        {showHindi && <div><label className={LABEL}>पत्र की सामग्री *</label><textarea data-testid="input-body" className={TEXTAREA} rows={8} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="पत्र का मुख्य विषय-वस्तु यहाँ लिखें..." /></div>}
        {showEnglish && <div><label className={LABEL}>Letter body *</label><textarea data-testid="input-body-en" className={TEXTAREA} rows={8} value={form.bodyEn} onChange={(e) => set("bodyEn", e.target.value)} placeholder="Write the main body of the letter..." /></div>}
      </section>

      <section className="border border-blue-100 rounded-lg p-4 bg-blue-50">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-3">प्रेषक / Sender</p>
        {showHindi && <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div><label className={LABEL}>नाम</label><input data-testid="input-from-name" className={INPUT} value={form.fromName} onChange={(e) => set("fromName", e.target.value)} /></div>
          <div><label className={LABEL}>पदनाम</label><input data-testid="input-from-designation" className={INPUT} value={form.fromDesignation} onChange={(e) => set("fromDesignation", e.target.value)} /></div>
          <div><label className={LABEL}>कार्यालय</label><input data-testid="input-from-office" className={INPUT} value={form.fromOffice} onChange={(e) => set("fromOffice", e.target.value)} /></div>
        </div>}
        {showEnglish && <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={LABEL}>Name</label><input data-testid="input-from-name-en" className={INPUT} value={form.fromNameEn} onChange={(e) => set("fromNameEn", e.target.value)} /></div>
          <div><label className={LABEL}>Designation</label><input data-testid="input-from-designation-en" className={INPUT} value={form.fromDesignationEn} onChange={(e) => set("fromDesignationEn", e.target.value)} /></div>
          <div><label className={LABEL}>Office</label><input data-testid="input-from-office-en" className={INPUT} value={form.fromOfficeEn} onChange={(e) => set("fromOfficeEn", e.target.value)} /></div>
        </div>}
      </section>

      <section className="grid grid-cols-1 gap-4">
        {showHindi && <div><label className={LABEL}>प्रतिलिपि (एक प्रति प्रत्येक पंक्ति में)</label><textarea data-testid="input-cc" className={TEXTAREA} rows={3} value={form.cc} onChange={(e) => set("cc", e.target.value)} placeholder="मुख्य अभियंता (भवन), सा.नि.वि., जयपुर को सूचनार्थ।" /></div>}
        {showEnglish && <div><label className={LABEL}>Copy to (one per line)</label><textarea data-testid="input-cc-en" className={TEXTAREA} rows={3} value={form.ccEn} onChange={(e) => set("ccEn", e.target.value)} placeholder="Chief Engineer (Buildings), PWD, Jaipur for information." /></div>}
      </section>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
        <button data-testid="btn-save-draft" onClick={() => handleSubmit("draft")} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"><Save size={15} /> Draft सहेजें</button>
        <button data-testid="btn-save-final" onClick={() => handleSubmit("final")} className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"><FileCheck size={15} /> अंतिम रूप से सहेजें / Save Final</button>
      </div>
    </div>
  );
}
