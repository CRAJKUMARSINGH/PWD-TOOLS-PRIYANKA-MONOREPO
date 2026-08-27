/**
 * Legal-Document-Wizard (LDW) — Zod request/response schemas.
 * Ported from CODE-JUNCTION/Legal-Document-Wizard/lib/api-zod/src/generated/api.ts
 * All exports are prefixed with "Legal" to avoid collision with other modules.
 */
import * as zod from "zod";

// ── Params ────────────────────────────────────────────────────────────────

export const LegalListLettersQueryParams = zod.object({
  status: zod.enum(["draft", "final"]).optional(),
  search: zod.coerce.string().optional(),
});

export const LegalGetLetterParams      = zod.object({ id: zod.coerce.number() });
export const LegalUpdateLetterParams   = zod.object({ id: zod.coerce.number() });
export const LegalDeleteLetterParams   = zod.object({ id: zod.coerce.number() });
export const LegalFinalizeLetterParams = zod.object({ id: zod.coerce.number() });
export const LegalGetStyleParams       = zod.object({ id: zod.coerce.number() });
export const LegalUpdateStyleParams    = zod.object({ id: zod.coerce.number() });
export const LegalDeleteStyleParams    = zod.object({ id: zod.coerce.number() });

// ── Shared letter shape ───────────────────────────────────────────────────

const LegalLetterRecord = zod.object({
  id:              zod.number(),
  letterNumber:    zod.string().nullish(),
  date:            zod.string().optional(),
  toName:          zod.string().nullish(),
  toAddress:       zod.string(),
  subject:         zod.string(),
  salutation:      zod.string().nullish(),
  body:            zod.string(),
  hierarchy:       zod.array(zod.string()).optional(),
  closing:         zod.string().nullish(),
  fromName:        zod.string().nullish(),
  fromDesignation: zod.string().nullish(),
  fromOffice:      zod.string().nullish(),
  styleId:         zod.number().nullish(),
  styleName:       zod.string().nullish(),
  copyTo:          zod.array(zod.string()).optional(),
  status:          zod.enum(["draft", "final"]),
  createdAt:       zod.string(),
  updatedAt:       zod.string(),
});

// ── Shared style shape ────────────────────────────────────────────────────

const LegalStyleRecord = zod.object({
  id:                 zod.number(),
  name:               zod.string(),
  pageSize:           zod.string().optional(),
  marginTopMm:        zod.number(),
  marginBottomMm:     zod.number(),
  marginLeftMm:       zod.number(),
  marginRightMm:      zod.number(),
  paragraphSpacingPx: zod.number(),
  fontSize:           zod.string(),
  lineHeight:         zod.string(),
  fontFamily:         zod.string(),
  isDefault:          zod.boolean(),
});

// ── Letter responses ──────────────────────────────────────────────────────

export const LegalListLettersResponse     = zod.array(LegalLetterRecord);
export const LegalCreateLetterResponse    = LegalLetterRecord;
export const LegalGetLetterResponse       = LegalLetterRecord;
export const LegalUpdateLetterResponse    = LegalLetterRecord;
export const LegalFinalizeLetterResponse  = LegalLetterRecord;
export const LegalDeleteLetterResponse    = zod.void();

export const LegalGetLetterStatsResponse  = zod.object({
  total: zod.number(),
  draft: zod.number(),
  final: zod.number(),
});

export const LegalGetRecentLettersResponse = zod.array(LegalLetterRecord);

// ── Style responses ───────────────────────────────────────────────────────

export const LegalListStylesResponse   = zod.array(LegalStyleRecord);
export const LegalCreateStyleResponse  = LegalStyleRecord;
export const LegalGetStyleResponse     = LegalStyleRecord;
export const LegalUpdateStyleResponse  = LegalStyleRecord;
export const LegalDeleteStyleResponse  = zod.void();

// ── Letter request bodies ─────────────────────────────────────────────────

export const LegalCreateLetterBody = zod.object({
  letterNumber:    zod.string().optional(),
  date:            zod.string().optional(),
  toName:          zod.string().optional(),
  toAddress:       zod.string(),
  subject:         zod.string(),
  salutation:      zod.string().optional(),
  body:            zod.string(),
  hierarchy:       zod.array(zod.string()).optional(),
  copyTo:          zod.array(zod.string()).optional(),
  closing:         zod.string().optional(),
  fromName:        zod.string().optional(),
  fromDesignation: zod.string().optional(),
  fromOffice:      zod.string().optional(),
  styleId:         zod.number().optional(),
  status:          zod.enum(["draft", "final"]).optional(),
});

export const LegalUpdateLetterBody = zod.object({
  letterNumber:    zod.string().optional(),
  date:            zod.string().optional(),
  toName:          zod.string().optional(),
  toAddress:       zod.string().optional(),
  subject:         zod.string().optional(),
  salutation:      zod.string().optional(),
  body:            zod.string().optional(),
  hierarchy:       zod.array(zod.string()).optional(),
  copyTo:          zod.array(zod.string()).optional(),
  closing:         zod.string().optional(),
  fromName:        zod.string().optional(),
  fromDesignation: zod.string().optional(),
  fromOffice:      zod.string().optional(),
  styleId:         zod.number().optional(),
  status:          zod.enum(["draft", "final"]).optional(),
});

// ── Style request bodies ──────────────────────────────────────────────────

export const LegalCreateStyleBody = zod.object({
  name:               zod.string(),
  pageSize:           zod.string().optional(),
  marginTopMm:        zod.number().optional(),
  marginBottomMm:     zod.number().optional(),
  marginLeftMm:       zod.number().optional(),
  marginRightMm:      zod.number().optional(),
  paragraphSpacingPx: zod.number().optional(),
  fontSize:           zod.string().optional(),
  lineHeight:         zod.string().optional(),
  fontFamily:         zod.string().optional(),
  isDefault:          zod.boolean().optional(),
});

export const LegalUpdateStyleBody = zod.object({
  name:               zod.string().optional(),
  pageSize:           zod.string().optional(),
  marginTopMm:        zod.number().optional(),
  marginBottomMm:     zod.number().optional(),
  marginLeftMm:       zod.number().optional(),
  marginRightMm:      zod.number().optional(),
  paragraphSpacingPx: zod.number().optional(),
  fontSize:           zod.string().optional(),
  lineHeight:         zod.string().optional(),
  fontFamily:         zod.string().optional(),
  isDefault:          zod.boolean().optional(),
});

// ── Inferred types ────────────────────────────────────────────────────────

export type LegalLetter            = zod.infer<typeof LegalLetterRecord>;
export type LegalCreateLetterInput = zod.infer<typeof LegalCreateLetterBody>;
export type LegalUpdateLetterInput = zod.infer<typeof LegalUpdateLetterBody>;
export type LegalLetterStats       = zod.infer<typeof LegalGetLetterStatsResponse>;
export type LegalStyle             = zod.infer<typeof LegalStyleRecord>;
export type LegalCreateStyleInput  = zod.infer<typeof LegalCreateStyleBody>;
export type LegalUpdateStyleInput  = zod.infer<typeof LegalUpdateStyleBody>;
