import type { Correspondence, LetterFormData } from "./types";
import { StorageService } from "../../../../../tmp/legal_corr_manager/src/lib/storage";

// Wrapper functions using IndexedDB via StorageService
export async function loadCorrespondence(): Promise<Correspondence[]> {
  return await StorageService.loadCorrespondence();
}

export async function saveCorrespondence(data: LetterFormData): Promise<Correspondence> {
  const items = await StorageService.loadCorrespondence();
  const newItem: Correspondence = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  items.unshift(newItem);
  await StorageService.saveCorrespondence(items);
  return newItem;
}

export async function updateCorrespondence(id: string, data: Partial<LetterFormData>): Promise<Correspondence | null> {
  const items = await StorageService.loadCorrespondence();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() } as Correspondence;
  items[idx] = updated;
  await StorageService.saveCorrespondence(items);
  return updated;
}

export async function deleteCorrespondence(id: string): Promise<void> {
  const items = await StorageService.loadCorrespondence();
  const filtered = items.filter(i => i.id !== id);
  await StorageService.saveCorrespondence(filtered);
}

export async function getCorrespondence(id: string): Promise<Correspondence | undefined> {
  const items = await StorageService.loadCorrespondence();
  return items.find(i => i.id === id);
}


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
