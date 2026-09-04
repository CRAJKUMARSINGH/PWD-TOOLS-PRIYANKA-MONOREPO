// Public API for the Correspondence feature
// Import the page via: import CorrespondencePage from '@/pages/Correspondence'
// (index.tsx already serves as the default entry point)

// Types
export type {
  Letter,
  LetterFormData,
  LetterType,
  LetterStatus,
  LetterLanguage,
  View,
} from "./types";

export {
  DEFAULT_FROM_NAME,
  DEFAULT_FROM_DESIGNATION,
  DEFAULT_FROM_OFFICE,
  DEFAULT_FROM_NAME_EN,
  DEFAULT_FROM_DESIGNATION_EN,
  DEFAULT_FROM_OFFICE_EN,
} from "./types";

// Storage helpers
export {
  loadLetters,
  saveLetter,
  updateLetter,
  deleteLetter,
  getLetter,
} from "./storage";

// DOCX export
export { exportLetterAsDocx } from "./docxExport";
