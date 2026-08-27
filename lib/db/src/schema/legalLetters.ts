import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { legalLetterStylesTable } from "./legalLetterStyles";

/**
 * Legal-Document-Wizard letters table.
 * Structured legal correspondence with named styles, hierarchy, and copyTo.
 */
export const legalLettersTable = pgTable("legal_letters", {
  id:              serial("id").primaryKey(),
  letterNumber:    text("letter_number"),
  date:            text("date").notNull().default(""),
  toName:          text("to_name"),
  toAddress:       text("to_address").notNull().default(""),
  subject:         text("subject").notNull().default(""),
  salutation:      text("salutation"),
  body:            text("body").notNull().default(""),
  hierarchy:       text("hierarchy").array().notNull().default([]),
  copyTo:          text("copy_to").array().notNull().default([]),
  closing:         text("closing"),
  fromName:        text("from_name"),
  fromDesignation: text("from_designation"),
  fromOffice:      text("from_office"),
  styleId:         integer("style_id").references(() => legalLetterStylesTable.id, {
                     onDelete: "set null",
                   }),
  status:          text("status").notNull().default("draft").$type<"draft" | "final">(),
  createdAt:       timestamp("created_at",  { withTimezone: true }).notNull().defaultNow(),
  updatedAt:       timestamp("updated_at",  { withTimezone: true }).notNull().defaultNow()
                     .$onUpdate(() => new Date()),
});

export const insertLegalLetterSchema = createInsertSchema(legalLettersTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertLegalLetter = z.infer<typeof insertLegalLetterSchema>;
export type LegalLetter       = typeof legalLettersTable.$inferSelect;
