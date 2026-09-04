export type LegalLetterStatus = "draft" | "final";

export interface LegalLetterLocal {
  id: number;
  letterNumber: string | null | undefined;
  date: string;
  toName: string | null;
  toAddress: string;
  subject: string;
  salutation: string | null;
  body: string;
  hierarchy: string[];
  copyTo: string[];
  closing: string | null;
  fromName: string | null;
  fromDesignation: string | null;
  fromOffice: string | null;
  styleId: number | null;
  styleName: string | null;
  status: LegalLetterStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LegalStyleLocal {
  id: number;
  name: string;
  pageSize?: string;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  paragraphSpacingPx: number;
  fontSize: string;
  lineHeight: string;
  fontFamily: string;
  isDefault: boolean;
}

export type LegalView =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "new" }
  | { name: "edit"; id: number }
  | { name: "print"; id: number }
  | { name: "styles" };

export const DEFAULT_FROM_NAME = "अनिल खीची";
export const DEFAULT_FROM_DESIGNATION = "अधिशासी अभियंता";
export const DEFAULT_FROM_OFFICE = "सा.नि.वि., जिला खण्ड–II, उदयपुर";
