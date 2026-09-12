import { CASES } from '@/data/audit-cases';
import { generateDocx } from '@/lib/generate-docx';
import { transliterateLastWord } from '@/lib/roman-to-hindi';
import { Download, FileText, Languages, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

interface CaseEntry {
  no: string;
  header: string;
  gist: string;
  resp: string;
  obs: string;
  defaultReply?: string;
}

interface ReplyData {
  reply: string;
  comments: string;
}

// ── Storage helpers ──────────────────────────────────────────────────────────

function loadFromStorage(): Record<string, ReplyData> {
  try {
    const data = localStorage.getItem('audit-reply-data');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function loadExtraRows(): CaseEntry[] {
  try {
    const data = localStorage.getItem('audit-extra-rows');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function seedDefaults(
  stored: Record<string, ReplyData>,
  cases: CaseEntry[]
): Record<string, ReplyData> {
  const result = { ...stored };
  for (const c of cases) {
    if (!result[c.no]?.reply && c.defaultReply) {
      result[c.no] = {
        reply: c.defaultReply,
        comments: result[c.no]?.comments ?? '',
      };
    }
  }
  return result;
}

// ── Roman-to-Hindi Textarea ──────────────────────────────────────────────────

interface HindiTextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  bgClass: string;
}

function HindiTextarea({ value, onChange, placeholder, bgClass }: HindiTextareaProps) {
  const [romanMode, setRomanMode] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!romanMode) return;
    // On space or Enter, transliterate the last typed word
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const ta = ref.current!;
      const cursor = ta.selectionStart;
      const before = value.slice(0, cursor);
      const after = value.slice(cursor);
      const converted = transliterateLastWord(before) + (e.key === 'Enter' ? '\n' : ' ');
      const newVal = converted + after;
      onChange(newVal);
      // Restore cursor after state update
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.selectionStart = converted.length;
          ref.current.selectionEnd = converted.length;
        }
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className={`flex items-center justify-end px-2 py-1 border-b border-border/40 ${bgClass}`}>
        <button
          type="button"
          title={romanMode ? 'Roman→Hindi mode ON (click to turn off)' : 'Click to type in Roman and get Hindi'}
          onClick={() => setRomanMode(m => !m)}
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold transition-colors select-none ${romanMode
              ? 'bg-orange-500 text-white shadow'
              : 'bg-muted text-muted-foreground hover:bg-orange-100 hover:text-orange-700'
            }`}
        >
          <Languages className="w-3 h-3" />
          {romanMode ? 'रo ON' : 'रo'}
        </button>
      </div>
      <textarea
        ref={ref}
        className={`w-full flex-1 min-h-[230px] p-3 bg-transparent resize-y outline-none placeholder:text-foreground/30 font-medium text-sm leading-relaxed ${romanMode ? 'font-mono' : ''
          }`}
        placeholder={romanMode ? 'Roman mein type karein (space pe Hindi ho jaega)...' : placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {romanMode && (
        <div className="px-2 py-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-t border-orange-200">
          💡 Roman mode: spacebar/Enter पर auto-Hindi। उदा: <code>mange</code>→मांगे &nbsp;
          <code>atah</code>→अतः &nbsp;<code>nirast</code>→निरस्त &nbsp;<code>sanlagn</code>→संलग्न
        </div>
      )}
    </div>
  );
}

// ── New Row Form ─────────────────────────────────────────────────────────────

interface NewRowFormProps {
  onAdd: (row: CaseEntry) => void;
}

function NewRowForm({ onAdd }: NewRowFormProps) {
  const [open, setOpen] = useState(false);
  const empty: CaseEntry = { no: '', header: '', gist: '', resp: '', obs: '' };
  const [form, setForm] = useState<CaseEntry>(empty);

  function set(k: keyof CaseEntry, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleAdd() {
    if (!form.no.trim() || !form.header.trim()) return;
    onAdd({ ...form, no: form.no.trim() });
    setForm(empty);
    setOpen(false);
  }

  if (!open) {
    return (
      <tr>
        <td colSpan={6} className="p-3 bg-muted/20 border-t-2 border-dashed border-primary/30">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mx-auto"
          >
            <PlusCircle className="w-4 h-4" /> नया पैरा जोड़ें (Add New Para Row)
          </button>
        </td>
      </tr>
    );
  }

  const inputCls = 'w-full border border-border rounded px-2 py-1.5 text-xs bg-background resize-none outline-none focus:ring-1 focus:ring-primary';

  return (
    <tr className="bg-blue-50 dark:bg-blue-950/30 border-t-2 border-primary/40">
      <td colSpan={6} className="p-4">
        <div className="text-xs font-bold text-primary mb-3">📝 नया पैरा जोड़ें — New Para</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Para No. *</label>
            <input className={inputCls} placeholder="e.g. 15" value={form.no} onChange={e => set('no', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">उत्तरदायित्व (Resp.)</label>
            <input className={inputCls} placeholder="सहायक अभियंता" value={form.resp} onChange={e => set('resp', e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Header (Package/Work details) *</label>
          <textarea className={inputCls} rows={2} placeholder="Package No. / Contractor / W.O. No. / Amount..." value={form.header} onChange={e => set('header', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">संक्षिप्त विवरण (Gist)</label>
            <textarea className={inputCls} rows={3} placeholder="Gist of audit para..." value={form.gist} onChange={e => set('gist', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">अंकेक्षण आपत्ति (Observation)</label>
            <textarea className={inputCls} rows={3} placeholder="Audit observation text..." value={form.obs} onChange={e => set('obs', e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Default Reply (optional — pre-fills the reply box)</label>
          <textarea className={inputCls} rows={2} placeholder="मांगे गए दस्तावेजों की प्रतिलिपि संलग्न है। अतः आक्षेप निरस्त करवायें।" value={form.defaultReply || ''} onChange={e => set('defaultReply', e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded font-semibold hover:opacity-90">
            ✅ Add Para
          </button>
          <button onClick={() => { setOpen(false); setForm(empty); }} className="bg-muted text-muted-foreground text-xs px-4 py-1.5 rounded hover:opacity-80">
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function AuditReplyPage() {
  const [extraRows, setExtraRows] = useState<CaseEntry[]>(loadExtraRows);
  const allCases: CaseEntry[] = [...CASES, ...extraRows];

  const [replies, setReplies] = useState<Record<string, ReplyData>>(
    () => seedDefaults(loadFromStorage(), allCases)
  );

  // Persist replies
  useEffect(() => {
    localStorage.setItem('audit-reply-data', JSON.stringify(replies));
  }, [replies]);

  // Persist extra rows
  useEffect(() => {
    localStorage.setItem('audit-extra-rows', JSON.stringify(extraRows));
  }, [extraRows]);

  // When new extra row added, seed its default reply
  function handleAddRow(row: CaseEntry) {
    setExtraRows(prev => [...prev, row]);
    if (row.defaultReply && !replies[row.no]?.reply) {
      setReplies(prev => ({
        ...prev,
        [row.no]: { reply: row.defaultReply!, comments: '' },
      }));
    }
  }

  function handleDeleteRow(no: string) {
    if (!confirm(`Para ${no} को हटाएं? (Delete para ${no}?)`)) return;
    setExtraRows(prev => prev.filter(r => r.no !== no));
  }

  function handleReplyChange(paraNo: string, field: 'reply' | 'comments', value: string) {
    setReplies(prev => ({
      ...prev,
      [paraNo]: { ...prev[paraNo], [field]: value },
    }));
  }

  const handleDownload = async () => {
    await generateDocx(allCases as typeof CASES, replies);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* ── Header ── */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" />
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">
              अंकेक्षण प्रतिवेदन उत्तर / Audit Reply Tool
            </h1>
            <p className="text-xs opacity-75">जिला प्रभाग II, उदयपुर &nbsp;|&nbsp; {allCases.length} paras &nbsp;|&nbsp;
              <span className="font-semibold">रo</span> = Roman→Hindi mode (spacebar converts)
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-accent hover:bg-accent-foreground/10 text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm border border-accent-foreground/20"
        >
          <Download className="w-4 h-4" />
          Download DOCX
        </button>
      </header>

      {/* ── Table ── */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-full mx-auto bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="border-r border-border p-3 w-14 text-center font-semibold uppercase tracking-wider text-xs">Para</th>
                  <th className="border-r border-border p-3 w-[17%] text-left font-semibold uppercase tracking-wider text-xs">संक्षिप्त विवरण</th>
                  <th className="border-r border-border p-3 w-[9%] text-left font-semibold uppercase tracking-wider text-xs">उत्तरदायित्व</th>
                  <th className="border-r border-border p-3 w-[21%] text-left font-semibold uppercase tracking-wider text-xs">अंकेक्षण आपत्ति</th>
                  <th className="border-r border-border p-3 w-[24%] text-left font-semibold uppercase tracking-wider text-xs">
                    उत्तर (Reply)
                    <span className="ml-1 text-orange-500 font-bold normal-case">रo</span>
                  </th>
                  <th className="p-3 w-[24%] text-left font-semibold uppercase tracking-wider text-xs">
                    उच्चाधिकारी टिप्पणी
                    <span className="ml-1 text-orange-500 font-bold normal-case">रo</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCases.map((c) => {
                  const isExtra = extraRows.some(r => r.no === c.no);
                  return (
                    <React.Fragment key={c.no}>
                      {/* Header row */}
                      <tr className="border-t-[3px] border-border/70">
                        <td
                          rowSpan={2}
                          className="border-r border-b border-border p-3 text-center align-middle font-bold bg-muted/30 text-xl text-primary/80"
                        >
                          <div>{c.no}</div>
                          {isExtra && (
                            <button
                              onClick={() => handleDeleteRow(c.no)}
                              title="Delete this para"
                              className="mt-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          )}
                        </td>
                        <td
                          colSpan={5}
                          className="border-b border-border p-3 bg-muted/10 font-medium whitespace-pre-wrap text-xs text-foreground/80 leading-relaxed font-mono"
                        >
                          {c.header}
                        </td>
                      </tr>
                      {/* Data row */}
                      <tr className="border-b border-border">
                        <td className="border-r border-border p-3 font-bold whitespace-pre-wrap align-top text-foreground/90 leading-relaxed text-xs">
                          {c.gist}
                        </td>
                        <td className="border-r border-border p-3 whitespace-pre-wrap align-top text-foreground/70 font-medium text-xs">
                          {c.resp}
                        </td>
                        <td className="border-r border-border p-3 whitespace-pre-wrap align-top leading-relaxed text-xs">
                          {c.obs}
                        </td>
                        {/* Reply cell */}
                        <td className="border-r border-border p-0 bg-[#FFFDE7] dark:bg-[#3f3e24] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                          <HindiTextarea
                            value={replies[c.no]?.reply || ''}
                            onChange={v => handleReplyChange(c.no, 'reply', v)}
                            placeholder="यहाँ उत्तर टाइप करें..."
                            bgClass="bg-[#FFFDE7] dark:bg-[#3f3e24]"
                          />
                        </td>
                        {/* Comments cell */}
                        <td className="p-0 bg-[#E3F2FD] dark:bg-[#1a3a5a] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                          <HindiTextarea
                            value={replies[c.no]?.comments || ''}
                            onChange={v => handleReplyChange(c.no, 'comments', v)}
                            placeholder="यहाँ टिप्पणी टाइप करें..."
                            bgClass="bg-[#E3F2FD] dark:bg-[#1a3a5a]"
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                {/* Add new row form */}
                <NewRowForm onAdd={handleAddRow} />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
