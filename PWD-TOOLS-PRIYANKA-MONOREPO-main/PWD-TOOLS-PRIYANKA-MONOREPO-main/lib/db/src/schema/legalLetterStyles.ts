import { pgTable, serial, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Legal-Document-Wizard named letter styles.
 * Controls page margins, font, line height, etc. for legal letters.
 */
export const legalLetterStylesTable = pgTable("legal_letter_styles", {
  id:                  serial("id").primaryKey(),
  name:                text("name").notNull().unique(),
  pageSize:            text("page_size").notNull().default("A4"),
  marginTopMm:         real("margin_top_mm").notNull().default(25),
  marginBottomMm:      real("margin_bottom_mm").notNull().default(25),
  marginLeftMm:        real("margin_left_mm").notNull().default(25),
  marginRightMm:       real("margin_right_mm").notNull().default(25),
  paragraphSpacingPx:  real("paragraph_spacing_px").notNull().default(0),
  fontSize:            text("font_size").notNull().default("11pt"),
  lineHeight:          text("line_height").notNull().default("1.15"),
  fontFamily:          text("font_family").notNull().default("Mangal, serif"),
  isDefault:           boolean("is_default").notNull().default(false),
  createdAt:           timestamp("created_at",  { withTimezone: true }).notNull().defaultNow(),
  updatedAt:           timestamp("updated_at",  { withTimezone: true }).notNull().defaultNow()
                         .$onUpdate(() => new Date()),
});

export const insertLegalLetterStyleSchema = createInsertSchema(legalLetterStylesTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertLegalLetterStyle = z.infer<typeof insertLegalLetterStyleSchema>;
export type LegalLetterStyle       = typeof legalLetterStylesTable.$inferSelect;
