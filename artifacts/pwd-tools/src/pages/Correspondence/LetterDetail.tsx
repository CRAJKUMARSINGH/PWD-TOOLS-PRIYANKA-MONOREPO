import { useState } from "react";
import { ArrowLeft, Download, Edit2, Trash2 } from "lucide-react";
import type { Letter, View } from "./types";
import { exportLetterAsDocx } from "./docxExport";

interface Props {
  letter: Letter;
  onNavigate: (view: View) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABEL: Record<string, string> = { new: "नया पत्र", reply: "प्रत्युत्तर" };
const STATUS_LABEL: Record<string, string> = { draft: "Draft", final: "Final" };
const LANGUAGE_LABEL: Record<string, string> = { hindi: "हिन्दी", english: "English", both: "हिन्दी + English" };

export default function LetterDetail({ letter, onNavigate, onDelete }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await exportLetterAsDocx(letter);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          data-testid="btn-back"
          onClick={() => onNavigate({ name: "list" })}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              letter.type === "reply"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {TYPE_LABEL[letter.type]}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              letter.status === "final"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {STATUS_LABEL[letter.status]}
          </span>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
            {LANGUAGE_LABEL[letter.language] ?? "हिन्दी"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="btn-download-docx"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
          >
            <Download size={13} />
            {downloading ? "तैयार हो रहा है..." : "Word डाउनलोड (.docx)"}
          </button>
          <button
            data-testid="btn-edit"
            onClick={() => onNavigate({ name: "edit", id: letter.id })}
            className="p-1.5 rounded hover:bg-amber-50 text-gray-500 hover:text-amber-700 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            data-testid="btn-delete"
            onClick={() => {
              if (confirm("क्या आप इस पत्र को हटाना चाहते हैं?")) {
                onDelete(letter.id);
                onNavigate({ name: "list" });
              }
            }}
            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* A4 Paper Preview */}
      <div
        data-testid="letter-preview"
        className="bg-white shadow-lg border border-gray-200 rounded-sm mx-auto w-full max-w-[794px] font-serif contractor-output"
        style={{ padding: "56px 56px 56px 56px", minHeight: "1123px" }}
      >
        {letter.language !== "english" && (
          <LetterLanguagePreview
            language="hindi"
            letter={letter}
            toName={letter.toName}
            toDesignation={letter.toDesignation}
            toOffice={letter.toOffice}
            subject={letter.subject}
            reference={letter.reference}
            body={letter.body}
            fromName={letter.fromName}
            fromDesignation={letter.fromDesignation}
            fromOffice={letter.fromOffice}
            cc={letter.cc}
          />
        )}
        {letter.language === "both" && <div className="border-t-2 border-dashed border-gray-300 my-0" />}
        {letter.language !== "hindi" && (
          <LetterLanguagePreview
            language="english"
            letter={letter}
            toName={letter.toNameEn}
            toDesignation={letter.toDesignationEn}
            toOffice={letter.toOfficeEn}
            subject={letter.subjectEn}
            reference={letter.referenceEn}
            body={letter.bodyEn}
            fromName={letter.fromNameEn}
            fromDesignation={letter.fromDesignationEn}
            fromOffice={letter.fromOfficeEn}
            cc={letter.ccEn}
          />
        )}
      </div>
    </div>
  );
}

function LetterLanguagePreview({
  language,
  letter,
  toName,
  toDesignation,
  toOffice,
  subject,
  reference,
  body,
  fromName,
  fromDesignation,
  fromOffice,
  cc,
}: {
  language: "hindi" | "english";
  letter: Letter;
  toName: string;
  toDesignation: string;
  toOffice: string;
  subject: string;
  reference: string;
  body: string;
  fromName: string;
  fromDesignation: string;
  fromOffice: string;
  cc: string;
}) {
  const english = language === "english";
  return (
    <div lang={english ? "en" : "hi"}>
      <div className="text-center">
        <p className="font-bold text-lg m-0 p-0 leading-tight">{english ? "Office of the Executive Engineer" : "कार्यालय अधिशासी अभियंता"}</p>
        <p className="font-bold text-base m-0 p-0 leading-tight">{english ? "Public Works Department" : "सार्वजनिक निर्माण विभाग"}</p>
        <p className="font-bold text-base m-0 p-0 leading-tight">{english ? "District Division–II, Udaipur, Rajasthan" : "जिला खण्ड–II, उदयपुर, राजस्थान"}</p>
        <div className="border-b-2 border-gray-800 my-1" />
      </div>
      <div className="flex justify-between text-sm m-0 p-0 leading-tight">
        <p className="m-0 p-0">{english ? "No.:" : "क्रमांकः"} {letter.letterNumber}</p>
        <p className="m-0 p-0">{english ? "Date:" : "दिनांकः"} {letter.date}</p>
      </div>
      <div className="text-sm m-0 p-0 leading-tight">
        <p className="m-0 p-0">{english ? "To," : "सेवा में,"}</p>
        <p className="m-0 p-0">{toDesignation},</p>
        <p className="m-0 p-0">{toName},</p>
        <p className="m-0 p-0">{toOffice}{english ? "." : "।"}</p>
      </div>
      <div className="text-sm m-0 p-0 leading-tight">
        <p className="m-0 p-0"><span className="font-bold">{english ? "Subject: " : "विषयः– "}</span>{subject}</p>
      </div>
      {reference && <div className="text-sm m-0 p-0 leading-tight"><p className="m-0 p-0"><span className="font-bold">{english ? "Reference: " : "संदर्भः– "}</span>{reference}</p></div>}
      <p className="text-sm m-0 p-0 leading-tight">{english ? "Sir/Madam," : "महोदय,"}</p>
      <div className="text-sm m-0 p-0 leading-tight">
        {(body || "").split("\n").map((line, i) => <p key={i} className="indent-8 m-0 p-0 leading-tight">{line}</p>)}
      </div>
      <p className="text-sm m-0 p-0 leading-tight">{english ? "Yours faithfully," : "भवदीय,"}</p>
      <div className="text-sm m-0 p-0 leading-tight">
        <p className="font-medium m-0 p-0">({fromName})</p>
        <p className="m-0 p-0">{fromDesignation}</p>
        <p className="m-0 p-0">{fromOffice}</p>
      </div>
      {cc && <div className="text-sm m-0 p-0 leading-tight">
        <p className="font-bold m-0 p-0">{english ? "Copy to:" : "प्रतिलिपिः–"}</p>
        {cc.split("\n").map((line, i) => <p key={i} className="m-0 p-0">{i + 1}. {line}</p>)}
      </div>}
    </div>
  );
}
