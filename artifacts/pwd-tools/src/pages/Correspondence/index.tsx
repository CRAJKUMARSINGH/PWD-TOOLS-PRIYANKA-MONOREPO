import { useState, useCallback } from "react";
import { Mail } from "lucide-react";
import type { View, LetterFormData } from "./types";
import { loadLetters, saveLetter, updateLetter, deleteLetter, getLetter } from "./storage";
import LetterList from "./LetterList";
import LetterForm from "./LetterForm";
import LetterDetail from "./LetterDetail";

export default function CorrespondencePage() {
  const [view, setView] = useState<View>({ name: "list" });
  const [letters, setLetters] = useState(() => loadLetters());

  const refresh = useCallback(() => setLetters(loadLetters()), []);

  function handleCreate(data: LetterFormData) {
    saveLetter(data);
    refresh();
    setView({ name: "list" });
  }

  function handleUpdate(id: string, data: LetterFormData) {
    updateLetter(id, data);
    refresh();
    setView({ name: "detail", id });
  }

  function handleDelete(id: string) {
    deleteLetter(id);
    refresh();
    setView({ name: "list" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-800 text-white px-6 py-4 shadow">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Mail size={22} />
          <div>
            <h1 className="font-bold text-lg leading-tight">पत्र-व्यवहार प्रबंधन</h1>
            <p className="text-blue-200 text-xs">
              कार्यालय अधिशासी अभियंता, सा.नि.वि., जिला खण्ड–II, उदयपुर
            </p>
          </div>
          <div className="ml-auto text-xs text-blue-300 hidden sm:block">
            सार्वजनिक निर्माण विभाग, राजस्थान सरकार
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {view.name === "list" && (
          <LetterList
            letters={letters}
            onNavigate={setView}
            onDelete={handleDelete}
          />
        )}

        {view.name === "new" && (
          <LetterForm
            initialType="new"
            onSubmit={handleCreate}
            onBack={() => setView({ name: "list" })}
          />
        )}

        {view.name === "reply" && (
          <LetterForm
            initialType="reply"
            onSubmit={handleCreate}
            onBack={() => setView({ name: "list" })}
          />
        )}

        {view.name === "edit" && (() => {
          const letter = getLetter(view.id);
          if (!letter) {
            setView({ name: "list" });
            return null;
          }
          return (
            <LetterForm
              initialType={letter.type}
              existing={letter}
              onSubmit={(data) => handleUpdate(view.id, data)}
              onBack={() => setView({ name: "detail", id: view.id })}
            />
          );
        })()}

        {view.name === "detail" && (() => {
          const letter = getLetter(view.id);
          if (!letter) {
            setView({ name: "list" });
            return null;
          }
          return (
            <LetterDetail
              letter={letter}
              onNavigate={setView}
              onDelete={handleDelete}
            />
          );
        })()}
      </div>
    </div>
  );
}
