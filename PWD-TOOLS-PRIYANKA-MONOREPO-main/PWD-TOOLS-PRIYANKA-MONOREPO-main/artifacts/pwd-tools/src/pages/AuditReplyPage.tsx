import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { CASES } from '@/data/audit-cases';
import { generateDocx } from '@/lib/generate-docx';

function loadFromStorage() {
  try {
    const data = localStorage.getItem('audit-reply-data');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export default function AuditReplyPage() {
  const [replies, setReplies] = useState<Record<string, {reply: string; comments: string}>>(loadFromStorage());

  useEffect(() => {
    localStorage.setItem('audit-reply-data', JSON.stringify(replies));
  }, [replies]);

  const handleReplyChange = (paraNo: string, field: 'reply' | 'comments', value: string) => {
    setReplies(prev => ({
      ...prev,
      [paraNo]: {
        ...prev[paraNo],
        [field]: value
      }
    }));
  };

  const handleDownload = async () => {
    await generateDocx(CASES, replies);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">अंकेक्षण प्रतिवेदन उत्तर / Audit Reply Tool — जिला प्रभाग II, उदयपुर</h1>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-accent hover:bg-accent-foreground/10 text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm border border-accent-foreground/20"
        >
          <Download className="w-4 h-4" />
          Download DOCX
        </button>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-full mx-auto bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="border-r border-border p-3 w-16 text-center font-semibold uppercase tracking-wider text-xs">Para No.</th>
                  <th className="border-r border-border p-3 w-[18%] text-left font-semibold uppercase tracking-wider text-xs">संक्षिप्त विवरण (Gist)</th>
                  <th className="border-r border-border p-3 w-[10%] text-left font-semibold uppercase tracking-wider text-xs">उत्तरदायित्व (Resp.)</th>
                  <th className="border-r border-border p-3 w-[22%] text-left font-semibold uppercase tracking-wider text-xs">अंकेक्षण आपत्ति (Observation)</th>
                  <th className="border-r border-border p-3 w-[25%] text-left font-semibold uppercase tracking-wider text-xs">उत्तर (Reply)</th>
                  <th className="p-3 w-[25%] text-left font-semibold uppercase tracking-wider text-xs">उच्चाधिकारी की टिप्पणी (Comments)</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c, idx) => (
                  <React.Fragment key={c.no}>
                    {/* Header Row for Para */}
                    <tr className="border-t-[3px] border-border/80">
                      <td rowSpan={2} className="border-r border-b border-border p-3 text-center align-middle font-bold bg-muted/30 text-xl text-primary/80">
                        {c.no}
                      </td>
                      <td colSpan={5} className="border-b border-border p-3 bg-muted/10 font-medium whitespace-pre-wrap text-xs text-foreground/80 leading-relaxed font-mono">
                        {c.header}
                      </td>
                    </tr>
                    {/* Data Row for Para */}
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-4 font-bold whitespace-pre-wrap align-top text-foreground/90 leading-relaxed">
                        {c.gist}
                      </td>
                      <td className="border-r border-border p-4 whitespace-pre-wrap align-top text-foreground/70 font-medium">
                        {c.resp}
                      </td>
                      <td className="border-r border-border p-4 whitespace-pre-wrap align-top leading-relaxed">
                        {c.obs}
                      </td>
                      <td className="border-r border-border p-0 bg-[#FFFDE7] dark:bg-[#3f3e24] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                        <textarea
                          className="w-full h-full min-h-[250px] p-4 bg-transparent resize-y outline-none placeholder:text-foreground/30 font-medium"
                          placeholder="यहाँ उत्तर टाइप करें..."
                          value={replies[c.no]?.reply || ""}
                          onChange={(e) => handleReplyChange(c.no, 'reply', e.target.value)}
                        />
                      </td>
                      <td className="p-0 bg-[#E3F2FD] dark:bg-[#1a3a5a] focus-within:ring-2 focus-within:ring-primary focus-within:relative align-top transition-shadow">
                        <textarea
                          className="w-full h-full min-h-[250px] p-4 bg-transparent resize-y outline-none placeholder:text-foreground/30 font-medium"
                          placeholder="यहाँ टिप्पणी टाइप करें..."
                          value={replies[c.no]?.comments || ""}
                          onChange={(e) => handleReplyChange(c.no, 'comments', e.target.value)}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
