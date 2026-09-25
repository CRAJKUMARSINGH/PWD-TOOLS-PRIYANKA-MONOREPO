/**
 * useTranslit — Roman-to-Hindi transliteration hook for input / textarea
 *
 * Usage:
 *   const tl = useTranslit(enabled, value, onChange);
 *   <input {...tl.bind} />
 *
 * Behaviour:
 *  - When `enabled` is true, pressing Space / Enter / । automatically
 *    converts the last typed Roman word to Devanagari in-place.
 *  - Ctrl+Z undoes the last conversion (restores the Roman word).
 *  - When `enabled` is false the input/textarea behaves normally.
 */

import { useRef } from "react";
import { convertLastWord } from "./transliterate";

export interface TranslitBindings {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    lang: "hi" | undefined;
    spellCheck: boolean;
}

export function useTranslit(
    enabled: boolean,
    value: string,
    onChange: (v: string) => void,
): TranslitBindings {
    // keep the last pre-conversion snapshot so Ctrl+Z can undo
    const prevRef = useRef<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        onChange(e.target.value);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!enabled) return;

        // Ctrl+Z → undo last conversion
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && prevRef.current !== null) {
            e.preventDefault();
            onChange(prevRef.current);
            prevRef.current = null;
            return;
        }

        // Trigger conversion on Space, Enter, or । (Devanagari danda)
        if (e.key === " " || e.key === "Enter" || e.key === "।") {
            const el = e.currentTarget;
            // Append the trigger character first so convertLastWord sees it
            const next = value + e.key;
            const converted = convertLastWord(next);
            if (converted !== next) {
                e.preventDefault();
                prevRef.current = value; // save undo snapshot
                // Restore cursor after the converted word + the trigger char
                const newVal = converted;
                onChange(newVal);
                // Re-position cursor at end (for textarea with cursor in middle: best-effort)
                requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = newVal.length;
                });
            }
            // If nothing changed, let the browser handle the keystroke normally
        }
    }

    return {
        value,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        lang: enabled ? "hi" : undefined,
        spellCheck: false,
    };
}
