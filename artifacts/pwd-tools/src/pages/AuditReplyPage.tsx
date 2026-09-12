import { CASES } from '@/data/audit-cases';
import { generateDocx } from '@/lib/generate-docx';
import { transliterateLastWord } from '@/lib/roman-to-hindi';
import { ArrowDown, ArrowUp, Download, FileText, Home, Languages, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadFromStorage(): Record<string, ReplyData> {
  try { const d = localStorage.getItem('audit-reply-data'); return d ? JSON.parse(d) : {}; }
  catch { return {}; }
}
function loadOrder(): string[] {
  try { const d = localStorage.getItem('audit-order'); return d ? JSON.parse(d) : []; }
  catch { return []; }
}
function loadExtraRows(): CaseEntry[] {
  try { const d = localStorage.getItem('audit-extra-rows'); return d ? JSON.parse(d) : []; }
  catch { return []; }
}
function seedDefaults(stored: Record<string, ReplyData>, cases: CaseEntry[]): Record<string, ReplyData> {
  const result = { ...stored };
  for (const c of cases) {
    if (!result[c.no]?.reply && c.defaultReply)
      result[c.no] = { reply: c.defaultReply, comments: result[c.no]?.comments ?? '' };
  }
  return result;
}
function applyOrder(cases: CaseEntry[], order: string[]): CaseEntry[] {
  if (!order.length) return cases;
  const map = new Map(cases.map(c => [c.no, c]));
  const ordered: CaseEntry[] = [];
  for (const key of order) { if (map.has(key)) ordered.push(map.get(key)!); }
  for (const c of cases) { if (!order.includes(c.no)) ordered.push(c); }
  return ordered;
}

// ── Roman-to-Hindi Textarea ───────────────────────────────────────────────────

function HindiTextarea({ value, onChange, placeholder, bgClass }:
  { value: string; onChange: (v: string) => void; placeholder: string; bgClass: string }) {
  const [romanMode, setRomanMode] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!romanMode) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const cursor = ref.current!.selectionStart;
      const before = value.slice(0, cursor);
      const after = value.slice(cursor);
      const converted = transliterateLastWord(before) + (e.key === 'Enter' ? '\n' : ' ');
      onChange(converted + after);
      requestAnimationFrame(() => {
        if (ref.current) { ref.current.selectionStart = converted.length; ref.current.selectionEnd = converted.length; }
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-end px-2 py-1 border-b border-border/40 ${bgClass}`}>
        <button type="button" onClick={() => setRomanMode(m => !m)}
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold transition-colors select-none ${
            romanMode ? 'bg-orange-500 text-white shadow' : 'bg-muted text-muted-foreground hover:bg-orange-100 hover:text-orange-700'}`}>
          <Languages className="w-3 h-3" />
          {romanMode ? 'रo ON' : 'रo'}
        </button>
      </div>
      <textarea ref={ref}
        className={`w-full flex-1 min-h-[230px] p-3 bg-transparent resize-y outline-none placeholder:text-foreground/30 font-medium text-sm leading-relaxed ${romanMode ? 'font-mono' : ''}`}
        placeholder={romanMode ? 'Roman mein type karein (space pe Hindi)...' : placeholder}
        value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown} />
      {romanMode && (
        <div className="px-2 py-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-t border-orange-200">
          💡 spacebar → Hindi: <code>mange</code>→मांगे <code>sanlagn</code>→संलग्न <code>nirast</code>→निरस्त
        </div>
      )}
    </div>
  );
}

// ── Inline Insert Form ────────────────────────────────────────────────────────

function InlineInsertForm({ afterIndex, onAdd, onCancel }:
  { afterIndex: number; onAdd: (row: CaseEntry, after: number) => void; onCancel: () => void }) {
  const [form, setForm] = useState<CaseEntry>({ no: `new-${Date.now()}`, header: '', gist: '', resp: '', obs: '' });
  function set(k: keyof CaseEntry, v: string) { setForm(p => ({ ...p, [k]: v })); }
  const cls = 'w-full border border-border rounded px-2 py-1.5 text-xs bg-background resize-none outline-none focus:ring-1 focus:ring-primary';

  return (
    <tr className="bg-emerald-50 dark:bg-emerald-950/30 border-t-2 border-emerald-400">
      <td colSpan={6} className="p-4">
        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3">
          ➕ नया पैरा — Insert after position {afterIndex + 1}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Para ID *</label>
            <input className={cls} placeholder="e.g. 4a" value={form.no} onChange={e => set('no', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">उत्तरदायित्व</label>
            <input className={cls} placeholder="सहायक अभियंता" value={form.resp} onChange={e => set('resp', e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Header (Package/Work details) *</label>
          <textarea className={cls} rows={2} placeholder="Package No. / Contractor / W.O. No. / Amount..."
            value={form.header} onChange={e => set('header', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">संक्षिप्त विवरण (Gist)</label>
            <textarea className={cls} rows={3} value={form.gist} onChange={e => set('gist', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">अंकेक्षण आपत्ति (Observation)</label>
            <textarea className={cls} rows={3} value={form.obs} onChange={e => set('obs', e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Default Reply (optional)</label>
          <textarea className={cls} rows={2} value={form.defaultReply || ''} onChange={e => set('defaultReply', e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { if (form.header.trim()) onAdd({ ...form, no: form.no.trim() || `new-${Date.now()}` }, afterIndex); }}
            className="bg-emerald-600 text-white text-xs px-4 py-1.5 rounded font-semibold hover:opacity-90">
            ✅ Insert Here
          </button>
          <button onClick={onCancel} className="bg-muted text-muted-foreground text-xs px-4 py-1.5 rounded hover:opacity-80">
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AuditReplyPage() {
  const [extraRows, setExtraRows] = useState<CaseEntry[]>(loadExtraRows);
  const baseCases: CaseEntry[] = [...CASES, ...extraRows];

  const [orderedCases, setOrderedCases] = useState<CaseEntry[]>(
    () => applyOrder(baseCases, loadOrder())
  );

  const [replies, setReplies] = useState<Record<string, ReplyData>>(
    () => seedDefaults(loadFromStorage(), orderedCases)
  );

  const [insertAfter, setInsertAfter] = useState<number>(-1);

  useEffect(() => { localStorage.setItem('audit-reply-data', JSON.stringify(replies)); }, [replies]);
  useEffect(() => { localStorage.setItem('audit-order', JSON.stringify(orderedCases.map(c => c.no))); }, [orderedCases]);
  useEffect(() => { localStorage.setItem('audit-extra-rows', JSON.stringify(extraRows)); }, [extraRows]);

  function moveUp(idx: number) {
    if (idx === 0) return;
    setOrderedCases(prev => { const n = [...prev]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; return n; });
  }
  function moveDown(idx: number) {
    setOrderedCases(prev => {
      if (idx >= prev.length - 1) return prev;
      const n = [...prev]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; return n;
    });
  }

  function handleInsert(row: CaseEntry, afterIndex: number) {
    const isNew = !CASES.find(c => c.no === row.no);
    if (isNew) setExtraRows(prev => [...prev, row]);
    setOrderedCases(prev => { const n = [...prev]; n.splice(afterIndex + 1, 0, row); return n; });
    if (row.defaultReply && !replies[row.no]?.reply)
      setReplies(prev => ({ ...prev, [row.no]: { reply: row.defaultReply!, comments: '' } }));
    setInsertAfter(-1);
  }

  function handleDelete(no: string) {
    if (!confirm(`Para "${no}" को हटाएं?`)) return;
    setExtraRows(prev => prev.filter(r => r.no !== no));
    setOrderedCases(prev => prev.filter(c => c.no !== no));
  }

  function handleReplyChange(paraNo: string, field: 'reply' | 'comments', value: string) {
    setReplies(prev => ({ ...prev, [paraNo]: { ...prev[paraNo], [field]: value } }));
  }

  const handleDownload = async () => { await generateDocx(orderedCases as typeof CASES, replies); };
  const isExtra = (no: string) => !CASES.find(c => c.no === no);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="bg-primary text-primary-foreground py-3 px-6 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* ── HOME BUTTON ── */}
          <a href="/" title="Home" className="p-1.5 rounded hover:bg-primary-foreground/10 transition-colors">
            <Home className="w-5 h-5" />
          </a>
          <FileText className="w-5 h-5 opacity-70" />
          <div>
            <h1 className="text-base font-bold tracking-tight leading-tight">
              अंकेक्षण प्रतिवेदन उत्तर / Audit Reply Tool
            </h1>
            <p className="text-xs opacity-70">
              जिला प्रभाग II, उदयपुर &nbsp;|&nbsp; {orderedCases.length} paras &nbsp;|&nbsp;
              <span className="font-semibold">↑↓</span> reorder &nbsp;
              <span className="font-semibold">➕</span> insert &nbsp;
              <span className="font-semibold">रo</span> Roman→Hindi
            </p>
          </div>
        </div>
        <button onClick={handleDownload}
          className="bg-accent hover:bg-accent-foreground/10 text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm border border-accent-foreground/20">
          <Download className="w-4 h-4" /> Download DOCX
        </button>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-full mx-auto bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="border-r border-border p-3 w-16 text-center font-semibold uppercase tracking-wider text-xs">क्र.</th>
                  <th className="border-r border-border p-3 w-[17%] text-left font-semibold uppercase tracking-wider text-xs">संक्षिप्त विवरण</th>
                  <th className="border-r border-border p-3 w-[9%] text-left font-semibold uppercase tracking-wider text-xs">उत्तरदायित्व</th>
                  <th className="border-r border-border p-3 w-[21%] text-left font-semibold uppercase tracking-wider text-xs">अंकेक्षण आपत्ति</th>
                  <th className="border-r border-border p-3 w-[24%] text-left font-semibold uppercase tracking-wider text-xs">
                    उत्तर (Reply) <span className="text-orange-500">रo</span>
                  </th>
                  <th className="p-3 w-[24%] text-left font-semibold uppercase tracking-wider text-xs">
                    उच्चाधिकारी टिप्पणी <span className="text-orange-500">रo</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderedCases.map((c, idx) => (
                  <React.Fragment key={c.no}>
                    <tr className="border-t-[3px] border-border/70">
                      {/* ── Serial cell — TOP-ALIGNED ── */}
                      <td rowSpan={2}
                        className="border-r border-b border-border p-2 text-center align-top font-bold bg-muted/30 text-primary/80">
                        {/* Serial number = position */}
                        <div className="text-xl leading-none mt-1">{idx + 1}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5 font-normal leading-none">#{c.no}</div>

                        {/* ↑↓ reorder */}
                        <div className="flex flex-col items-center gap-0.5 mt-2">
                          <button onClick={() => moveUp(idx)} disabled={idx === 0}
                            title="Move up" className="p-0.5 rounded hover:bg-primary/10 disabled:opacity-20 disabled:cursor-not-allowed">
                            <ArrowUp className="w-3.5 h-3.5 text-primary" />
                          </button>
                          <button onClick={() => moveDown(idx)} disabled={idx === orderedCases.length - 1}
                            title="Move down" className="p-0.5 rounded hover:bg-primary/10 disabled:opacity-20 disabled:cursor-not-allowed">
                            <ArrowDown className="w-3.5 h-3.5 text-primary" />
                          </button>
                        </div>

                        {/* ➕ insert after */}
                        <button onClick={() => setInsertAfter(v => v === idx ? -1 : idx)}
                          title="Insert new para after this row"
                          className={`mt-1.5 p-0.5 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 ${insertAfter === idx ? 'bg-emerald-100' : ''}`}>
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* 🗑 delete (extra rows only) */}
                        {isExtra(c.no) && (
                          <button onClick={() => handleDelete(c.no)} title="Delete"
                            className="mt-1 p-0.5 rounded text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>

                      <td colSpan={5}
                        className="border-b border-border p-3 bg-muted/10 font-medium whitespace-pre-wrap text-xs text-foreground/80 leading-relaxed font-mono">
                        {c.header}
                      </td>
                    </tr>

                    <tr className="border-b border-border">
                      <td className="border-r border-border p-3 font-bold whitespace-pre-wrap align-top text-foreground/90 leading-relaxed text-xs">{c.gist}</td>
                      <td className="border-r border-border p-3 whitespace-pre-wrap align-top text-foreground/70 font-medium text-xs">{c.resp}</td>
                      <td className="border-r border-border p-3 whitespace-pre-wrap align-top leading-relaxed text-xs">{c.obs}</td>
                      <td className="border-r border-border p-0 bg-[#FFFDE7] dark:bg-[#3f3e24] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                        <HindiTextarea value={replies[c.no]?.reply || ''} onChange={v => handleReplyChange(c.no, 'reply', v)}
                          placeholder="यहाँ उत्तर टाइप करें..." bgClass="bg-[#FFFDE7] dark:bg-[#3f3e24]" />
                      </td>
                      <td className="p-0 bg-[#E3F2FD] dark:bg-[#1a3a5a] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                        <HindiTextarea value={replies[c.no]?.comments || ''} onChange={v => handleReplyChange(c.no, 'comments', v)}
                          placeholder="यहाँ टिप्पणी टाइप करें..." bgClass="bg-[#E3F2FD] dark:bg-[#1a3a5a]" />
                      </td>
                    </tr>

                    {/* Inline insert form — slides in below the clicked row */}
                    {insertAfter === idx && (
                      <InlineInsertForm afterIndex={idx} onAdd={handleInsert} onCancel={() => setInsertAfter(-1)} />
                    )}
                  </React.Fragment>
                ))}

                {/* Append at end */}
                <tr>
                  <td colSpan={6} className="p-3 bg-muted/20 border-t-2 border-dashed border-primary/30">
                    <button onClick={() => setInsertAfter(orderedCases.length - 1)}
                      className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mx-auto">
                      <PlusCircle className="w-4 h-4" /> अंत में नया पैरा जोड़ें (Append at end)
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}