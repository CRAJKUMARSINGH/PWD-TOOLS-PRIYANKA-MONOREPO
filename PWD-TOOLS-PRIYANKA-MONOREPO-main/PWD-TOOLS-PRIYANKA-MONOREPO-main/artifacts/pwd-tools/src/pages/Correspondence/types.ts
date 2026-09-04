export type LetterType = "new" | "reply";
export type LetterStatus = "draft" | "final";
export type LetterLanguage = "hindi" | "english" | "both";

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
  createdAt: string;
  updatedAt: string;
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


