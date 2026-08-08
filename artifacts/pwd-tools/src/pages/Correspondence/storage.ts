import type { Letter, LetterFormData } from "./types";

const STORAGE_KEY = "pwd_correspondence_letters";

export function loadLetters(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Letter>[];
    return parsed.map((letter) => ({
      ...letter,
      language: letter.language ?? "hindi",
      toName: letter.toName ?? "",
      toDesignation: letter.toDesignation ?? "",
      toOffice: letter.toOffice ?? "",
      toNameEn: letter.toNameEn ?? "",
      toDesignationEn: letter.toDesignationEn ?? "",
      toOfficeEn: letter.toOfficeEn ?? "",
      subject: letter.subject ?? "",
      subjectEn: letter.subjectEn ?? "",
      reference: letter.reference ?? "",
      referenceEn: letter.referenceEn ?? "",
      body: letter.body ?? "",
      bodyEn: letter.bodyEn ?? "",
      fromName: letter.fromName ?? "",
      fromDesignation: letter.fromDesignation ?? "",
      fromOffice: letter.fromOffice ?? "",
      fromNameEn: letter.fromNameEn ?? "",
      fromDesignationEn: letter.fromDesignationEn ?? "",
      fromOfficeEn: letter.fromOfficeEn ?? "",
      cc: letter.cc ?? "",
      ccEn: letter.ccEn ?? "",
    })) as Letter[];
  } catch {
    return [];
  }
}

export function saveLetter(data: LetterFormData): Letter {
  const letters = loadLetters();
  const letter: Letter = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  letters.unshift(letter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  return letter;
}

export function updateLetter(id: string, data: Partial<LetterFormData>): Letter | null {
  const letters = loadLetters();
  const idx = letters.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  letters[idx] = { ...letters[idx], ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  return letters[idx];
}

export function deleteLetter(id: string): void {
  const letters = loadLetters().filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

export function getLetter(id: string): Letter | undefined {
  return loadLetters().find((l) => l.id === id);
}
