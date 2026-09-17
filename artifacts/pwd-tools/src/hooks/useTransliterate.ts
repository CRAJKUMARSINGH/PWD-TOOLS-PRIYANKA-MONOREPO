import { useCallback, useRef } from "react";

/**
 * Calls the Google Input Tools transliteration endpoint.
 * Returns the top Hindi suggestion for a given Roman word,
 * or the original word on any error.
 */
async function transliterateWord(word: string): Promise<string> {
  if (!word.trim()) return word;
  try {
    const url =
      `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;
    const res = await fetch(url);
    if (!res.ok) return word;
    const json = await res.json();
    // Response shape: ["SUCCESS", [["word", ["suggestion1", ...]]]]
    const suggestion: string | undefined = json?.[1]?.[0]?.[1]?.[0];
    return suggestion ?? word;
  } catch {
    return word;
  }
}

/**
 * useTransliterate
 *
 * Returns an onKeyDown handler to attach to a textarea.
 * When the user presses Space or Enter, the last Roman word
 * in the textarea is replaced with its Hindi transliteration.
 *
 * @param value   - current textarea value (controlled)
 * @param onChange - setter for the value
 */
export function useTransliterate(
  value: string,
  onChange: (v: string) => void
) {
  // Track whether we are mid-transliteration to avoid double-firing
  const pending = useRef(false);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== " " && e.key !== "Enter") return;
      if (pending.current) return;

      const textarea = e.currentTarget;
      const cursor = textarea.selectionStart ?? value.length;
      const textUpToCursor = value.slice(0, cursor);

      // Find the last Roman word before the cursor
      const match = textUpToCursor.match(/([A-Za-z]+)$/);
      if (!match) return;

      const romanWord = match[1];
      const wordStart = cursor - romanWord.length;

      pending.current = true;
      const hindi = await transliterateWord(romanWord);
      pending.current = false;

      if (hindi === romanWord) return; // nothing changed

      // Replace the Roman word with the Hindi result
      const before = value.slice(0, wordStart);
      const after = value.slice(cursor);
      const separator = e.key === "Enter" ? "\n" : " ";
      onChange(before + hindi + separator + after);

      // Prevent the original space/enter from being inserted (we added it above)
      e.preventDefault();

      // Restore cursor position after the inserted Hindi word + separator
      const newCursor = wordStart + hindi.length + 1;
      requestAnimationFrame(() => {
        textarea.selectionStart = newCursor;
        textarea.selectionEnd = newCursor;
      });
    },
    [value, onChange]
  );

  return { handleKeyDown };
}
