export type LetterType = "new" | "reply";
export type LetterStatus = "draft" | "final";
export type LetterLanguage = "hindi" | "english" | "both";

/**
 * A single recipient entry for "To Many" (अनेक प्राप्तकर्ता) mode.
 * Stored as JSON string in the `toMany` field on Letter.
 */
export interface ToManyEntry {
  /** unique key — used as React key and for tab id */
  id: string;
  designation: string; // पदनाम
  name: string;        // नाम
  office: string;      // कार्यालय
}

export interface Letter {
  id: string;
  type: LetterType;
  status: LetterStatus;
  language: LetterLanguage;
  letterNumber: string;
  date: string;
  toName: string;
  toDesignation: string;
  toOffice: string;
  toNameEn: string;
  toDesignationEn: string;
  toOfficeEn: string;
  subject: string;
  subjectEn: string;
  reference: string;
  referenceEn: string;
  body: string;
  bodyEn: string;
  fromName: string;
  fromDesignation: string;
  fromOffice: string;
  fromNameEn: string;
  fromDesignationEn: string;
  fromOfficeEn: string;
  cc: string;
  ccEn: string;
  /**
   * JSON-encoded ToManyEntry[] — when non-empty, the letter is sent to
   * multiple recipients. The primary `toName/toDesignation/toOffice` fields
   * are ignored and each entry gets its own page in print/docx output.
   */
  toMany: string;
  createdAt: string;
  updatedAt: string;
}

// ── helpers ────────────────────────────────────────────────────────────────

export function parseToMany(raw: string | undefined | null): ToManyEntry[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as ToManyEntry[]; }
  catch { return []; }
}

export function stringifyToMany(entries: ToManyEntry[]): string {
  return entries.length ? JSON.stringify(entries) : "";
}

export type LetterFormData = Omit<Letter, "id" | "createdAt" | "updatedAt">;

export type View =
  | { name: "list" }
  | { name: "new" }
  | { name: "reply" }
  | { name: "detail"; id: string }
  | { name: "edit"; id: string };

export const DEFAULT_FROM_NAME = "अनिल खीची";
export const DEFAULT_FROM_DESIGNATION = "अधिशासी अभियंता";
export const DEFAULT_FROM_OFFICE = "सा.नि.वि., जिला खण्ड–II, उदयपुर";
export const DEFAULT_FROM_NAME_EN = "Anil Khichi";
export const DEFAULT_FROM_DESIGNATION_EN = "Executive Engineer";
export const DEFAULT_FROM_OFFICE_EN = "PWD, District Division–II, Udaipur";

