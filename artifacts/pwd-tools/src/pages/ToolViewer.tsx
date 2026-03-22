import { useLocation, useParams } from "wouter";
import BillForm from "@/pages/BillForm";

const TOOL_MAP: Record<string, { name: string; icon: string; htmlFile: string | null }> = {
  "bill-generator":           { name: "Bill Generator",            icon: "🏗️", htmlFile: "BillGenerator.html" },
  "emd-refund":               { name: "EMD Refund",                icon: "💸", htmlFile: "EmdRefund.html" },
  "security-refund":          { name: "Security Refund",           icon: "🔒", htmlFile: "SecurityRefund.html" },
  "bill-note-sheet":          { name: "Bill Note Sheet",           icon: "📝", htmlFile: "BillNoteSheet.html" },
  "deductions-table":         { name: "Deductions Table",          icon: "➖", htmlFile: "DeductionsTable.html" },
  "financial-progress":       { name: "Financial Progress",        icon: "📈", htmlFile: "FinancialProgressTracker.html" },
  "apg-calculator":           { name: "APG Calculator",            icon: "🧮", htmlFile: "ApgCalculator.html" },
  "delay-calculator":         { name: "Delay Calculator",          icon: "⏱️", htmlFile: "DelayCalculator.html" },
  "stamp-duty":               { name: "Stamp Duty",                icon: "⚖️", htmlFile: "StampDuty.html" },
  "bill-deviation-generator": { name: "Bill Deviation Generator",  icon: "📋", htmlFile: "BillDeviationGenerator.html" },
  "hindi-bill-note-sheet":    { name: "Hindi Bill Note Sheet",     icon: "📄", htmlFile: null },
};

export default function ToolViewer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const tool = TOOL_MAP[id ?? ""];

  if (!tool) {
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <div style={{ fontSize: "48px" }}>❓</div>
        <h2 style={{ color: "#1a237e" }}>Tool not found</h2>
        <button onClick={() => navigate("/")} style={backBtnStyle}>← Back to Home</button>
      </div>
    );
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        background: "linear-gradient(135deg, #1a237e 0%, #7b1fa2 100%)",
        color: "white",
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          🏠 Home
        </button>
        <span style={{ fontSize: "20px" }}>{tool.icon}</span>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{tool.name}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tool.htmlFile ? (
          <iframe
            src={`${base}/tools/${tool.htmlFile}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title={tool.name}
          />
        ) : (
          /* Hindi Bill Note Sheet — rendered as React component */
          <div style={{ height: "100%", overflowY: "auto" }}>
            <BillForm />
          </div>
        )}
      </div>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "10px 20px",
  background: "#1a237e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
};
